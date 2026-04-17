# Best Route - 最短ルートを、1秒で。

複数の目的地を最も効率よく回る順番を、一瞬で計算する最適経路提案アプリです。

## 🚀 特徴
- **爆速の計算**: Vercel の高速なインフラを使用し、複雑な経路も「1秒」で最適化します。
- **世界水準のアルゴリズム**: Google Maps Directions API を活用した、高精度な最適経路ロジック。
- **洗練されたデザイン**: Uber のデザインシステムを参考に、機能性を追求したクリーンなミニマル UI。
- **スマホへの即座な共有**: 作成したルートを QR コードで瞬時に共有可能。

## 🛠️ 技術スタック
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion
- **Database/Cache**: Vercel KV (Redis) - 利用制限管理
- **API**: Google Maps Directions API, GitHub API (Auth)
- **Deployment**: Vercel

## 📖 使い方
1. [best-route.vercel.app](https://best-route.vercel.app) にアクセス。
2. 出発地、目的地を入力（ドラッグ＆ドロップで手動調整も可能）。
3. 「ルート最適化」ボタンをクリック。
4. QR コードを表示してスマホの Google マップへ連携。

## 🔗 リンク
- **本番環境**: [https://best-route.vercel.app](https://best-route.vercel.app)
- **紹介ページ**: [https://best-route.vercel.app/lp](https://best-route.vercel.app/lp)

---
© 2026 yamahei21python. All rights reserved.
