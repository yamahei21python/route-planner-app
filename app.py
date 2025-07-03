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

# --- UIコンポーネント ---
st.title("🗺️ 最適経路提案アプリ")
st.write("出発地と複数の目的地を入力すると、最も効率的な巡回ルートを計算します。")

# --- 入力フォーム ---
with st.form("route_form"):
    start_point = st.text_input("**出発地 兼 帰着地**", placeholder="例：東京駅")
    st.subheader("**目的地**")

    for i in range(len(st.session_state.destinations)):
        st.session_state.destinations[i] = st.text_input(
            f"目的地 {i+1}",
            value=st.session_state.destinations[i],
            key=f"dest_{i}"
        )

    col1, col2, col3 = st.columns(3)
    with col1:
        if st.form_submit_button("＋ 目的地を追加"):
            st.session_state.destinations.append('')
            st.rerun()
    with col2:
        if st.form_submit_button("－ 最後の目的地を削除"):
            if len(st.session_state.destinations) > 1:
                st.session_state.destinations.pop()
                st.rerun()
    with col3:
        if st.form_submit_button("クリア"):
            st.session_state.destinations = ['']
            st.rerun()

    submitted = st.form_submit_button("最適経路を検索", type="primary")

# --- 検索処理と結果表示 ---
if submitted:
    destinations_input = [d for d in st.session_state.destinations if d.strip()]
    if not start_point or not destinations_input:
        st.warning("出発地と少なくとも1つの目的地を入力してください。")
    else:
        with st.spinner('最適経路を検索中...'):
            try:
                directions_result = gmaps.directions(
                    origin=start_point,
                    destination=start_point,
                    waypoints=destinations_input,
                    optimize_waypoints=True
                )

                if not directions_result:
                    st.error("経路が見つかりませんでした。住所を確認してください。")
                else:
                    st.success("✅ 最適経路の計算が完了しました！")

                    optimized_order = directions_result[0]['waypoint_order']
                    optimized_destinations = [destinations_input[i] for i in optimized_order]

                    # --- 地図表示と各種ボタン ---
                    st.subheader("▼ 地図で確認")
                    
                    try:
                        # (1) URLを両方とも準備する
                        api_key = st.secrets["Maps_api_key"]
                        origin_encoded = urllib.parse.quote(start_point)
                        waypoints_encoded = "|".join([urllib.parse.quote(dest) for dest in optimized_destinations])
                        embed_url = (
                            f"https://www.google.com/maps/embed/v1/directions"
                            f"?key={api_key}"
                            f"&origin={origin_encoded}"
                            f"&destination={origin_encoded}"
                            f"&waypoints={waypoints_encoded}"
                        )
                        
                        full_route_locations = [start_point] + optimized_destinations + [start_point]
                        encoded_locations = [urllib.parse.quote(loc) for loc in full_route_locations]
                        standard_map_url = "https://www.google.com/maps/dir/" + "/".join(encoded_locations)
                        
                        # (2) ボタンを2列で横に並べて表示
                        col1, col2 = st.columns(2)
                        with col1:
                            st.link_button("🗺️ 新しいタブで地図を開く", url=standard_map_url, use_container_width=True)
                        
                        with col2:
                            with st.popover("📱 QRコードを表示", use_container_width=True):
                                # QRコードの生成
                                qr_img = qrcode.make(standard_map_url)
                                # メモリ上で画像を扱うためにBytesIOを使用
                                buf = io.BytesIO()
                                qr_img.save(buf)
                                buf.seek(0)
                                st.image(buf, caption="Google Maps URL")

                        # (3) 埋め込み地図を表示
                        st.write("") 
                        st.components.v1.iframe(embed_url, height=500, scrolling=True)

                    except Exception as e:
                        st.error(f"地図の表示に失敗しました。APIキーの設定などを確認してください。エラー: {e}")
                    
                    # --- テキストでの結果表示 ---
                    # 【レイアウト変更】地図の下に訪問順序を表示
                    st.subheader("▼ 最適な訪問順序")
                    route_text = f"**出発地:** {start_point}\n"
                    for i, dest in enumerate(optimized_destinations):
                        route_text += f"1. **{i+1}番目の訪問先:** {dest}\n"
                    route_text += f"**帰着地:** {start_point}"
                    st.markdown(route_text)

                    # 詳細ルートはExpander内に表示
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
