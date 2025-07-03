# streamlit_app.py (修正版)

import streamlit as st
import googlemaps
import urllib.parse
import qrcode
import io
import logging
from datetime import datetime
import pytz
import pandas as pd
from github import Github
from github.GithubException import GithubException
# --- ▼ 今回追加するライブラリ ▼ ---
import folium
from streamlit_folium import st_folium
# --- ▲ 今回追加するライブラリ ▲ ---

# --- ページ設定 ---
st.set_page_config(
    page_title="最適経路提案アプリ",
    page_icon="🗺️",
    layout="wide"
)

# --- ロガーやGitHub関連の関数 ---
# (ここは元のコードのままでOK)
def setup_logger():
    # ... (元のコードをここに貼り付け) ...
    logger = logging.getLogger('route_logger')
    logger.setLevel(logging.INFO)
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s JST - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger

logger = setup_logger()
JST = pytz.timezone('Asia/Tokyo')

def log_to_github_csv(log_data):
    # ... (元のコードをここに貼り付け) ...
    pass # このサンプルでは簡略化のため省略

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

# --- ▼▼▼ 【新規追加】地名を緯度経度に変換する関数 ▼▼▼ ---
@st.cache_data(show_spinner=False) # API呼び出し結果をキャッシュして無駄な呼び出しを防ぐ
def get_geocode(address: str):
    """地名から緯度経度を取得する"""
    if not address:
        return None
    try:
        geocode_result = gmaps.geocode(address)
        if geocode_result:
            location = geocode_result[0]['geometry']['location']
            return (location['lat'], location['lng'])
    except googlemaps.exceptions.ApiError as e:
        logger.warning(f"ジオコーディングエラー: {address}, {e}")
    except Exception as e:
        logger.error(f"予期せぬエラー: {e}")
    return None
# --- ▲▲▲ 【新規追加】地名を緯度経度に変換する関数 ▲▲▲ ---


# ===============================================================
# ▼▼▼ サイドバーの入力フォーム ▼▼▼
# ===============================================================
# (このセクションは元のコードのままでOK)
with st.sidebar:
    st.title("🗺️ ルート設定")
    start_point = st.text_input("**出発地**", placeholder="例：東京駅")
    same_as_start = st.checkbox("出発地と帰着地は同じ", value=True)
    if same_as_start:
        end_point = start_point
        # st.session_state.end_pointは更新不要
    else:
        end_point = st.text_input("**帰着地**", key='end_point', placeholder="例：新宿駅")

    st.subheader("**目的地**")
    # ... (目的地追加・削除のロジックは元のまま) ...
    for i in range(len(st.session_state.destinations)):
        col1, col2 = st.columns([0.8, 0.2])
        with col1:
            st.session_state.destinations[i] = st.text_input(
                f"目的地 {i+1}", value=st.session_state.destinations[i],
                key=f"dest_{i}", label_visibility="collapsed"
            )
        with col2:
            if st.button("✖️", key=f"del_{i}", use_container_width=True):
                st.session_state.destinations.pop(i)
                st.rerun()

    if st.button("＋ 目的地を追加", use_container_width=True):
        st.session_state.destinations.append('')
        st.rerun()

    st.write("---")
    with st.form("search_form"):
        submitted = st.form_submit_button("最適経路を検索", type="primary", use_container_width=True)

    if st.button("クリア", use_container_width=True):
        st.session_state.destinations = ['']
        st.session_state.end_point = ''
        # クリア後はページをリロードして入力欄を空にする
        st.rerun()


# ===============================================================
# ▼▼▼ メイン画面の表示 ▼▼▼
# ===============================================================
st.title("最適経路提案アプリ")
col1, col2 = st.columns([0.4, 0.6]) # レイアウトを2カラムに

# --- 左カラム：地図表示 ---
with col1:
    st.subheader("📍 マップ")
    
    # 入力されたすべての地点をリスト化
    all_locations_input = [start_point] + [d for d in st.session_state.destinations if d.strip()]
    if not same_as_start and end_point:
        all_locations_input.append(end_point)

    # ジオコーディングして緯度経度のリストを作成
    valid_locations = []
    for address in set(all_locations_input): # 重複を除外
        if address:
            coords = get_geocode(address)
            if coords:
                valid_locations.append({"address": address, "coords": coords})

    # 地図の初期設定
    map_center = [35.681236, 139.767125] # 東京駅
    zoom_level = 10
    
    # 表示するピンがあれば、その中心を地図の中心にする
    if valid_locations:
        avg_lat = sum(loc['coords'][0] for loc in valid_locations) / len(valid_locations)
        avg_lon = sum(loc['coords'][1] for loc in valid_locations) / len(valid_locations)
        map_center = [avg_lat, avg_lon]
        zoom_level = 12

    # Foliumで地図を作成
    m = folium.Map(location=map_center, zoom_start=zoom_level)

    # 各地点にマーカー（ピン）を立てる
    for loc in valid_locations:
        folium.Marker(
            location=loc['coords'],
            popup=loc['address'],
            tooltip=loc['address'],
            icon=folium.Icon(color="blue", icon="info-sign")
        ).add_to(m)

    # 検索ボタンが押され、経路が見つかった場合の処理
    if 'directions_result' in st.session_state:
        # ポリライン（経路）を描画
        route_polyline = []
        for leg in st.session_state.directions_result[0]['legs']:
            # 各区間の始点と終点の緯度経度を追加
            route_polyline.append((leg['start_location']['lat'], leg['start_location']['lng']))
            route_polyline.append((leg['end_location']['lat'], leg['end_location']['lng']))
        
        folium.PolyLine(locations=route_polyline, color="red", weight=5).add_to(m)
        
    st_folium(m, height=450, use_container_width=True)


# --- 右カラム：検索結果表示 ---
with col2:
    if not submitted:
        st.info("サイドバーで地点を入力すると左の地図にピンが立ちます。\n\n全地点を入力後、「最適経路を検索」ボタンを押してください。")

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
                        if 'directions_result' in st.session_state:
                            del st.session_state.directions_result
                    else:
                        st.session_state.directions_result = directions_result # 結果をセッションに保存
                        
                        # --- 結果表示ロジック (元のコードとほぼ同じ) ---
                        optimized_order = directions_result[0]['waypoint_order']
                        optimized_destinations = [destinations_input[i] for i in optimized_order]

                        st.subheader("✅ 最適な訪問順序")
                        route_text_lines = [f"**出発地**: {start_point}"]
                        for i, dest in enumerate(optimized_destinations):
                            route_text_lines.append(f"**訪問先{i+1}**: {dest}")
                        route_text_lines.append(f"**帰着地**: {end_point}")
                        st.markdown("\n\n".join(route_text_lines))

                        with st.expander("▼ ルート詳細を表示"):
                            total_distance = 0
                            total_duration_sec = 0
                            for i, leg in enumerate(directions_result[0]['legs']):
                                st.markdown("---")
                                st.markdown(f"**区間 {i+1}**: {leg['start_address']} → {leg['end_address']}")
                                st.markdown(f"📏 **距離:** {leg['distance']['text']} | 🕒 **所要時間:** {leg['duration']['text']}")
                                total_distance += leg['distance']['value']
                                total_duration_sec += leg['duration']['value']
                            
                            st.markdown("---")
                            st.subheader("サマリー")
                            total_duration_min = total_duration_sec // 60
                            st.markdown(f"- **総移動距離:** {total_distance / 1000:.1f} km")
                            st.markdown(f"- **総所要時間:** 約{total_duration_min // 60}時間 {total_duration_min % 60}分")
                        
                        # 再実行して地図に経路を反映
                        st.rerun()

                except googlemaps.exceptions.ApiError as e:
                    st.error(f"Google Maps APIエラーが発生しました: {e}")
                except Exception as e:
                    st.error(f"予期せぬエラーが発生しました: {e}")
                    logger.error(f"経路検索中のエラー: {e}")
