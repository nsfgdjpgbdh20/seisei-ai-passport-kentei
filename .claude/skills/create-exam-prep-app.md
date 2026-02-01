# Skill: 資格試験対策アプリの新規作成

このスキルは、資格試験対策アプリを新しい題材で作成する際に使用します。

## 使用シーン

ユーザーが以下のような依頼をした場合にこのスキルを使用:
- 「〇〇検定のアプリを作って」
- 「△△試験の学習アプリを作成して」
- 「このアプリを□□資格向けに作り直して」

## 必要な入力情報

アプリ作成前に、以下の情報をユーザーに確認:

```
1. 試験名（例: ITパスポート、簿記3級、TOEIC）
2. 分野/章の構成（例: 5章構成、各章の名前）
3. アプリ名（日本語）
4. Bundle ID / Package Name
5. 問題データ（あれば。なければサンプルを生成）
6. フラッシュカードデータ（あれば。なければサンプルを生成）
```

## アプリ構造（固定）

```
project-root/
├── app/                      # Expo Router v6
│   ├── _layout.tsx          # ルートレイアウト
│   ├── (tabs)/              # タブナビゲーション
│   │   ├── _layout.tsx      # 4タブ: ホーム, クイズ, カード, 設定
│   │   ├── index.tsx        # ホーム（ダッシュボード）
│   │   ├── quiz.tsx         # クイズメニュー
│   │   ├── cards.tsx        # カードメニュー
│   │   └── settings.tsx     # 設定
│   ├── quiz/
│   │   ├── full-test.tsx    # フルテスト
│   │   ├── mini-test.tsx    # ミニテスト
│   │   └── results.tsx      # 結果画面
│   └── cards/
│       └── study.tsx        # カード学習
├── components/              # 共通コンポーネント（そのまま使用）
├── stores/                  # Zustand Store（そのまま使用）
├── context/                 # Theme Context（そのまま使用）
├── constants/
│   └── chapters.ts          # ★ 要変更: 分野定義
├── types/                   # 型定義（そのまま使用）
├── data/
│   ├── sample-questions.ts  # ★ 要変更: 問題データ
│   └── sample-flashcards.ts # ★ 要変更: カードデータ
├── app.json                 # ★ 要変更: アプリ名、Bundle ID
└── package.json             # ★ 要変更: name, description
```

## 変更が必要なファイル（★印）

### 1. constants/chapters.ts
```typescript
export const CHAPTERS = [
  "第1章：〇〇〇〇",
  "第2章：△△△△",
  "第3章：□□□□",
  // ... 試験に合わせて定義
];
```

### 2. data/sample-questions.ts
```typescript
import { Question } from "@/types/question";

export const sampleQuestions: Question[] = [
  {
    id: 1,
    chapter: "第1章：〇〇〇〇",  // chapters.ts と一致させる
    stem: "問題文をここに記述",
    choices: ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
    answerIndex: 0,  // 正解のインデックス（0-3）
    explanation: "解説文をここに記述",
  },
  // ... 問題数は自由（推奨: 160問以上）
];
```

### 3. data/sample-flashcards.ts
```typescript
import { Flashcard } from "@/types/flashcard";

export const sampleFlashcards: Flashcard[] = [
  {
    id: 1,
    chapter: "第1章：〇〇〇〇",
    term: "用語",
    definition: "用語の定義・説明",
  },
  // ... カード数は自由（推奨: 100枚以上）
];
```

### 4. app.json
```json
{
  "expo": {
    "name": "〇〇試験合格ドリル",
    "slug": "xxx-kentei-drill",
    "ios": {
      "bundleIdentifier": "app.yourname.xxx-drill"
    },
    "android": {
      "package": "app.yourname.xxx_drill"
    }
  }
}
```

### 5. package.json
```json
{
  "name": "xxx-kentei-drill",
  "description": "〇〇試験対策アプリ"
}
```

## フルテスト設定の変更（任意）

試験によって問題数・時間が異なる場合、`app/quiz/full-test.tsx` を変更:

```typescript
// デフォルト: 160問 × 120分
const TOTAL_QUESTIONS = 160;
const TOTAL_TIME = 120 * 60; // 秒

// 例: ITパスポートなら 100問 × 120分
const TOTAL_QUESTIONS = 100;
const TOTAL_TIME = 120 * 60;
```

## 作成手順

1. **プロジェクトをコピー**
   ```bash
   cp -r seisei-ai-passport-kentei new-app-name
   cd new-app-name
   rm -rf node_modules .git
   git init
   ```

2. **上記5ファイルを変更**
   - chapters.ts
   - sample-questions.ts
   - sample-flashcards.ts
   - app.json
   - package.json

3. **依存関係インストール**
   ```bash
   npm install
   ```

4. **動作確認**
   ```bash
   npm run start
   ```

## 問題データ生成のプロンプト

ユーザーが問題データを持っていない場合、以下のプロンプトで生成を依頼:

```
〇〇試験の問題を生成してください。

要件:
- 分野: [chapters.ts の内容]
- 問題数: 各分野 30問以上（合計160問以上推奨）
- 形式: 4択問題
- 難易度: 実際の試験レベルに合わせる
- 解説: 各問題に詳しい解説を付ける

出力形式:
{
  id: number,
  chapter: "第X章：〇〇〇",
  stem: "問題文",
  choices: ["A", "B", "C", "D"],
  answerIndex: 0-3,
  explanation: "解説"
}
```

## フラッシュカード生成のプロンプト

```
〇〇試験の重要用語をフラッシュカード形式で生成してください。

要件:
- 分野: [chapters.ts の内容]
- カード数: 各分野 20枚以上（合計100枚以上推奨）
- 用語: 試験に出る重要キーワード
- 定義: 簡潔で覚えやすい説明

出力形式:
{
  id: number,
  chapter: "第X章：〇〇〇",
  term: "用語",
  definition: "定義"
}
```

## 横展開の例

| 試験名 | 分野数 | 問題数目安 | フルテスト |
|--------|--------|-----------|-----------|
| ITパスポート | 3分野 | 100問 | 100問×120分 |
| 基本情報技術者 | 2分野 | 80問 | 80問×150分 |
| 簿記3級 | 3分野 | 70問 | 70問×60分 |
| FP3級 | 6分野 | 60問 | 60問×120分 |
| 宅建 | 4分野 | 50問 | 50問×120分 |
| TOEIC | 7パート | 200問 | 200問×120分 |
| 英検2級 | 4技能 | 80問 | 80問×100分 |

## コンポーネント再利用

以下のコンポーネントは変更不要でそのまま使用可能:

- `ProgressBar.tsx` - プログレスバー
- `QuestionView.tsx` - 問題表示
- `QuizHeader.tsx` - クイズヘッダー
- `ScoreRadarChart.tsx` - レーダーチャート
- `ReviewModal.tsx` - レビューモーダル
- `MonthlyLearningProgress.tsx` - 月間進捗
- `DateTimePicker.tsx` - 日時ピッカー

## Store再利用

以下のStoreは変更不要:

- `progress-store.ts` - 進捗管理
- `question-store.ts` - 問題管理
- `flashcard-store.ts` - カード管理（SM-2）
- `notification-store.ts` - 通知設定
- `ui-state-store.ts` - UI状態

## 注意事項

- 分野名は `chapters.ts` と `sample-questions.ts`、`sample-flashcards.ts` で完全に一致させる
- 問題IDとカードIDは1から連番で重複なし
- 正解インデックスは0-3の範囲内
- 日本語を使用する場合はUTF-8エンコーディング
