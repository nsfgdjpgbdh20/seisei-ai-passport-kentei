# 参照元機能マップ（it-passport-qa）

このファイルは、`drill-pack-feature` を他アプリへ移植する際の「責務対応表」。

## コア契約

| 責務 | 参照ファイル | 要点 |
| --- | --- | --- |
| 問題型定義 | `/Users/nakayamashun/Desktop/test/it-passport-qa/types/question.ts` | `Question.packId` と `QuestionPack` を定義 |
| パック定義 | `/Users/nakayamashun/Desktop/test/it-passport-qa/data/sample-packs.ts` | 基本パック + 有料パック + `productId` |
| 問題データ | `/Users/nakayamashun/Desktop/test/it-passport-qa/data/sample-questions.ts` | 各問題に `packId` を付与 |

## 状態管理

| 責務 | 参照ファイル | 要点 |
| --- | --- | --- |
| 購入状態 | `/Users/nakayamashun/Desktop/test/it-passport-qa/stores/purchase-store.ts` | `ownedPackIds` / `selectedPackId` / 購入・復元 |
| 出題範囲制御 | `/Users/nakayamashun/Desktop/test/it-passport-qa/stores/question-store.ts` | 購入済みパックのみを出題対象化 |
| 進捗スコープ | `/Users/nakayamashun/Desktop/test/it-passport-qa/stores/progress-store.ts` | 選択パックで進捗を再計算 |

## UI導線

| 責務 | 参照ファイル | 要点 |
| --- | --- | --- |
| パック管理画面 | `/Users/nakayamashun/Desktop/test/it-passport-qa/app/pack-management.tsx` | 選択・購入・復元・全パック選択 |
| 設定導線 | `/Users/nakayamashun/Desktop/test/it-passport-qa/app/(tabs)/settings.tsx` | 設定から `/pack-management` へ遷移 |

## IAP実装

| 責務 | 参照ファイル | 要点 |
| --- | --- | --- |
| IAPユーティリティ | `/Users/nakayamashun/Desktop/test/it-passport-qa/utils/iap.ts` | `requestPackPurchase` / `restorePackPurchases` |
| Expo設定 | `/Users/nakayamashun/Desktop/test/it-passport-qa/app.json` | `react-native-iap` プラグイン、Android課金権限ブロック |

## 移植時ルール

1. ファイル名が違っても、責務が一致する実装先へマッピングしてから編集する。
2. 直接流用できない場合は、責務単位で最小構成を新規作成して接続する。
3. マッピングが曖昧なまま編集を開始しない。
