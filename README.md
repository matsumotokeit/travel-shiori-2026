# travel-shiori-2026

日本の旅行を記録するシンプルな Web アプリケーションです。

## 構成

- `.github/workflows/deploy.yml` - GitHub Pages への自動デプロイ設定
- `src/index.html` - メインの HTML
- `src/css/style.css` - サイトのスタイル
- `src/js/app.js` - アプリのエントリーポイント
- `src/assets/` - アイコン・画像

## ローカル実行

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

## ビルド

```bash
npm run build
```

ビルド成果物は `dist/` に出力されます。

## GitHub Pages

`main` または `master` ブランチへプッシュすると、自動的にビルド＆公開されます。公開先は GitHub リポジトリの `Settings > Pages` で確認してください。

`publish_dir` は `./dist` です。

## 🚀 開発の始め方

1. リポジトリをクローン
   ```bash
   git clone https://github.com/<ユーザー名>/travel-shiori-2026.git
   cd travel-shiori-2026
   npm install
   npm run dev
   ```