# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 言語設定

**常に日本語で思考し、日本語で出力すること。**

## プロジェクト概要

「生成AIパスポート合格ドリル」は、生成AIパスポート試験対策用の学習アプリ。Expo Router (v6) + React Native + TypeScript で構成され、iOS/Android/Web に対応。

## 開発コマンド

```bash
# 依存関係インストール
npm install

# 開発サーバー起動（Expo Go / Web 両対応）
npm run start          # npx expo start --tunnel
npm run start-web      # Web 確認用

# ネイティブビルド
npm run ios            # expo run:ios
npm run android        # expo run:android

# iOS プリビルド
npx expo prebuild --platform ios
```

## アーキテクチャ

### ルーティング (Expo Router)
- `app/_layout.tsx`: ルートレイアウト。ThemeProvider と ErrorBoundary でラップ
- `app/(tabs)/`: タブナビゲーション（ホーム、クイズ、カード、設定）
- `app/quiz/`: クイズ関連画面（full-test, mini-test, results）は fullScreenModal で表示
- `app/cards/study.tsx`: フラッシュカード学習画面

### 状態管理 (Zustand + AsyncStorage)
全 Store は `zustand/middleware` の `persist` で永続化：
- `stores/progress-store.ts`: 学習進捗、テスト履歴、章別スコア、習得率
- `stores/question-store.ts`: クイズ問題管理
- `stores/flashcard-store.ts`: フラッシュカード管理
- `stores/notification-store.ts`: 通知設定

### テーマ (Context API)
- `context/theme-context.tsx`: ライト/ダークモード切り替え。`useTheme()` フックで colors を取得

### データ
- `data/sample-questions.ts`: クイズ問題データ
- `data/sample-flashcards.ts`: フラッシュカードデータ
- `constants/chapters.ts`: 章（分野）定義

### パス解決
`tsconfig.json` の `@/` エイリアスを使用（例: `@/stores/progress-store`）

## コーディング規約

- 関数コンポーネント + フック構成
- インデント: 2スペース
- 命名: コンポーネントは PascalCase、Store は `xxxStore.ts`、フックは `useXxx.ts`
- コミットメッセージ: 日本語の命令形、50文字以内
