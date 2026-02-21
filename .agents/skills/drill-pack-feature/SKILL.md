---
name: drill-pack-feature
description: Expo Router + Zustand + TypeScript 構成のReact Nativeドリルアプリに、iOS向け追加問題パック（非消費型IAP、購入復元、出題範囲切替）機能を半自動で導入・移植する。ユーザーが「追加問題パックを付けたい」「IAPで問題集を増やしたい」「既存ドリルアプリに同等のパック管理を入れたい」と求めた時に使用する。
---

# Drill Pack Feature

既存のドリルアプリに、追加問題パック機能を再現性高く導入する。

## 前提

- 対象アプリは Expo/React Native + TypeScript + Zustand を前提にする。
- 課金は iOS の非消費型 IAP を標準にする。
- 実装は「提案のみ」で止めず、ユーザーが明示的に拒否しない限りファイル編集まで行う。
- 既存差分がある場合は上書きしない。今回の変更に必要な最小差分だけ追加する。

## 実行フロー

### 1. 診断

1. 次の責務が存在するか確認する。
- 問題型定義（`Question` / `QuestionPack`）
- 問題データ（`packId` を持つ）
- 購入状態管理ストア
- 出題ロジック
- 設定画面または導線画面
- `app.json`（`react-native-iap` 導入可否）
2. ファイル名が異なる場合は、同等責務の実ファイルを特定してマッピングする。
3. マッピング結果は `references/source-feature-map.md` の形式で整理してから実装に進む。

### 2. 実装

実装順を固定する。途中で順序を入れ替えない。

1. 型拡張
- `Question.packId` と `QuestionPack` 契約を追加または統一する。
2. パックデータ追加
- 基本パック（無料）と追加パック（有料）を定義する。
- 問題データに `packId` を付与する。
3. 購入ストア追加
- `ownedPackIds` / `selectedPackId` / `restore` / `purchase` を持つストアを実装する。
- iOS 以外は購入不可の分岐を明示する。
4. 出題フィルタ追加
- 購入済みパックだけを出題対象にする。
- 単一パック選択と全購入済みミックス出題を両立する。
5. 進捗スコープ追加
- 選択中パック範囲で進捗計算できるようにする。
6. UI導線追加
- 設定からパック管理画面へ遷移できるようにする。
- パック管理画面で選択・購入・復元を提供する。
7. `app.json` 反映
- `plugins` に `react-native-iap` を含める。
- iOS専用運用なら `android.blockedPermissions` に `com.android.vending.BILLING` を含める。

### 3. 問題下書き生成

用語シードから追加パック問題を作る場合は次を使う。

```bash
node .agents/skills/drill-pack-feature/scripts/generate-pack-draft.mjs --config ./pack-draft.config.json
```

- 出力先が既存ファイルの場合は `--force` を明示しない限り停止する。
- 入力不足や不整合（比率合計、seed不足、ID不正）は fail-fast で停止する。

### 4. 整合性検証

```bash
node .agents/skills/drill-pack-feature/scripts/verify-pack-feature.mjs
```

少なくとも以下を確認する。
- pack ID 重複なし
- question ID 重複なし
- 問題の `packId` が定義済みパックに一致
- `questionCount` と実件数の一致
- 有料パックに `productId` が設定されている
- iOS IAP 前提設定（`react-native-iap` / iOS分岐）が存在する

### 5. 実装外運用チェック

App Store Connect 側の作業は `references/ios-iap-checklist.md` を使う。

## 参照ファイル

- 実装責務マップ: `references/source-feature-map.md`
- 移植チェックリスト: `references/porting-checklist.md`
- iOS IAP運用チェック: `references/ios-iap-checklist.md`

## 依存注意

`skill-creator` の補助スクリプト（`init_skill.py` / `quick_validate.py`）は `PyYAML` が必要。
`ModuleNotFoundError: yaml` が出る環境では、先に依存を導入してから検証する。
