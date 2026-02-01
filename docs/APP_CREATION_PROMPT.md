# 生成AIパスポート合格ドリル - アプリ作成プロンプト

このドキュメントは、現在のアプリ仕様から逆算して作成した「アプリ作成プロンプト」です。
AIアシスタントに依頼する際のテンプレートとして使用できます。

---

## 1. プロジェクト概要

### アプリ名
**生成AIパスポート合格ドリル**

### 目的
生成AIパスポート試験の合格を目指す学習者向けの試験対策アプリを開発する。
効率的な学習と知識の定着を支援し、合格に必要な知識を体系的に習得できるようにする。

### ターゲットユーザー
- 生成AIパスポート試験の受験予定者
- AI・生成AIの基礎知識を身につけたいビジネスパーソン
- 短時間で効率的に学習したい社会人

### 対応プラットフォーム
- iOS（iPhone/iPad）
- Android
- Web

---

## 2. 技術スタック

### フレームワーク・言語
```
- Expo SDK 54+（React Native）
- Expo Router v6（ファイルベースルーティング）
- TypeScript 5.x
- React 19.x
```

### 状態管理・データ永続化
```
- Zustand（状態管理）
- AsyncStorage（ローカルストレージ）
```

### UI・スタイリング
```
- React Native StyleSheet（インラインスタイル）
- React Native SVG（チャート描画）
- Expo Vector Icons（MaterialIcons, FontAwesome）
- Expo Linear Gradient（グラデーション）
```

### その他ライブラリ
```
- dayjs（日付操作）
- Expo Notifications（プッシュ通知）
- Expo Store Review（アプリレビュー）
- Expo Haptics（触覚フィードバック）
```

---

## 3. 画面構成・ナビゲーション

### タブナビゲーション（メイン4画面）

| タブ | 画面名 | 概要 |
|------|--------|------|
| 🏠 | ホーム | ダッシュボード。習得率、今日のタスク、月間進捗、スコアチャート表示 |
| 📝 | クイズ | クイズメニュー。分野選択、統計表示、テスト開始 |
| 🃏 | カード | フラッシュカードメニュー。分野選択、統計表示、学習開始 |
| ⚙️ | 設定 | アプリ設定。テーマ切替、通知設定、データ管理 |

### モーダル画面（フルスクリーン）

| 画面 | パス | 概要 |
|------|------|------|
| フルテスト | `/quiz/full-test` | 160問 × 120分の本番形式テスト |
| ミニテスト | `/quiz/mini-test` | 10問 × 5分の短時間学習テスト |
| テスト結果 | `/quiz/results` | スコア表示、正解数、リトライボタン |
| カード学習 | `/cards/study` | フラッシュカード学習画面（最大10枚） |

---

## 4. 機能要件

### 4.1 クイズ機能

#### ミニテスト
- [ ] 10問のランダム出題
- [ ] 制限時間5分（タイマー表示）
- [ ] 分野フィルタリング（全分野 or 個別分野）
- [ ] リアルタイム正誤フィードバック（正解=緑、不正解=赤）
- [ ] 未習得問題の優先出題
- [ ] 解説表示機能

#### フルテスト
- [ ] 160問のランダム出題（全問シャッフル）
- [ ] 制限時間120分（2時間）
- [ ] テスト中断・再開機能（進捗保存）
- [ ] フラグ機能（後で見直す問題をマーク）
- [ ] 回答サマリー画面（テスト終了前の確認）
- [ ] 問題ジャンプ機能

#### 共通機能
- [ ] 問題進捗表示（例: 3/10）
- [ ] 残り時間表示（MM:SS形式）
- [ ] 途中終了確認ダイアログ
- [ ] 回答後の解説表示

### 4.2 フラッシュカード機能

#### カード学習
- [ ] 最大10枚/セッションのカード学習
- [ ] フリップアニメーション（用語 ↔ 定義）
- [ ] 分野フィルタリング
- [ ] 学習完了後の進捗表示

#### スペース反復学習（SM-2アルゴリズム）
- [ ] 品質スコア入力（1-5段階）
  - 5: 完璧に覚えている
  - 4: 少し考えて思い出した
  - 3: 思い出すのに苦労した
  - 2: ほとんど忘れていた
  - 1: 全く思い出せなかった
- [ ] 復習間隔の自動計算
- [ ] 難易度係数（easeFactor）の調整
- [ ] 次回復習日の設定
- [ ] 復習予定カードの優先表示

### 4.3 進捗管理機能

#### 習得率トラッキング
- [ ] 全体習得率の計算・表示
- [ ] 分野別習得率の表示
- [ ] 習得済み/未習得の問題・カード数表示

#### テスト履歴
- [ ] テスト結果の保存（スコア、日時、問題数）
- [ ] 直近3回の平均スコア計算
- [ ] 分野別スコアの記録

#### 月間学習進捗
- [ ] 月間学習日数のカウント
- [ ] 学習目標（例: 月20日）に対する進捗表示
- [ ] 月が変わったら自動リセット

### 4.4 可視化機能

#### スコアレーダーチャート
- [ ] 5分野のスコアをレーダーチャートで表示
- [ ] SVGベースの描画
- [ ] ダークモード対応の色設定

#### プログレスバー
- [ ] 習得率を視覚的に表示
- [ ] カスタマイズ可能な高さ・色

### 4.5 設定機能

#### テーマ設定
- [ ] ライトモード/ダークモードの切替
- [ ] 設定の永続化

#### 通知設定
- [ ] 学習リマインダーの有効/無効
- [ ] 通知時刻の設定（時刻ピッカー）
- [ ] 毎日指定時刻に通知

#### データ管理
- [ ] 問題データの更新チェック
- [ ] 学習進捗のリセット（確認ダイアログ付き）

#### アプリ情報
- [ ] バージョン表示
- [ ] App Storeレビュー誘導
- [ ] 公式サイトへのリンク

---

## 5. データ構造

### 5.1 問題データ（Question）
```typescript
interface Question {
  id: number;           // 問題ID
  chapter: string;      // 分野（第1章〜第5章）
  stem: string;         // 問題文
  choices: string[];    // 選択肢（4択）
  answerIndex: number;  // 正解インデックス（0-3）
  explanation: string;  // 解説
}
```

### 5.2 フラッシュカード（Flashcard）
```typescript
interface Flashcard {
  id: number;            // カードID
  term: string;          // 用語
  definition: string;    // 定義
  chapter: string;       // 分野

  // SM-2アルゴリズム用
  interval?: number;     // 復習間隔（日）
  repetitions?: number;  // 繰り返し回数
  easeFactor?: number;   // 難易度係数（1.3〜2.5）
  nextReview?: string;   // 次回復習日
}
```

### 5.3 分野定義
```typescript
const CHAPTERS = [
  "第1章：AI（人工知能）",
  "第2章：生成AI（ジェネレーティブAI）",
  "第3章：現在の生成AI（ジェネレーティブAI）の動向",
  "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
  "第5章：テキスト生成AIのプロンプト制作と実例",
];
```

---

## 6. 状態管理設計

### 6.1 progress-store（学習進捗）
```typescript
interface ProgressState {
  progress: number;                           // 全体進捗（0-100%）
  lastScore: number | null;                   // 直近スコア
  chapterProgress: Record<string, ChapterData>;  // 分野別進捗
  monthlyLearningDays: number;                // 今月の学習日数
  lastStudyDate: string | null;               // 最終学習日
  currentMonth: string | null;                // 現在月（YYYY-MM）
  testHistory: TestResult[];                  // テスト履歴
  questionMastery: Record<number, boolean[]>; // 問題別正誤履歴
  questionsEverCorrect: Record<number, boolean>; // 習得済みフラグ
}
```

### 6.2 question-store（問題管理）
```typescript
interface QuestionState {
  questions: Question[];        // 問題一覧
  version: string;              // データバージョン
  testProgress: TestProgress | null;  // テスト中進捗
}
```

### 6.3 flashcard-store（カード管理）
```typescript
interface FlashcardState {
  flashcards: Flashcard[];      // カード一覧
  initialized: boolean;         // 初期化フラグ
  studiedToday: number[];       // 今日学習したカードID
  lastStudiedDate: string | null;
  dueCards: Flashcard[];        // 復習予定カード
}
```

### 6.4 notification-store（通知設定）
```typescript
interface NotificationState {
  notificationsEnabled: boolean;
  notificationTime: string;     // HH:MM形式
}
```

---

## 7. UI/UXデザイン要件

### カラーテーマ

#### ライトモード
```typescript
{
  primary: "#004aad",        // メインカラー（深いブルー）
  background: "#f8f9fa",     // 背景色
  card: "#ffffff",           // カード背景
  text: "#1a1a1a",          // メインテキスト
  textSecondary: "#6c757d", // サブテキスト
  success: "#10b981",       // 正解・成功
  error: "#ef4444",         // 不正解・エラー
  warning: "#f59e0b",       // 警告
}
```

#### ダークモード
```typescript
{
  primary: "#4dabf5",        // メインカラー（明るいブルー）
  background: "#0d1117",     // 背景色
  card: "#161b22",           // カード背景
  text: "#e6edf3",          // メインテキスト
  textSecondary: "#8b949e", // サブテキスト
  success: "#34d399",       // 正解・成功
  error: "#f87171",         // 不正解・エラー
  warning: "#fbbf24",       // 警告
}
```

### スコア表示の色分け
- 80%以上: 成功色（緑）「素晴らしい！」
- 70-79%: 合格色（青）「合格ラインです」
- 60-69%: 警告色（オレンジ）「もう少し頑張ろう」
- 60%未満: エラー色（赤）「復習が必要です」

### アニメーション
- カードフリップ: 0.3秒のスムーズなアニメーション
- プログレスバー: 値変更時のスムーズな遷移
- 画面遷移: スライドアニメーション

### アクセシビリティ
- 十分なコントラスト比の確保
- タップ領域は最小44x44ポイント
- フォントサイズは読みやすいサイズ

---

## 8. 非機能要件

### パフォーマンス
- アプリ起動: 3秒以内
- 画面遷移: 0.5秒以内
- データ読み込み: ローディング表示を実装

### オフライン対応
- 問題・カードデータはローカルに保存
- 学習進捗はオフラインでも記録可能
- ネットワーク不要で基本機能は動作

### データ永続化
- AsyncStorageでローカル保存
- アプリ削除まで学習データを保持
- データリセット機能を提供

---

## 9. プロジェクト構造

```
project-root/
├── app/                      # 画面（Expo Router）
│   ├── _layout.tsx          # ルートレイアウト
│   ├── (tabs)/              # タブナビゲーション
│   │   ├── _layout.tsx
│   │   ├── index.tsx        # ホーム
│   │   ├── quiz.tsx         # クイズメニュー
│   │   ├── cards.tsx        # カードメニュー
│   │   └── settings.tsx     # 設定
│   ├── quiz/                # クイズ画面
│   │   ├── full-test.tsx
│   │   ├── mini-test.tsx
│   │   └── results.tsx
│   └── cards/
│       └── study.tsx        # カード学習
├── components/              # 再利用コンポーネント
│   ├── ProgressBar.tsx
│   ├── QuestionView.tsx
│   ├── QuizHeader.tsx
│   ├── ScoreRadarChart.tsx
│   └── ...
├── stores/                  # Zustand Store
│   ├── progress-store.ts
│   ├── question-store.ts
│   ├── flashcard-store.ts
│   └── notification-store.ts
├── context/                 # React Context
│   └── theme-context.tsx
├── constants/               # 定数
│   └── chapters.ts
├── types/                   # TypeScript型定義
│   ├── question.ts
│   └── flashcard.ts
├── data/                    # サンプルデータ
│   ├── sample-questions.ts
│   └── sample-flashcards.ts
├── utils/                   # ユーティリティ
│   ├── format-time.ts
│   └── notifications.ts
└── assets/                  # 画像・フォント
    ├── images/
    └── fonts/
```

---

## 10. 開発フェーズ

### Phase 1: 基盤構築
1. Expo プロジェクト初期化
2. Expo Router v6 セットアップ
3. TypeScript 設定
4. 基本的なナビゲーション実装

### Phase 2: 状態管理
1. Zustand Store 実装
2. AsyncStorage 永続化設定
3. テーマ Context 実装

### Phase 3: クイズ機能
1. 問題データ構造定義
2. ミニテスト画面実装
3. フルテスト画面実装
4. 結果画面実装
5. 進捗保存機能

### Phase 4: フラッシュカード機能
1. カードデータ構造定義
2. カード学習画面実装
3. フリップアニメーション
4. SM-2アルゴリズム実装

### Phase 5: ダッシュボード
1. ホーム画面実装
2. 進捗表示コンポーネント
3. レーダーチャート実装
4. 月間学習進捗

### Phase 6: 設定・通知
1. 設定画面実装
2. ダークモード対応
3. 通知機能実装
4. データ管理機能

### Phase 7: 仕上げ
1. エラーハンドリング
2. ローディング状態
3. アプリレビュー機能
4. パフォーマンス最適化

---

## 11. 実装時の注意点

### コーディング規約
- 関数コンポーネント + React Hooks を使用
- インデント: 2スペース
- コンポーネント名: PascalCase
- Store名: xxxStore.ts
- フック名: useXxx.ts

### パスエイリアス
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

// 使用例
import { useProgressStore } from "@/stores/progress-store";
```

### エラーハンドリング
- ErrorBoundary でアプリ全体をラップ
- try-catch でストア操作をハンドリング
- ユーザーフレンドリーなエラーメッセージ

---

## 12. 参考: SM-2アルゴリズム

スペース反復学習のための標準的なアルゴリズム。

```typescript
function calculateNextReview(card: Flashcard, quality: number) {
  // quality: 1-5 の品質スコア

  let { interval, repetitions, easeFactor } = card;

  if (quality >= 3) {
    // 正解の場合
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // 不正解の場合
    repetitions = 0;
    interval = 1;
  }

  // easeFactor の調整
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, easeFactor);

  const nextReview = dayjs().add(interval, 'day').toISOString();

  return { interval, repetitions, easeFactor, nextReview };
}
```

---

## まとめ

このプロンプトに従って開発することで、以下の特徴を持つアプリが完成します：

1. **効率的な学習**: クイズ + フラッシュカードの2つの学習方式
2. **科学的なアプローチ**: SM-2アルゴリズムによるスペース反復学習
3. **モチベーション維持**: 進捗可視化、月間目標、レーダーチャート
4. **使いやすさ**: ダークモード、オフライン対応、直感的なUI
5. **マルチプラットフォーム**: iOS/Android/Web 対応

---

*このドキュメントは、既存アプリの仕様から逆算して作成されました。*
