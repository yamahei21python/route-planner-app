import streamlit as st
import googlemaps
from math import dist
import urllib.parse # URLエンコード用

# --- ページ設定 ---
st.set_page_config(
    page_title="最適経路提案アプリ",
    page_icon="🗺️",
    layout="wide"
)

# --- Google Maps APIクライアントの初期化 ---
# 【変更点①】サーバー処理用の'backend_api_key'を読み込む
try:
    gmaps = googlemaps.Client(key=st.secrets["backend_api_key"])
except Exception as e:
    st.error(f"バックエンド用のAPIキー(backend_api_key)が設定されていません。エラー: {e}")
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
                    optimized_order = directions_result[0]['waypoint_order']
                    optimized_destinations = [destinations_input[i] for i in optimized_order]

                    st.success("✅ 最適経路の計算が完了しました！")
                    st.subheader("▼ 最適な訪問順序")
                    route_display = f"**出発地: {start_point}**\n"
                    for i, dest in enumerate(optimized_destinations):
                        route_display += f"1. {i+1}番目の訪問先: **{dest}**\n"
                    route_display += f"**帰着地: {start_point}**"
                    st.markdown(route_display)

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

                    st.subheader("▼ 地図で確認")
                    
                    try:
                        # 【変更点②】地図埋め込み用の'embed_api_key'を読み込む
                        api_key = st.secrets["embed_api_key"]
                        
                        origin_encoded = urllib.parse.quote(start_point)
                        waypoints_encoded = "|".join([urllib.parse.quote(dest) for dest in optimized_destinations])
                        
                        embed_url = (
                            f"https://www.google.com/maps/embed/v1/directions"
                            f"?key={api_key}"
                            f"&origin={origin_encoded}"
                            f"&destination={origin_encoded}"
                            f"&waypoints={waypoints_encoded}"
                        )
                        st.components.v1.iframe(embed_url, height=600, scrolling=True)

                        full_route_locations = [start_point] + optimized_destinations + [start_point]
                        encoded_locations = [urllib.parse.quote(loc) for loc in full_route_locations]
                        standard_map_url = "https://www.google.com/maps/dir/" + "/".join(encoded_locations)
                        
                        st.write("") 
                        st.link_button("🗺️ 新しいタブで地図を開く", url=standard_map_url, use_container_width=True)

                    except Exception as e:
                        st.error(f"地図埋め込み用のAPIキー(embed_api_key)が設定されていません。エラー: {e}")

            except googlemaps.exceptions.ApiError as e:
                st.error(f"Google Maps APIエラーが発生しました: {e}")
            except Exception as e:
                st.error(f"予期せぬエラーが発生しました: {e}")
