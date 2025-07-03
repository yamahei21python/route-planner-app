import streamlit as st
import googlemaps
import urllib.parse
import qrcode
import io
import logging
from datetime import datetime
import pytz
# --- ▼ ステップ5で追加するライブラリ ▼ ---
import pandas as pd
from github import Github
from github.GithubException import GithubException
# --- ▲ ステップ5で追加するライブラリ ▲ ---

# --- ページ設定 ---
st.set_page_config(
    page_title="最適経路提案アプリ",
    page_icon="🗺️",
    layout="wide"
)

# --- ロガーの設定 ---
def setup_logger():
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

# --- 【ステップ5で追加】GitHubのCSVにログを記録する関数 ---
def log_to_github_csv(log_data):
    """
    Secretsの情報を使ってGitHubリポジトリのCSVファイルにログを追記する
    """
    try:
        # StreamlitのSecretsから情報を取得
        token = st.secrets["github"]["token"]
        repo_name = st.secrets["github"]["repo"]
        file_path = st.secrets["github"]["path"]

        # GitHubに接続
        g = Github(token)
        repo = g.get_repo(repo_name)

        # 既存のファイルを取得（ファイルがなければ初回として扱う）
        try:
            contents = repo.get_contents(file_path, ref="main")
            sha = contents.sha
            existing_content = contents.decoded_content.decode("utf-8")
        except GithubException as e:
            if e.status == 404: # 404エラーは「ファイルなし」を示す
                logger.info(f"ログファイル '{file_path}' が見つかりません。新規作成します。")
                existing_content = ""
                sha = None # 新規作成なのでshaはない
            else:
                st.error(f"GitHubリポジトリからのファイル取得に失敗しました: {e}")
                return

        # 新しいログデータをDataFrame形式に変換
        new_log_df = pd.DataFrame([log_data])

        # 既存のログを読み込み、新しいログと結合
        if existing_content:
            existing_df = pd.read_csv(io.StringIO(existing_content))
            updated_df = pd.concat([existing_df, new_log_df], ignore_index=True)
        else:
            # ファイルが空だった場合（初回書き込み）
            updated_df = new_log_df
        
        # --- ▼▼▼ 【ご依頼による修正箇所 1/3】列の順番を定義・適用 ▼▼▼ ---
        # CSVに出力する列の順番を定義
        column_order = ['datetime', 'origin', 'waypoints', 'destination']
        # DataFrameの列を定義した順番に並び替える（存在しない列は破棄される）
        updated_df = updated_df.reindex(columns=column_order)
        # --- ▲▲▲ 【ご依頼による修正箇所 1/3】列の順番を定義・適用 ▲▲▲ ---

        # DataFrameをCSV形式の文字列に変換（ヘッダー付き、インデックスなし）
        csv_string = updated_df.to_csv(index=False)

        # --- ▼▼▼ 【ご依頼による修正箇所 2/3】コミットメッセージの修正 ▼▼▼ ---
        # コミットメッセージを作成
        commit_message = f"Append search log at {log_data['datetime']}"
        # --- ▲▲▲ 【ご依頼による修正箇所 2/3】コミットメッセージの修正 ▲▲▲ ---

        # ファイルを更新または新規作成
        if sha:
            # 既存ファイルを更新
            repo.update_file(file_path, commit_message, csv_string, sha, branch="main")
            logger.info("GitHubのログファイルを更新しました。")
        else:
            # 新規ファイルを作成
            repo.create_file(file_path, commit_message, csv_string, branch="main")
            logger.info("GitHubにログファイルを新規作成しました。")

    except Exception as e:
        logger.error(f"GitHubへのログ記録に失敗しました: {e}")
        st.error(f"ログの記録に失敗しました。エラー: {e}")


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
    start_point = st.text_input("**出発地**", placeholder="例：東京駅")
    same_as_start = st.checkbox("出発地と帰着地は同じ", value=True)
    if same_as_start:
        end_point = start_point
    else:
        end_point = st.text_input("**帰着地**", key='end_point', placeholder="例：新宿駅")
    st.subheader("**目的地**")
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

                    # --- ▼▼▼ 【ご依頼による修正箇所 3/3】ログ記録処理の呼び出し ▼▼▼ ---
                    try:
                        # 現在時刻を取得
                        now = datetime.now(JST)
                        # CSVのヘッダーに合わせた辞書形式でログデータを作成
                        # ご指定の順番（datetime, origin, waypoints, destination）でキーを定義
                        log_data = {
                            "datetime": now.strftime('%Y-%m-%d %H:%M:%S'),
                            "origin": start_point,
                            "waypoints": ", ".join(optimized_destinations),
                            "destination": end_point
                        }
                        # 作成した関数を呼び出す
                        log_to_github_csv(log_data)
                    except Exception as log_e:
                        logger.error(f"ログデータの作成または書き込みに失敗しました: {log_e}")
                    # --- ▲▲▲ 【ご依頼による修正箇所 3/3】ログ記録処理の呼び出し ▲▲▲ ---

                    # --- ▼▼▼ 以降の処理は元のコードのまま ▼▼▼ ---
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
                        standard_map_url = "https://www.google.com/maps/dir/" + "/".join([urllib.parse.quote(loc) for loc in [start_point] + optimized_destinations + [end_point]])
                        
                        col1, col2 = st.columns(2)
                        with col1:
                            st.link_button("🗺️ 新しいタブで地図を開く", url=standard_map_url, use_container_width=True)
                        with col2:
                            with st.popover("📱 QRコードを表示", use_container_width=True):
                                qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=4, border=4)
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

                    st.subheader("▼ 最適な訪問順序")
                    route_text_lines = [f"出 発 地: {start_point}"]
                    for i, dest in enumerate(optimized_destinations):
                        route_text_lines.append(f"訪 問 先{i+1}: {dest}")
                    route_text_lines.append(f"帰 着 地: {end_point}")
                    final_route_text = "\n".join(route_text_lines)
                    st.text(final_route_text)

                    with st.expander("▼ ルート詳細を表示"):
                        total_distance = 0
                        total_duration_sec = 0
                        for i, leg in enumerate(directions_result[0]['legs']):
                            st.markdown("---")
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
