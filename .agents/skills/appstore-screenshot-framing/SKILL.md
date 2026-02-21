---
name: appstore-screenshot-framing
description: App Store 審査提出向けの iOS スクリーンショットを、アプリ全体のトンマナに合わせたテーマで一括加工する。ユーザーが「App Store用スクショにiPhoneフレームを付けたい」「審査画像をそれっぽく整えたい」「iOSスクショを紹介画像化したい」など、自然文でフレーム付き紹介画像の生成を求めた時に使用する。
---

# App Store Screenshot Framing

iOSスクリーンショットを、固定テーマと同一構図で統一して合成する（1〜10枚対応）。

## 入出力

- 入力ディレクトリ: `release-assets/source/user-uploaded`
- 出力ディレクトリ（ラン別）: `release-assets/screenshots/ios-6_7/runs/run-YYYYMMDD-HHmmss`
- 最新参照（自動更新）: `release-assets/screenshots/ios-6_7/latest`
- 中間ファイル:
  - `release-assets/source/generated/shot-manifest.json`
  - `release-assets/source/generated/theme.json`
  - `release-assets/source/generated/captions.json`
  - `release-assets/source/generated/style.json`

## 実行手順

1. 依存を確認する。

```bash
npm install
```

2. テーマを生成する（既存があれば再利用）。

```bash
npm run assets:ios:framed:theme
```

3. 画像内容からショットマニフェストを作成する（Codex 実行時に必須）。

- `shot-manifest.json` は `sourceName / suggestedName / title / subtitle` を各画像分含める。
- 入力画像枚数とマニフェスト件数は一致させる。

4. 構図ルールを生成する（全画像で同一の正面構図）。

```bash
npm run assets:ios:framed:style
```

5. コピーを生成し、フレーム付き画像を生成する。

```bash
npm run assets:ios:framed
```

6. 出力を検証する（既定で `latest` を検証対象にする）。

```bash
npm run assets:ios:framed:check
```

## 仕様

- テーマ色は参考HTML準拠の固定パレットを使う。
- 入力画像は1〜10枚に対応し、全画像を正面中央の同一構図で統一する。
- 全画像で背景色・見出し色・タイポを統一する。
- チップ行（進捗管理/習得率グラフ/直感的操作）は表示しない。
- iPhoneフレームは固定テンプレート（`iphone-frame-overlay.png`）を最前面合成する。
- 外周影は使わず、`背景 → 端末（画面 + フレーム最前面） → タイトル/サブタイトル` の順で合成する。
- 出力サイズはすべて `1242x2688` に固定する。
- 出力は毎回新規ランフォルダへ生成し、既存成果物を上書きしない。
- `latest` は最新ランを指すシンボリックリンクとして自動更新する。

## 失敗時対応

- `shot-manifest.json` がない: Codexで画像ごとの `sourceName / suggestedName / title / subtitle` を作成してから再実行する。
- `shot-manifest.json` の件数不一致/空値/重複: マニフェストを修正して再実行する。
- `theme.json` がない: `npm run assets:ios:framed:theme` を先に実行する。
- `captions.json` がない: `npm run assets:ios:framed` を再実行する。
- `style.json` がない: `npm run assets:ios:framed:style` を先に実行する。
- `iphone-frame-overlay.meta.json` がない: スキル資産を再取得するか、`assets` 配下のメタJSONを復元する。
- iOS入力画像が不足/超過: `release-assets/source/user-uploaded` の iOS PNG を1〜10枚に調整する。
