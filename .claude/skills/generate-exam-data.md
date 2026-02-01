# Skill: 試験問題・カードデータの生成

このスキルは、資格試験対策アプリ用の問題データとフラッシュカードデータを生成する際に使用します。

## 使用シーン

- 「〇〇試験の問題を作って」
- 「△△検定のフラッシュカードを生成して」
- 「問題データをJSON形式で出力して」

## 問題データ生成

### 入力情報の確認

```
1. 試験名
2. 分野構成（章立て）
3. 各分野の問題数
4. 難易度レベル
5. 出典（公式テキスト、過去問など）
```

### 出力形式

```typescript
// data/sample-questions.ts

import { Question } from "@/types/question";

export const sampleQuestions: Question[] = [
  {
    id: 1,
    chapter: "第1章：分野名",
    stem: "問題文（？で終わる疑問形が望ましい）",
    choices: [
      "選択肢A（正解）",
      "選択肢B",
      "選択肢C",
      "選択肢D"
    ],
    answerIndex: 0,
    explanation: "解説文。なぜこの選択肢が正解なのかを説明。"
  },
  // ...
];
```

### 問題作成ガイドライン

1. **問題文（stem）**
   - 明確で簡潔に
   - 「〜として最も適切なものはどれか」形式
   - 否定形は避ける（「〜でないものは」は混乱を招く）

2. **選択肢（choices）**
   - 4択固定
   - 長さを揃える
   - 明らかに間違いとわかる選択肢は避ける
   - 「すべて正しい」「どれも違う」は避ける

3. **解説（explanation）**
   - 正解の理由を説明
   - 不正解選択肢がなぜ違うかも簡潔に
   - 関連知識も補足すると学習効果UP

### 分野別問題数の目安

| フルテスト問題数 | 分野数 | 各分野の問題数 |
|-----------------|--------|---------------|
| 160問 | 5分野 | 各32問 |
| 100問 | 4分野 | 各25問 |
| 80問 | 4分野 | 各20問 |
| 60問 | 3分野 | 各20問 |
| 50問 | 5分野 | 各10問 |

## フラッシュカード生成

### 出力形式

```typescript
// data/sample-flashcards.ts

import { Flashcard } from "@/types/flashcard";

export const sampleFlashcards: Flashcard[] = [
  {
    id: 1,
    chapter: "第1章：分野名",
    term: "用語（表面）",
    definition: "定義・説明（裏面）"
  },
  // ...
];
```

### カード作成ガイドライン

1. **用語（term）**
   - 試験に出る重要キーワード
   - 略語の場合はフルネームも含める
   - 例: 「AI（人工知能）」

2. **定義（definition）**
   - 50-100文字程度
   - 簡潔で覚えやすく
   - 例や具体例を含めると効果的

### 分野別カード数の目安

- 各分野: 20-30枚
- 合計: 100-150枚

## 一括生成プロンプトテンプレート

### 問題生成

```
以下の試験の問題データを生成してください。

【試験情報】
- 試験名: {試験名}
- 分野構成:
  - 第1章: {分野1の名前}
  - 第2章: {分野2の名前}
  - ...

【要件】
- 各分野から{X}問ずつ、合計{Y}問
- 4択問題
- 難易度: 実際の試験レベル
- 各問題に解説を付ける

【出力形式】
TypeScript配列形式で、以下のインターフェースに準拠:

interface Question {
  id: number;
  chapter: string;
  stem: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}

IDは1から連番で振ってください。
```

### カード生成

```
以下の試験の重要用語をフラッシュカード形式で生成してください。

【試験情報】
- 試験名: {試験名}
- 分野構成:
  - 第1章: {分野1の名前}
  - 第2章: {分野2の名前}
  - ...

【要件】
- 各分野から{X}枚ずつ、合計{Y}枚
- 用語は試験頻出のキーワード
- 定義は50-100文字で簡潔に

【出力形式】
TypeScript配列形式で、以下のインターフェースに準拠:

interface Flashcard {
  id: number;
  chapter: string;
  term: string;
  definition: string;
}

IDは1から連番で振ってください。
```

## データ検証

生成後、以下を確認:

```typescript
// 検証スクリプト例
const questions = sampleQuestions;

// ID重複チェック
const ids = questions.map(q => q.id);
const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
if (duplicates.length > 0) {
  console.error("重複ID:", duplicates);
}

// 分野の整合性チェック
const chapters = [...new Set(questions.map(q => q.chapter))];
console.log("分野一覧:", chapters);

// answerIndex範囲チェック
const invalidIndex = questions.filter(q => q.answerIndex < 0 || q.answerIndex > 3);
if (invalidIndex.length > 0) {
  console.error("無効なanswerIndex:", invalidIndex.map(q => q.id));
}

// 選択肢数チェック
const invalidChoices = questions.filter(q => q.choices.length !== 4);
if (invalidChoices.length > 0) {
  console.error("選択肢が4つでない:", invalidChoices.map(q => q.id));
}
```

## 試験別サンプル

### ITパスポート

```typescript
export const CHAPTERS = [
  "ストラテジ系",
  "マネジメント系",
  "テクノロジ系",
];

// 問題例
{
  id: 1,
  chapter: "ストラテジ系",
  stem: "企業の経営戦略において、SWOT分析の「S」が示すものはどれか。",
  choices: [
    "強み（Strengths）",
    "弱み（Weaknesses）",
    "機会（Opportunities）",
    "脅威（Threats）"
  ],
  answerIndex: 0,
  explanation: "SWOT分析は、Strengths（強み）、Weaknesses（弱み）、Opportunities（機会）、Threats（脅威）の頭文字をとったもの。内部環境（S・W）と外部環境（O・T）を分析する手法。"
}
```

### 簿記3級

```typescript
export const CHAPTERS = [
  "簿記の基礎",
  "仕訳と勘定",
  "決算と財務諸表",
];

// 問題例
{
  id: 1,
  chapter: "簿記の基礎",
  stem: "次の取引の仕訳として正しいものはどれか。「現金100,000円を当座預金に預け入れた」",
  choices: [
    "（借）当座預金 100,000 （貸）現金 100,000",
    "（借）現金 100,000 （貸）当座預金 100,000",
    "（借）当座預金 100,000 （貸）普通預金 100,000",
    "（借）普通預金 100,000 （貸）現金 100,000"
  ],
  answerIndex: 0,
  explanation: "現金を当座預金に預け入れると、資産の現金が減少し、資産の当座預金が増加する。借方に当座預金（増加）、貸方に現金（減少）を記入する。"
}
```

### 英語系（TOEIC/英検）

```typescript
export const CHAPTERS = [
  "Part 1: 写真描写問題",
  "Part 2: 応答問題",
  "Part 3: 会話問題",
  "Part 4: 説明文問題",
  "Part 5: 短文穴埋め問題",
  "Part 6: 長文穴埋め問題",
  "Part 7: 読解問題",
];

// 問題例
{
  id: 1,
  chapter: "Part 5: 短文穴埋め問題",
  stem: "The meeting has been _____ until next Monday due to the manager's business trip.",
  choices: [
    "postponed",
    "canceled",
    "attended",
    "scheduled"
  ],
  answerIndex: 0,
  explanation: "「マネージャーの出張のため、会議は来週月曜日まで延期された」という意味。postpone（延期する）が正解。cancel（中止する）、attend（出席する）、schedule（予定する）は文脈に合わない。"
}
```

## 大量生成時のコツ

1. **分野ごとに分けて生成**
   - 一度に全分野を生成すると品質が下がる
   - 分野ごとに30問ずつ生成してマージ

2. **IDの付け直し**
   - 分野ごとに生成した場合、最後にIDを振り直す
   ```typescript
   const reindexed = questions.map((q, i) => ({ ...q, id: i + 1 }));
   ```

3. **レビューと修正**
   - 生成後、明らかに不適切な問題を修正
   - 選択肢の順序をランダム化（正解が偏らないように）

4. **正解分布の確認**
   - answerIndexが0-3に均等に分布しているか確認
   ```typescript
   const distribution = [0, 0, 0, 0];
   questions.forEach(q => distribution[q.answerIndex]++);
   console.log("正解分布:", distribution);
   ```
