# 追加問題パック移植チェックリスト

## 0. 事前確認

- [ ] 対象は Expo/React Native + TypeScript + Zustand 構成である
- [ ] 既存差分を壊さない前提で作業する
- [ ] iOS IAPのみを標準仕様として合意済み

## 1. 診断

- [ ] 問題型定義ファイルを特定した
- [ ] 問題データ格納ファイルを特定した
- [ ] 購入状態を持つストア（または追加先）を特定した
- [ ] 出題ロジックを持つストア（または追加先）を特定した
- [ ] 設定画面と遷移導線を特定した
- [ ] `app.json` のIAP設定箇所を特定した

## 2. 実装（固定順）

- [ ] `Question` / `QuestionPack` 契約を追加した
- [ ] パック定義を追加した（無料1件 + 有料n件）
- [ ] 問題データへ `packId` を付与した
- [ ] 購入ストアへ `ownedPackIds` / `selectedPackId` を追加した
- [ ] 購入処理（非消費型）と復元処理を実装した
- [ ] iOS以外の購入不可分岐を実装した
- [ ] 出題ロジックで購入済みパックのみ抽出した
- [ ] 進捗計算を選択パック範囲で算出できるようにした
- [ ] 設定画面からパック管理画面へ遷移できるようにした
- [ ] パック管理画面で選択・購入・復元を実装した
- [ ] `app.json` へ `react-native-iap` を反映した
- [ ] iOS専用運用なら Android課金権限をブロックした

## 3. 問題下書き生成（必要時）

1. 設定JSONを用意する。
2. 生成する。

```bash
node .agents/skills/drill-pack-feature/scripts/generate-pack-draft.mjs --config ./pack-draft.config.json
```

3. 既存ファイルを上書きする場合のみ `--force` を使う。

## 4. 整合性チェック

```bash
node .agents/skills/drill-pack-feature/scripts/verify-pack-feature.mjs
```

- [ ] pack ID 重複なし
- [ ] question ID 重複なし
- [ ] 未定義 `packId` なし
- [ ] `questionCount` と実件数が一致
- [ ] 有料パックに `productId` が付与
- [ ] `react-native-iap` 設定あり

## 5. 回帰チェック

- [ ] `npm run typecheck` が成功
- [ ] `npm run lint` が成功
- [ ] `npm run test` が成功

## 6. 実装外作業

- [ ] App Store Connect の IAP 商品を作成した
- [ ] Product ID が実装値と一致した
- [ ] 復元導線を審査メモに明記した
- [ ] 詳細は `ios-iap-checklist.md` を確認した
