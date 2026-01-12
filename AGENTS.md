# Repository Guidelines

## プロジェクト構成とモジュール
- `app/` は Expo Router の画面とレイアウトをまとめ、ルートごとに `+page.tsx` を配置します。
- 再利用 UI は `components/`、グローバル状態は Zustand を使う `stores/`、ドメイン定数は `constants/`、静的データは `data/` に置きます。
- 共通ロジックは `utils/`、型定義は `types/`、React Context は `context/`、アセットは `assets/` 配下にまとめてください。
- パス解決は `tsconfig.json` の `@/` エイリアスを利用し、深い相対パスを避けます。

## ビルド・テスト・開発コマンド
- `npm install` : 依存関係を初回または更新時に同期します。
- `npx expo start --tunnel` または `npm run start` : ローカル開発サーバーを起動し、Expo Go / Web どちらからも接続できます。
- `npm run start-web` : Web 動作確認用に Expo Router をブラウザで立ち上げます。
- `npm run android` / `npm run ios` : ネイティブビルドを EAS ではなくローカル CLI で実行します。

## コーディングスタイルと命名
- TypeScript / React Native を前提に、関数コンポーネント + フック構成を標準とします。
- インデントは 2 スペース、Props/State 型は `types/` かコンポーネント近傍に `FooProps` 形式で定義します。
- 画面・コンポーネントは PascalCase (`ProgressCard.tsx`)、hook は `useXxx.ts`、Zustand store は `xxxStore.ts` に揃えます。
- フォーマッタはエディタの Prettier 標準設定 + `strict` TypeScript を守り、未使用記号は即削除します。

## テスト指針
- 現状自動テストは未導入のため、主要画面のシナリオを Expo Go で手動検証し、再現手順を PR に残します。
- 今後 Jest/React Native Testing Library を追加する際は `__tests__/` を画面ごとに用意し、シナリオ名は `renders_feature_spec` 形式で命名してください。
- バグ修正時は最低でも再現ケース + 回帰確認手順を記述し、記録用スクリーンショットを `assets/debug/` に保存します。

## コミットとプルリクエスト
- コミットメッセージは日本語の命令形で 50 文字以内に要約し、必要なら本文で背景と検証手順を列挙します。
- PR では目的、主要変更点、影響範囲、確認済み端末/OS、スクリーンショット (UI 変更時) をテンプレ化して記入します。
- Issue 紐付けは `Closes #123` 形式で本文末に追記し、レビュー前に `npm run start-web` が通る状態を確認します。

## セキュリティと設定
- API キーや認証情報は `.env` ではなく Expo Config Plugins を検討し、リリースビルドでは `app.json` の `extra` 経由で読み込みます。
- `eas.json` にはビルドプロファイルを追加予定のため、環境固有値はプロファイル名で分岐させてください。
- 端末権限 (位置情報・通知など) を追加する場合は `app.json` の許可設定と `constants/permissions.ts` に説明文を必ず更新します。
