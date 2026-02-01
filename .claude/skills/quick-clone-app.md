# Skill: アプリの高速クローン作成

このスキルは、既存の資格試験アプリを新しい題材で素早くクローンする際に使用します。

## 使用シーン

- 「このアプリを〇〇試験用にコピーして」
- 「〇〇検定バージョンを作って」
- 「同じ構造で△△アプリを作成」

## クイック手順（5ステップ）

### Step 1: 基本情報を確認

```
必要な情報:
□ 試験名（例: ITパスポート試験）
□ アプリ名（例: ITパスポート合格ドリル）
□ 分野構成（例: ストラテジ系、マネジメント系、テクノロジ系）
□ フルテスト設定（問題数 × 制限時間）
```

### Step 2: プロジェクトをコピー

```bash
# 新しいディレクトリにコピー
cp -r /path/to/seisei-ai-passport-kentei /path/to/new-app-name

# 移動して初期化
cd /path/to/new-app-name
rm -rf node_modules .git .expo
git init
```

### Step 3: 5つのファイルを編集

#### 3-1. constants/chapters.ts
```typescript
export const CHAPTERS = [
  "分野1の名前",
  "分野2の名前",
  "分野3の名前",
  // 必要に応じて追加
];
```

#### 3-2. app.json
```json
{
  "expo": {
    "name": "〇〇合格ドリル",
    "slug": "xxx-drill",
    "ios": { "bundleIdentifier": "app.yourname.xxx-drill" },
    "android": { "package": "app.yourname.xxx_drill" }
  }
}
```

#### 3-3. package.json
```json
{
  "name": "xxx-drill",
  "description": "〇〇試験対策アプリ"
}
```

#### 3-4. data/sample-questions.ts
問題データを入れ替え（詳細は generate-exam-data.md 参照）

#### 3-5. data/sample-flashcards.ts
カードデータを入れ替え（詳細は generate-exam-data.md 参照）

### Step 4: フルテスト設定を調整（任意）

`app/quiz/full-test.tsx` の定数を変更:

```typescript
// 試験に合わせて調整
const TOTAL_QUESTIONS = 100;  // 問題数
const TOTAL_TIME = 120 * 60;  // 制限時間（秒）
```

### Step 5: 動作確認

```bash
npm install
npm run start
```

## 変更不要なファイル一覧

以下は全試験で共通なので変更不要:

```
components/          # 全UIコンポーネント
stores/              # 全Zustand Store
context/             # Theme Context
types/               # 型定義
utils/               # ユーティリティ
app/_layout.tsx      # ルートレイアウト
app/(tabs)/_layout.tsx  # タブレイアウト
app/quiz/mini-test.tsx  # ミニテスト（10問固定）
app/quiz/results.tsx    # 結果画面
app/cards/study.tsx     # カード学習
```

## チェックリスト

クローン完了前の確認事項:

```
□ chapters.ts の分野名を変更した
□ sample-questions.ts の chapter が chapters.ts と一致している
□ sample-flashcards.ts の chapter が chapters.ts と一致している
□ app.json の name, slug, bundleIdentifier, package を変更した
□ package.json の name, description を変更した
□ npm install が成功する
□ npm run start でエラーなく起動する
□ 各タブが正常に表示される
□ ミニテストが開始できる
□ フラッシュカード学習ができる
```

## トラブルシューティング

### 「分野が表示されない」
→ chapters.ts と問題/カードデータの chapter 名が完全一致しているか確認

### 「問題が0問と表示される」
→ sample-questions.ts が正しくエクスポートされているか確認
→ 文法エラーがないか確認

### 「アプリが起動しない」
```bash
# キャッシュクリア
rm -rf node_modules .expo
npm install
npx expo start --clear
```

### 「レーダーチャートが崩れる」
→ 分野が6つ以上ある場合、ScoreRadarChart.tsx の調整が必要な場合あり

## 所要時間の目安

| 作業 | 時間 |
|------|------|
| プロジェクトコピー | 1分 |
| 設定ファイル編集 | 5分 |
| 問題データ作成（160問） | 60-120分（AIで生成） |
| カードデータ作成（100枚） | 30-60分（AIで生成） |
| 動作確認 | 10分 |
| **合計** | **約2-3時間** |

※問題・カードデータが既にある場合は30分程度で完了
