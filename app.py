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
# StreamlitのSecrets機能を使って安全にAPIキーを読み込む
try:
    gmaps = googlemaps.Client(key=st.secrets["Maps_api_key"])
except Exception:
    st.error("Google Maps APIキーが設定されていません。StreamlitのSecretsにキーを設定してください。")
    st.stop()


# --- Session Stateの初期化 ---
# ページを再読み込みしても入力内容が消えないようにする
if 'destinations' not in st.session_state:
    # 最初は目的地入力欄を1つだけ用意
    st.session_state.destinations = ['']

# --- UIコンポーネント ---
st.title("🗺️ 最適経路提案アプリ")
st.write("出発地と複数の目的地を入力すると、最も効率的な巡回ルートを計算します。")

# --- 入力フォーム ---
with st.form("route_form"):
    start_point = st.text_input("**出発地 兼 帰着地**", placeholder="例：東京駅")

    st.subheader("**目的地**")

    # 動的に目的地入力欄を表示
    for i in range(len(st.session_state.destinations)):
        # keyをユニークにしないとStreamlitが正しくウィジェットを認識できない
        st.session_state.destinations[i] = st.text_input(
            f"目的地 {i+1}",
            value=st.session_state.destinations[i],
            key=f"dest_{i}"
        )

    # 入力欄の操作ボタン
    col1, col2, col3 = st.columns(3)
    with col1:
        if st.form_submit_button("＋ 目的地を追加"):
            st.session_state.destinations.append('')
            st.rerun() # ページを再実行して入力欄を追加
    with col2:
        if st.form_submit_button("－ 最後の目的地を削除"):
            if len(st.session_state.destinations) > 1:
                st.session_state.destinations.pop()
                st.rerun()
    with col3:
        if st.form_submit_button("クリア"):
            st.session_state.destinations = ['']
            st.rerun()

    # 検索実行ボタン
    submitted = st.form_submit_button("最適経路を検索", type="primary")


# --- 検索処理と結果表示 ---
if submitted:
    # 入力値のチェック
    destinations_input = [d for d in st.session_state.destinations if d.strip()]
    if not start_point or not destinations_input:
        st.warning("出発地と少なくとも1つの目的地を入力してください。")
    else:
        with st.spinner('最適経路を検索中...'):
            try:
                # 経路検索の実行
                directions_result = gmaps.directions(
                    origin=start_point,
                    destination=start_point,
                    waypoints=destinations_input,
                    optimize_waypoints=True  # ウェイポイントを最適化
                )

                if not directions_result:
                    st.error("経路が見つかりませんでした。住所を確認してください。")
                else:
                    # --- 結果の整形 ---
                    optimized_order = directions_result[0]['waypoint_order']
                    optimized_destinations = [destinations_input[i] for i in optimized_order]

                    st.success("✅ 最適経路の計算が完了しました！")

                    # --- 概要表示 ---
                    st.subheader("▼ 最適な訪問順序")
                    route_display = f"**出発地: {start_point}**\n"
                    for i, dest in enumerate(optimized_destinations):
                        route_display += f"1. {i+1}番目の訪問先: **{dest}**\n"
                    route_display += f"**帰着地: {start_point}**"
                    st.markdown(route_display)

                    # --- 詳細表示 ---
                    with st.expander("▼ ルート詳細を表示"):
                        total_distance = 0
                        total_duration_sec = 0
                        full_route_locations = [start_point] + optimized_destinations + [start_point]

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


                    # --- 地図URLの生成 ---
                    base_url = "https://www.google.com/maps/dir/"
                    # URLエンコードをかけて安全なURLにする
                    encoded_locations = [urllib.parse.quote(loc) for loc in full_route_locations]
                    map_url = base_url + "/".join(encoded_locations)

                    st.subheader("▼ 地図で確認")
                    st.link_button("Google Mapsで経路を開く", map_url)

            except googlemaps.exceptions.ApiError as e:
                st.error(f"Google Maps APIエラーが発生しました: {e}")
            except Exception as e:
                st.error(f"予期せぬエラーが発生しました: {e}")
