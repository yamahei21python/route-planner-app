# route-planner-app

🗺️ 最適経路提案アプリ (Optimal Route Planner)
複数の目的地を巡るための最適なルートを提案するStreamlitアプリケーションです。Google Maps APIを利用して、入力された複数の訪問先を最も効率的に回る順番を計算し、インタラクティブな地図上に表示します。

✨ 主な機能 (Features)
最適経路検索: Google Maps Directions APIを利用し、複数の目的地を巡る最適化されたルートを提供します。

動的なUI: Streamlitのインタラクティブなウィジェットを使用して、目的地の追加・削除がリアルタイムで行えます。

視覚的なルート表示: 計算結果を埋め込みGoogleマップで確認できます。

ルート共有機能: 生成されたGoogleマップのURLやQRコードを使い、スマートフォンなど他のデバイスと簡単に共有できます。

詳細情報: 各区間の距離・所要時間や、全体のサマリーを表示します。

検索ログの記録 (オプション): 検索履歴をGitHubリポジトリ上のCSVファイルに自動で記録・追記します。

🚀 使い方 (Usage)
ルート設定:

画面左のサイドバーに出発地と帰着地を入力します。

目的地を1つ以上入力します。＋ 目的地を追加ボタンで入力欄を動的に増やせます。

経路検索:

最適経路を検索ボタンをクリックして、APIリクエストを送信します。

結果確認:

メイン画面に、最適化されたルートの地図、訪問順序、ルート詳細が表示されます。

🔧 セットアップ (Setup)
このアプリケーションをローカル環境で実行するための手順です。

前提条件
Python 3.9以上

Google Maps APIキー (Directions APIが有効であること)

(オプション) ログ記録用のGitHub Personal Access Token

インストール手順
リポジトリをクローンします。

Bash

git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
必要なライブラリをインストールします。
requirements.txtを使用して一括でインストールするのが推奨です。

Bash

pip install -r requirements.txt
requirements.txt の内容
環境変数を設定します。
プロジェクトのルートに .streamlit ディレクトリを作成し、その中に secrets.toml ファイルを配置します。詳細は次の「⚙️ 環境変数設定」セクションを参照してください。

Streamlitアプリを起動します。

Bash

streamlit run streamlit_app.py
ブラウザで http://localhost:8501 が自動的に開きます。

⚙️ 環境変数設定 (secrets.toml)
APIキーなどの機密情報は secrets.toml ファイルで管理します。このファイルはGitの追跡対象から除外してください (.gitignoreに追加)。

.streamlit/secrets.toml

Ini, TOML

# Google Maps API Key
# https://developers.google.com/maps/documentation/directions/get-api-key
maps_api_key = "YOUR_Maps_API_KEY"

# GitHub settings for logging (Optional)
# 検索ログをGitHubに保存する場合に設定します
[github]
token = "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN" # repoスコープの権限を持つトークン
repo = "your-username/your-repository-name"  # ログを保存するリポジトリ
path = "logs/search_log.csv"                 # リポジトリ内のログファイルパス
☁️ デプロイ (Deployment)
このアプリケーションは、Streamlit Cloudに簡単にデプロイできます。

このリポジトリを自身のGitHubアカウントにフォークします。

Streamlit Cloudにサインアップし、GitHubアカウントを連携します。

"New app" からこのリポジトリを選択し、デプロイします。

デプロイ後、アプリ設定画面の "Secrets" に secrets.toml の内容を忘れずに登録してください。

🤝 コントリビュート (Contributing)
プルリクエストやIssueの報告を歓迎します。貢献を考えている方は、まずIssueを立てて変更内容について議論してください。

リポジトリをフォークします。

新しいブランチを作成します (git checkout -b feature/AmazingFeature)。

変更をコミットします (git commit -m 'Add some AmazingFeature')。

ブランチにプッシュします (git push origin feature/AmazingFeature)。

プルリクエストを作成します。

📜 ライセンス (License)
このプロジェクトはMITライセンスの下で公開されています。詳細は LICENSE ファイルをご覧ください。
