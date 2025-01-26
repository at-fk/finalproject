# EU Regulation Database and Search Engine

このプロジェクトは、EU法令（EHDS、DMA等）のデータベースと検索エンジンを提供するウェブアプリケーションです。

## 主な機能

- EU法令の全文検索
- セマンティック検索
- AI支援による法令解釈
- 条文の構造化表示
- 関連条文の参照

## 技術スタック

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Supabase (PostgreSQL)
- AI/ML: OpenAI API, Jina AI Embeddings
- Deployment: Vercel

## ローカル開発環境のセットアップ

1. リポジトリのクローン:
```bash
git clone https://github.com/your-username/eu-reg-db-creator.git
cd eu-reg-db-creator
```

2. 依存関係のインストール:
```bash
npm install
```

3. 環境変数の設定:
- `.env.example`ファイルを`.env.local`にコピー
- 必要な環境変数を設定

4. 開発サーバーの起動:
```bash
npm run dev
```

## 環境変数

以下の環境変数が必要です：

- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー
- `SUPABASE_SERVICE_ROLE_KEY`: Supabaseのサービスロールキー
- `EMBEDDING_API_URL`: Jina AI EmbeddingsのAPI URL
- `EMBEDDING_API_KEY`: Jina AI EmbeddingsのAPIキー
- `OPENAI_API_KEY`: OpenAI APIキー

## ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。 