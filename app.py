import streamlit as st
import googlemaps
import urllib.parse
import qrcode
import io

# --- ページ設定 ---
st.set_page_config(
    page_title="最適経路提案アプリ",
    page_icon="🗺️",
    layout="wide"
)

# --- Google Maps APIクライアントの初期化 ---
try:
    gmaps = googlemaps.Client(key=st.secrets["Maps_api_key"])
except Exception as e:
    st.error(f"APIキー(Maps_api_key)が設定されていません。エラー: {e}")
    st.stop()

# --- Session Stateの初期化 ---
if 'destinations' not in st.session_state:
    st.session_state.destinations = ['']
if 'end_point' not in st.session_state:
    st.session_state.end_point = ''

# ===============================================================
# ▼▼▼ サイドバーの入力フォーム ▼▼▼
# ===============================================================
with st.sidebar:
    st.title("🗺️ ルート設定")

    # --- 出発地・帰着地 ---
    start_point = st.text_input("**出発地**", placeholder="例：東京駅")

    same_as_start = st.checkbox("出発地と帰着地は同じ", value=True)
    if same_as_start:
        end_point = start_point
    else:
        end_point = st.text_input("**帰着地**", key='end_point', placeholder="例：新宿駅")

    # --- 目的地 ---
    st.subheader("**目的地**")
    for i in range(len(st.session_state.destinations)):
        col1, col2 = st.columns([0.8, 0.2])
        with col1:
            st.session_state.destinations[i] = st.text_input(
                f"目的地 {i+1}",
                value=st.session_state.destinations[i],
                key=f"dest_{i}",
                label_visibility="collapsed"
            )
        with col2:
            if st.button("✖️", key=f"del_{i}", use_container_width=True):
                st.session_state.destinations.pop(i)
                st.rerun()

    if st.button("＋ 目的地を追加", use_container_width=True):
        st.session_state.destinations.append('')
        st.rerun()

    st.write("---")

    # --- 検索とクリアボタン ---
    with st.form("search_form"):
        submitted = st.form_submit_button("最適経路を検索", type="primary", use_container_width=True)

    if st.button("クリア", use_container_width=True):
        st.session_state.destinations = ['']
        st.session_state.end_point = ''
        st.rerun()

# --- メイン画面の表示 ---
st.title("最適経路提案アプリ")

if not submitted:
    st.info("サイドバーから出発地と目的地を入力し、「最適経路を検索」ボタンを押してください。")

# --- 検索処理と結果表示 ---
if submitted:
    destinations_input = [d for d in st.session_state.destinations if d.strip()]
    if not start_point or not end_point or not destinations_input:
        st.warning("出発地、帰着地、および少なくとも1つの目的地を入力してください。")
    else:
        with st.spinner('最適経路を検索中...'):
            try:
                directions_result = gmaps.directions(
                    origin=start_point,
                    destination=end_point,
                    waypoints=destinations_input,
                    optimize_waypoints=True
                )

                if not directions_result:
                    st.error("経路が見つかりませんでした。住所を確認してください。")
                else:
                    optimized_order = directions_result[0]['waypoint_order']
                    optimized_destinations = [destinations_input[i] for i in optimized_order]

                    st.subheader("▼ 地図で確認")

                    try:
                        api_key = st.secrets["Maps_api_key"]
                        origin_encoded = urllib.parse.quote(start_point)
                        destination_encoded = urllib.parse.quote(end_point)
                        waypoints_encoded = "|".join([urllib.parse.quote(dest) for dest in optimized_destinations])
                        embed_url = (
                            f"https://www.google.com/maps/embed/v1/directions"
                            f"?key={api_key}"
                            f"&origin={origin_encoded}"
                            f"&destination={destination_encoded}"
                            f"&waypoints={waypoints_encoded}"
                        )

                        full_route_locations = [start_point] + optimized_destinations + [end_point]
                        encoded_locations = [urllib.parse.quote(loc) for loc in full_route_locations]
                        standard_map_url = "https://www.google.com/maps/dir/" + "/".join(encoded_locations)

                        col1, col2 = st.columns(2)
                        with col1:
                            st.link_button("🗺️ 新しいタブで地図を開く", url=standard_map_url, use_container_width=True)

                        with col2:
                            with st.popover("📱 QRコードを表示", use_container_width=True):
                                qr = qrcode.QRCode(
                                    version=1,
                                    error_correction=qrcode.constants.ERROR_CORRECT_L,
                                    box_size=4,
                                    border=4,
                                )
                                qr.add_data(standard_map_url)
                                qr.make(fit=True)
                                qr_img = qr.make_image(fill_color="black", back_color="white")

                                buf = io.BytesIO()
                                qr_img.save(buf)
                                buf.seek(0)
                                st.image(buf, caption="Google Maps URL")

                        st.write("")
                        st.components.v1.iframe(embed_url, height=500, scrolling=True)

                    except Exception as e:
                        st.error(f"地図の表示に失敗しました。APIキーの設定などを確認してください。エラー: {e}")

                    # --- テキストでの結果表示 ---
                    st.subheader("▼ 最適な訪問順序")

                    # ▼▼▼【レイアウト修正箇所】▼▼▼
                    # 指定されたフォーマットでテキストを生成
                    route_text_lines = []
                    route_text_lines.append(f"出 発 地: {start_point}")
                    for i, dest in enumerate(optimized_destinations):
                        route_text_lines.append(f"訪 問 先{i+1}: {dest}")
                    route_text_lines.append(f"帰 着 地: {end_point}")
                    
                    final_route_text = "\n".join(route_text_lines)
                    
                    # st.text()を使い、等幅フォントで表示してレイアウトを維持
                    st.text(final_route_text)
                    # ▲▲▲【レイアウト修正箇所】▲▲▲

                    with st.expander("▼ ルート詳細を表示"):
                        total_distance = 0
                        total_duration_sec = 0
                        for i, leg in enumerate(directions_result[0]['legs']):
                            st.markdown(f"---")
                            st.markdown(f"**区間 {i+1}**")
                            st.markdown(f"🚗 **出発:** {leg['start_address']}")
                            st.markdown(f"🏁 **到着:** {leg['end_address']}")
                            st.markdown(f"📏 **距離:** {leg['distance']['text']}")
                            st.markdown(f"🕒 **所要時間:** {leg['duration']['text']}")
                            total_distance += leg['distance']['value']
                            total_duration_sec += leg['duration']['value']
                        st.markdown("---")
                        st.subheader("サマリー")
                        total_duration_min = total_duration_sec // 60
                        st.markdown(f"- **総移動距離:** {total_distance / 1000:.1f} km")
                        st.markdown(f"- **総所要時間:** 約{total_duration_min // 60}時間 {total_duration_min % 60}分")

            except googlemaps.exceptions.ApiError as e:
                st.error(f"Google Maps APIエラーが発生しました: {e}")
            except Exception as e:
                st.error(f"予期せぬエラーが発生しました: {e}")
