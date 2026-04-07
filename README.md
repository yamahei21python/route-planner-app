# 🗺️ 最適経路提案アプリ (Route Planner) 

Next.js を利用した、洗練されたモダンな最適経路検索アプリです。
Uberをはじめとするトーン＆マナーをベースに構築し、インタラクティブな地図操作、ドラッグ＆ドロップによるルート微調整、共有用QRコード表示など高度なユーザー体験を提供します。
Vercelの無料ホスティングで動作させるため、バックエンド処理は全てNext.jsのAPI Routesを利用する完全サーバーレスかつ、データ保存もVercel KVを利用する「Vercelネイティブ」な構成となっています。

## 🚀 技術スタック構成

- **フルスタックフレームワーク**: Next.js (App Router, API Routes), TypeScript
- **UIライブラリ**: `@vis.gl/react-google-maps` (地図描画), `@dnd-kit` (ドラッグ＆ドロップ順序変更), `lucide-react` (アイコン)
- **スタイリング**: Tailwind CSS (v4)
- **データベース機能**: Vercel KV (Redis) - 利用上限管理とログ保存用
- **外部API**: Google Maps Directions API

## ✨ 主な機能

- **リッチなUI**: 白黒基調の高コントラストで直感的なUIデザイン。
- **インタラクティブマップ**: ページ遷移なしにスムーズにルートが描画・更新されます。
- **ドラッグ＆ドロップ操作**: 検索したあとの最適なルート順に対して、直接ドラッグして微調整が可能。
- **共有機能**: モバイルアプリなどで開くためのQRコードおよびURLを即座に発行。
- **利用制限の自動管理**: Vercel KV を使用し、月間の検索回数を高速に管理（月200件）。

## ⚙️ ローカル環境でのセットアップ 

### 1. 環境変数の設定

`frontend` ディレクトリ内に `.env.local` ファイルを作成し、APIキーを配置します。

```env
# Google Maps APIキー
NEXT_PUBLIC_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"

# Vercel KV (デプロイ後にVercelダッシュボードから取得可能。ローカルでは省略可能)
KV_REST_API_URL="..."
KV_REST_API_TOKEN="..."
```

### 2. アプリの起動

```bash
cd frontend
npm install
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## ☁️ デプロイ (Vercel)
Vercelでデプロイする際は、プロジェクト設定から **KV (Storage)** を新規作成し、このプロジェクトに連携するだけで、GitHub APIなどの外部設定なしに完全に無料で運用可能です。
Root Directory は `frontend` を指定してください。
