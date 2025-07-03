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

# --- ページ設定 ---
st.set_page_config(
    page_title="最適経路検索アプリ",
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

# --- GitHubのCSVにログを記録する関数 ---
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
        
        # CSVに出力する列の順番を定義
        column_order = ['date', 'time', 'origin', 'waypoints', 'destination']
        # DataFrameの列を定義した順番に並び替える
        updated_df = updated_df.reindex(columns=column_order)

        # DataFrameをCSV形式の文字列に変換（ヘッダー付き、インデックスなし）
        csv_string = updated_df.to_csv(index=False)

        # コミットメッセージを作成
        commit_message = f"Append search log at {log_data['date']} {log_data['time']}"

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

# --- ▼▼▼ 【修正版】TypeErrorを解消した関数 ▼▼▼ ---
def check_search_limit():
    """
    GitHubのログを読み込み、過去1ヶ月の検索回数が200件以上か確認する。
    200件を超えている場合はTrueを、そうでない場合はFalseを返す。
    """
    try:
        # SecretsからGitHub情報を取得
        token = st.secrets["github"]["token"]
        repo_name = st.secrets["github"]["repo"]
        file_path = st.secrets["github"]["path"]

        g = Github(token)
        repo = g.get_repo(repo_name)

        try:
            # GitHubからログファイルを取得
            contents = repo.get_contents(file_path, ref="main")
            log_content = contents.decoded_content.decode("utf-8")
            log_df = pd.read_csv(io.StringIO(log_content))
            
            if log_df.empty:
                logger.info("ログファイルは空です。上限チェックをスキップします。")
                return False

        except GithubException as e:
            if e.status == 404: # ファイルが存在しない場合は上限に達していない
                logger.info("ログファイルが見つかりません。上限チェックはスキップします。")
                return False
            else:
                st.error("GitHubからのログファイル取得に失敗しました。")
                st.exception(e)
                return True

        # 'date'列をdatetime型に変換（不正な形式はNaTに）
        log_df['date'] = pd.to_datetime(log_df['date'], errors='coerce')
        log_df.dropna(subset=['date'], inplace=True)

        # --- ▼▼▼ 【今回の修正箇所】 ▼▼▼ ---
        # 1ヶ月前の日付を計算し、.date() を使って正しく「date型」に変換する
        one_month_ago = (datetime.now(JST) - pd.DateOffset(months=1)).date()
        
        # 比較する両方の型を「date型」に揃える
        recent_logs = log_df[log_df['date'].dt.date >= one_month_ago]
        # --- ▲▲▲ 【今回の修正箇所】 ▲▲▲ ---

        search_count = len(recent_logs)
        logger.info(f"過去1ヶ月の検索回数: {search_count}件")

        # 検索回数が200件以上かチェック
        return search_count >= 200

    except Exception as e:
        logger.error(f"検索上限チェック中に予期せぬエラーが発生しました: {e}")
        st.error(f"検索上限の確認中にエラーが発生しました。製作者にご連絡ください。")
        st.exception(e)
        return True
# --- ▲▲▲ 【修正版】TypeErrorを解消した関数 ▲▲▲ ---


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
st.title("最適経路検索アプリ")

if not submitted:
    st.info("サイドバーから出発地と目的地を入力し、「最適経路を検索」ボタンを押してください。")

# --- 検索処理と結果表示 ---
# --- ▼▼▼ 【ご依頼による修正箇所】検索上限チェックのロジックを統合 ▼▼▼ ---
if submitted:
    destinations_input = [d for d in st.session_state.destinations if d.strip()]
    if not start_point or not end_point or not destinations_input:
        st.warning("出発地、帰着地、および少なくとも1つの目的地を入力してください。")
    else:
        # 最初に検索上限をチェックする
        if check_search_limit():
            # 上限に達していたらエラーメッセージを表示して終了
            st.error("検索上限に達しました、製作者まで連絡してください")
        else:
            # 上限に達していなければ、通常の検索処理を実行
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

                        # ログ記録処理
                        try:
                            now = datetime.now(JST)
                            log_data = {
                                "date": now.strftime('%Y-%m-%d'),
                                "time": now.strftime('%H:%M:%S'),
                                "origin": start_point,
                                "waypoints": ", ".join(optimized_destinations),
                                "destination": end_point
                            }
                            log_to_github_csv(log_data)
                        except Exception as log_e:
                            logger.error(f"ログデータの作成または書き込みに失敗しました: {log_e}")

                        # --- 結果表示処理 ---
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
                            Maps_url = "https://www.google.com/maps/dir/" + "/".join([urllib.parse.quote(loc) for loc in [start_point] + optimized_destinations + [end_point]])
                            
                            col1, col2 = st.columns(2)
                            with col1:
                                st.link_button("🗺️ 新しいタブで地図を開く", url=Maps_url, use_container_width=True)
                            with col2:
                                with st.popover("📱 QRコードを表示", use_container_width=True):
                                    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=4, border=4)
                                    qr.add_data(Maps_url)
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
                        route_text_lines = [f"出 発 地 : {start_point}"]
                        for i, dest in enumerate(optimized_destinations):
                            route_text_lines.append(f"訪問先{i+1} : {dest}")
                        route_text_lines.append(f"帰 着 地 : {end_point}")
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
# --- ▲▲▲ 【ご依頼による修正箇所】検索上限チェックのロジックを統合 ▲▲▲ ---
