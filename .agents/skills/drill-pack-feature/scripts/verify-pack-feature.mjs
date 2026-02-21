#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const usage = `
使い方:
  node .agents/skills/drill-pack-feature/scripts/verify-pack-feature.mjs [--root /path/to/repo]

オプション:
  --root            対象リポジトリルート（既定: 現在ディレクトリ）
  --packs           パック定義ファイル（既定: data/sample-packs.ts）
  --flashcard-packs フラッシュカードパック定義ファイル（既定: data/sample-flashcard-packs.ts）
  --questions-root  問題ファイル探索ルート（既定: data）
  --flashcards-root フラッシュカードファイル探索ルート（既定: data）
  --app-config      app.json へのパス（既定: app.json）
  --purchase-store  purchase-store へのパス（既定: stores/purchase-store.ts）
  --iap-utils       IAPユーティリティへのパス（既定: utils/iap.ts）
  --strict-ios-iap  iOS専用構成チェックを厳格化（既定: true）
`;

const fail = (message) => {
  console.error(`[ERROR] ${message}`);
  process.exit(1);
};

const parseBoolean = (value, optionName) => {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  fail(`${optionName} は true または false で指定してください。`);
};

const parseArgs = (argv) => {
  const args = {
    root: process.cwd(),
    packs: "data/sample-packs.ts",
    flashcardPacks: "data/sample-flashcard-packs.ts",
    questionsRoot: "data",
    flashcardsRoot: "data",
    appConfig: "app.json",
    purchaseStore: "stores/purchase-store.ts",
    iapUtils: "utils/iap.ts",
    strictIosIap: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--root") {
      args.root = argv[i + 1] ?? "";
      i += 1;
      continue;
    }

    if (token === "--packs") {
      args.packs = argv[i + 1] ?? "";
      i += 1;
      continue;
    }

    if (token === "--flashcard-packs") {
      args.flashcardPacks = argv[i + 1] ?? "";
      i += 1;
      continue;
    }

    if (token === "--questions-root") {
      args.questionsRoot = argv[i + 1] ?? "";
      i += 1;
      continue;
    }

    if (token === "--flashcards-root") {
      args.flashcardsRoot = argv[i + 1] ?? "";
      i += 1;
      continue;
    }

    if (token === "--app-config") {
      args.appConfig = argv[i + 1] ?? "";
      i += 1;
      continue;
    }

    if (token === "--purchase-store") {
      args.purchaseStore = argv[i + 1] ?? "";
      i += 1;
      continue;
    }

    if (token === "--iap-utils") {
      args.iapUtils = argv[i + 1] ?? "";
      i += 1;
      continue;
    }

    if (token === "--strict-ios-iap") {
      args.strictIosIap = parseBoolean(argv[i + 1] ?? "", "--strict-ios-iap");
      i += 1;
      continue;
    }

    if (token === "--help" || token === "-h") {
      console.log(usage.trim());
      process.exit(0);
    }

    fail(`不明なオプションです: ${token}\n${usage}`);
  }

  return args;
};

const readText = async (filePath) => {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    fail(`ファイルを読み込めませんでした: ${filePath}\n${String(error)}`);
  }
};

const listQuestionFiles = async (rootDir) => {
  const files = [];

  const walk = async (target) => {
    const entries = await fs.readdir(target, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(target, entry.name);

      if (entry.isDirectory()) {
        await walk(entryPath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith("questions.ts")) {
        files.push(entryPath);
      }
    }
  };

  await walk(rootDir);

  return files.sort();
};

const listFlashcardFiles = async (rootDir) => {
  const files = [];

  const walk = async (target) => {
    const entries = await fs.readdir(target, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(target, entry.name);

      if (entry.isDirectory()) {
        await walk(entryPath);
        continue;
      }

      if (
        entry.isFile()
        && entry.name.endsWith(".ts")
        && entry.name.includes("flashcard")
        && !entry.name.includes("pack")
      ) {
        files.push(entryPath);
      }
    }
  };

  await walk(rootDir);

  return files.sort();
};

const parsePacks = (source) => {
  const packs = [];
  const regex = /{\s*id:\s*"([^"]+)"[\s\S]*?productId:\s*(null|"[^"]+")[\s\S]*?price:\s*(\d+)[\s\S]*?questionCount:\s*(\d+)/g;
  let match;

  while ((match = regex.exec(source)) !== null) {
    packs.push({
      id: match[1],
      productId: match[2] === "null" ? null : match[2].slice(1, -1),
      price: Number(match[3]),
      questionCount: Number(match[4]),
    });
  }

  return packs;
};

const parseFlashcardPacks = (source) => {
  const packs = [];
  const regex = /{\s*id:\s*"([^"]+)"[\s\S]*?productId:\s*(null|"[^"]+")[\s\S]*?price:\s*(\d+)[\s\S]*?cardCount:\s*(\d+)/g;
  let match;

  while ((match = regex.exec(source)) !== null) {
    packs.push({
      id: match[1],
      productId: match[2] === "null" ? null : match[2].slice(1, -1),
      price: Number(match[3]),
      cardCount: Number(match[4]),
    });
  }

  return packs;
};

const parsePackIds = (source) => {
  const packIds = [];
  const regex = /packId:\s*"([^"]+)"/g;
  let match;

  while ((match = regex.exec(source)) !== null) {
    packIds.push(match[1]);
  }

  return packIds;
};

const parseQuestionIds = (source) => {
  const ids = [];
  const regex = /id:\s*(\d+)/g;
  let match;

  while ((match = regex.exec(source)) !== null) {
    ids.push(Number(match[1]));
  }

  return ids;
};

const parseEnsureLengthDomainCounts = (source) => {
  const counts = new Map();
  const regex = /ensureLength\([^,]+,\s*(\d+)\s*,\s*"([^"]+)"\s*\)/g;
  let match;

  while ((match = regex.exec(source)) !== null) {
    const count = Number(match[1]);
    const label = match[2];
    let domain = null;

    if (label.includes("ストラテジ")) {
      domain = "ストラテジ";
    } else if (label.includes("マネジメント")) {
      domain = "マネジメント";
    } else if (label.includes("テクノロジ")) {
      domain = "テクノロジ";
    }

    if (!domain) {
      continue;
    }

    counts.set(domain, count);
  }

  return counts;
};

const parseSeedArrayCounts = (source) => {
  const counts = new Map();
  const regex = /const\s+([A-Z_]+)\s*:\s*QuestionSeed\[\]\s*=\s*\[([\s\S]*?)\];/g;
  let match;

  while ((match = regex.exec(source)) !== null) {
    const varName = match[1];
    const body = match[2];
    const itemCount = (body.match(/{\s*topic:/g) ?? []).length;
    counts.set(varName, itemCount);
  }

  return counts;
};

const parseBuildQuestionCalls = (source) => {
  const calls = [];
  const regex = /buildQuestions\(\s*([A-Z_]+)\s*,\s*"([^"]+)"\s*,\s*(\d+)\s*\)/g;
  let match;

  while ((match = regex.exec(source)) !== null) {
    calls.push({
      seedVar: match[1],
      domain: match[2],
      startId: Number(match[3]),
    });
  }

  return calls;
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(args.root);

  const packsPath = path.resolve(root, args.packs);
  const flashcardPacksPath = path.resolve(root, args.flashcardPacks);
  const questionsRootPath = path.resolve(root, args.questionsRoot);
  const flashcardsRootPath = path.resolve(root, args.flashcardsRoot);
  const appConfigPath = path.resolve(root, args.appConfig);
  const purchaseStorePath = path.resolve(root, args.purchaseStore);
  const iapUtilsPath = path.resolve(root, args.iapUtils);

  const errors = [];
  const warnings = [];

  const packsSource = await readText(packsPath);
  const packs = parsePacks(packsSource);

  if (packs.length === 0) {
    fail(`パック定義を抽出できませんでした: ${packsPath}`);
  }

  const packIdCounts = new Map();
  for (const pack of packs) {
    packIdCounts.set(pack.id, (packIdCounts.get(pack.id) ?? 0) + 1);
  }

  for (const [packId, count] of packIdCounts.entries()) {
    if (count > 1) {
      errors.push(`pack ID が重複しています: ${packId} (${count}件)`);
    }
  }

  const paidPacks = packs.filter((pack) => pack.price > 0);
  for (const pack of paidPacks) {
    if (!pack.productId || pack.productId.trim().length === 0) {
      errors.push(`有料パックに productId がありません: ${pack.id}`);
    }
  }

  const productIdCounts = new Map();
  for (const pack of packs) {
    if (!pack.productId) {
      continue;
    }
    productIdCounts.set(pack.productId, (productIdCounts.get(pack.productId) ?? 0) + 1);
  }

  for (const [productId, count] of productIdCounts.entries()) {
    if (count > 1) {
      errors.push(`productId が重複しています: ${productId} (${count}件)`);
    }
  }

  const flashcardPacksSource = await readText(flashcardPacksPath);
  const flashcardPacks = parseFlashcardPacks(flashcardPacksSource);

  if (flashcardPacks.length === 0) {
    fail(`フラッシュカードパック定義を抽出できませんでした: ${flashcardPacksPath}`);
  }

  const flashcardPackIdCounts = new Map();
  for (const pack of flashcardPacks) {
    flashcardPackIdCounts.set(pack.id, (flashcardPackIdCounts.get(pack.id) ?? 0) + 1);
  }

  for (const [packId, count] of flashcardPackIdCounts.entries()) {
    if (count > 1) {
      errors.push(`flashcard pack ID が重複しています: ${packId} (${count}件)`);
    }
  }

  const paidFlashcardPacks = flashcardPacks.filter((pack) => pack.price > 0);
  for (const pack of paidFlashcardPacks) {
    if (!pack.productId || pack.productId.trim().length === 0) {
      errors.push(`有料フラッシュカードパックに productId がありません: ${pack.id}`);
    }
  }

  const flashcardProductIdCounts = new Map();
  for (const pack of flashcardPacks) {
    if (!pack.productId) {
      continue;
    }
    flashcardProductIdCounts.set(
      pack.productId,
      (flashcardProductIdCounts.get(pack.productId) ?? 0) + 1
    );
  }

  for (const [productId, count] of flashcardProductIdCounts.entries()) {
    if (count > 1) {
      errors.push(`flashcard productId が重複しています: ${productId} (${count}件)`);
    }
  }

  let questionFiles;
  try {
    questionFiles = await listQuestionFiles(questionsRootPath);
  } catch (error) {
    fail(`問題ファイル探索に失敗しました: ${questionsRootPath}\n${String(error)}`);
  }

  if (questionFiles.length === 0) {
    fail(`questions.ts ファイルが見つかりません: ${questionsRootPath}`);
  }

  const questionPackCounts = new Map();
  const questionIdToFile = new Map();

  for (const questionFile of questionFiles) {
    const content = await readText(questionFile);
    const directPackIds = parsePackIds(content);
    const directQuestionIds = parseQuestionIds(content);
    const uniquePackIds = Array.from(new Set(directPackIds));
    const ensureLengthDomainCounts = parseEnsureLengthDomainCounts(content);
    const seedArrayCounts = parseSeedArrayCounts(content);
    const buildCalls = parseBuildQuestionCalls(content);

    let estimatedGeneratedCount = 0;
    const estimatedGeneratedIds = [];

    if (
      uniquePackIds.length === 1
      && buildCalls.length > 0
      && (ensureLengthDomainCounts.size > 0 || seedArrayCounts.size > 0)
    ) {
      for (const call of buildCalls) {
        const count = ensureLengthDomainCounts.get(call.domain) ?? seedArrayCounts.get(call.seedVar);
        if (!count || count <= 0) {
          warnings.push(
            `buildQuestions の件数推定に失敗: ${questionFile} (${call.domain} / ${call.seedVar} の件数が見つかりません)`
          );
          continue;
        }

        estimatedGeneratedCount += count;

        for (let offset = 0; offset < count; offset += 1) {
          estimatedGeneratedIds.push(call.startId + offset);
        }
      }

      const packId = uniquePackIds[0];
      questionPackCounts.set(packId, (questionPackCounts.get(packId) ?? 0) + estimatedGeneratedCount);
    } else {
      for (const packId of directPackIds) {
        questionPackCounts.set(packId, (questionPackCounts.get(packId) ?? 0) + 1);
      }
    }

    const effectiveQuestionIds = estimatedGeneratedIds.length > 0
      ? [...directQuestionIds, ...estimatedGeneratedIds]
      : directQuestionIds;

    for (const id of effectiveQuestionIds) {
      if (questionIdToFile.has(id)) {
        const firstFile = questionIdToFile.get(id);
        errors.push(`question id が重複しています: ${id} (${firstFile} / ${questionFile})`);
      } else {
        questionIdToFile.set(id, questionFile);
      }
    }
  }

  const packIdSet = new Set(packs.map((pack) => pack.id));

  for (const [packId] of questionPackCounts.entries()) {
    if (!packIdSet.has(packId)) {
      errors.push(`問題側に未定義の packId があります: ${packId}`);
    }
  }

  for (const pack of packs) {
    const actualCount = questionPackCounts.get(pack.id) ?? 0;
    if (actualCount !== pack.questionCount) {
      errors.push(
        `questionCount 不一致: ${pack.id} (定義 ${pack.questionCount}件 / 実際 ${actualCount}件)`
      );
    }
  }

  let flashcardFiles;
  try {
    flashcardFiles = await listFlashcardFiles(flashcardsRootPath);
  } catch (error) {
    fail(`フラッシュカードファイル探索に失敗しました: ${flashcardsRootPath}\n${String(error)}`);
  }

  if (flashcardFiles.length === 0) {
    fail(`flashcard ファイルが見つかりません: ${flashcardsRootPath}`);
  }

  const flashcardPackCounts = new Map();
  const flashcardIdToFile = new Map();

  for (const flashcardFile of flashcardFiles) {
    const content = await readText(flashcardFile);
    const flashcardPackIds = parsePackIds(content);
    const flashcardIds = parseQuestionIds(content);

    for (const packId of flashcardPackIds) {
      flashcardPackCounts.set(packId, (flashcardPackCounts.get(packId) ?? 0) + 1);
    }

    for (const id of flashcardIds) {
      if (flashcardIdToFile.has(id)) {
        const firstFile = flashcardIdToFile.get(id);
        errors.push(`flashcard id が重複しています: ${id} (${firstFile} / ${flashcardFile})`);
      } else {
        flashcardIdToFile.set(id, flashcardFile);
      }
    }
  }

  const flashcardPackIdSet = new Set(flashcardPacks.map((pack) => pack.id));
  for (const [packId] of flashcardPackCounts.entries()) {
    if (!flashcardPackIdSet.has(packId)) {
      errors.push(`フラッシュカード側に未定義の packId があります: ${packId}`);
    }
  }

  for (const pack of flashcardPacks) {
    const actualCount = flashcardPackCounts.get(pack.id) ?? 0;
    if (actualCount !== pack.cardCount) {
      errors.push(
        `cardCount 不一致: ${pack.id} (定義 ${pack.cardCount}件 / 実際 ${actualCount}件)`
      );
    }
  }

  let appConfig;
  try {
    appConfig = JSON.parse(await readText(appConfigPath));
  } catch (error) {
    fail(`app.json のJSON解析に失敗しました: ${appConfigPath}\n${String(error)}`);
  }

  const plugins = appConfig?.expo?.plugins ?? [];
  const hasIapPlugin = Array.isArray(plugins)
    && plugins.some((plugin) => (Array.isArray(plugin) ? plugin[0] : plugin) === "react-native-iap");

  if (!hasIapPlugin) {
    errors.push(`app.json に react-native-iap プラグインが見つかりません。`);
  }

  const blockedPermissions = appConfig?.expo?.android?.blockedPermissions;
  const hasBlockedBilling = Array.isArray(blockedPermissions)
    && blockedPermissions.includes("com.android.vending.BILLING");

  if (args.strictIosIap && !hasBlockedBilling) {
    errors.push(`iOS専用運用向けの android.blockedPermissions(com.android.vending.BILLING) がありません。`);
  }

  const purchaseStoreSource = await readText(purchaseStorePath);
  if (!purchaseStoreSource.includes("Platform.OS === \"ios\"")) {
    errors.push(`purchase-store に iOS 判定ロジックが見つかりません。`);
  }

  if (!purchaseStoreSource.includes("restorePurchases")) {
    errors.push(`purchase-store に購入復元処理が見つかりません。`);
  }
  if (!purchaseStoreSource.includes("purchaseFlashcardPack")) {
    errors.push(`purchase-store にフラッシュカード追加パック購入処理が見つかりません。`);
  }
  if (!purchaseStoreSource.includes("selectedFlashcardPackId")) {
    errors.push(`purchase-store にフラッシュカード追加パックの選択状態が見つかりません。`);
  }

  const iapUtilsSource = await readText(iapUtilsPath);
  if (!iapUtilsSource.includes("requestPackPurchase")) {
    errors.push(`iap utils に requestPackPurchase が見つかりません。`);
  }
  if (!iapUtilsSource.includes("restorePackPurchases")) {
    errors.push(`iap utils に restorePackPurchases が見つかりません。`);
  }

  if (paidPacks.length === 0) {
    warnings.push("有料パックが0件です。IAP機能の存在価値を再確認してください。");
  }
  if (paidFlashcardPacks.length === 0) {
    warnings.push("有料フラッシュカードパックが0件です。追加カード販売導線を再確認してください。");
  }

  console.log("=== 追加パック整合性チェック ===");
  console.log(`root: ${root}`);
  console.log(`packs: ${packsPath}`);
  console.log(`flashcard-packs: ${flashcardPacksPath}`);
  console.log(`questions-root: ${questionsRootPath}`);
  console.log(`flashcards-root: ${flashcardsRootPath}`);
  console.log(`question-files: ${questionFiles.length}件`);
  console.log(`flashcard-files: ${flashcardFiles.length}件`);
  console.log(`packs: ${packs.length}件 (有料 ${paidPacks.length}件)`);
  console.log(`flashcard-packs: ${flashcardPacks.length}件 (有料 ${paidFlashcardPacks.length}件)`);

  for (const pack of packs) {
    const actualCount = questionPackCounts.get(pack.id) ?? 0;
    console.log(
      `- ${pack.id}: 定義${pack.questionCount}件 / 実際${actualCount}件 / price=${pack.price} / productId=${pack.productId ?? "null"}`
    );
  }

  for (const pack of flashcardPacks) {
    const actualCount = flashcardPackCounts.get(pack.id) ?? 0;
    console.log(
      `- ${pack.id}: 定義${pack.cardCount}件 / 実際${actualCount}件 / price=${pack.price} / productId=${pack.productId ?? "null"}`
    );
  }

  if (warnings.length > 0) {
    console.log("\n[WARN]");
    warnings.forEach((warning) => console.log(`- ${warning}`));
  }

  if (errors.length > 0) {
    console.log("\n[NG]");
    errors.forEach((error) => console.log(`- ${error}`));
    process.exit(1);
  }

  console.log("\n[OK] 整合性チェックに成功しました。");
};

main().catch((error) => {
  fail(String(error));
});
