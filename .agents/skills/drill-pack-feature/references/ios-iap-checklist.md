# iOS IAP 運用チェックリスト（非消費型）

## 1. 実装一致確認

- [ ] 各有料パックに `productId` が設定されている
- [ ] パック購入成功後に即時アンロックされる
- [ ] 復元ボタンから購入復元できる
- [ ] 未購入パックは選択できない

## 2. App Store Connect 設定

- [ ] 種別: 非消費型（Non-Consumable）
- [ ] Product ID: 実装値と完全一致
- [ ] Display Name / Description: ja-JP, en-US を設定
- [ ] 価格: 方針どおりに設定
- [ ] 審査用スクリーンショットを登録

## 3. 審査メモ（テンプレ）

```text
This app uses non-consumable in-app purchases for additional question packs.

How to verify:
1) Open Settings tab.
2) Tap "問題パック管理".
3) Purchase any additional pack.
4) Confirm the pack becomes selectable immediately.
5) Use the restore button to recover prior purchases.

Product IDs:
- <product_id_1>
- <product_id_2>
- <product_id_3>
```

## 4. 最終確認

- [ ] Sandbox/TestFlight で購入テスト済み
- [ ] 復元テスト済み
- [ ] キャンセル時にクラッシュしない
- [ ] 非iOS（Android等）で購入導線が適切に制限される
