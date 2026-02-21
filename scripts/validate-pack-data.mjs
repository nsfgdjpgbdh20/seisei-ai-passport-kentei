#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const repoRoot = process.cwd();

const CHAPTERS = [
  "第1章：AI（人工知能）",
  "第2章：生成AI（ジェネレーティブAI）",
  "第3章：現在の生成AI（ジェネレーティブAI）の動向",
  "第4章：情報リテラシー・AI事業者ガイドライン・AI新法",
  "第5章：テキスト生成AIのプロンプト制作と実例",
];

const QUESTION_BASIC_PACK_ID = "quiz_pack_basic_001";
const QUESTION_PLUS_PACK_ID = "quiz_pack_plus_001";
const FLASHCARD_BASIC_PACK_ID = "flashcard_pack_basic_001";
const FLASHCARD_PLUS_PACK_ID = "flashcard_pack_plus_001";

function loadExport(filePath, exportName) {
  const src = fs.readFileSync(filePath, "utf8");
  const transpiled = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  const module = { exports: {} };
  const ctx = {
    module,
    exports: module.exports,
    require,
    console,
  };
  vm.createContext(ctx);
  vm.runInContext(transpiled, ctx, { filename: filePath });
  return module.exports[exportName];
}

function countBy(items, selector) {
  const map = new Map();
  for (const item of items) {
    const key = selector(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

function assert(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
}

function main() {
  const questionFile = path.join(repoRoot, "data/sample-questions.ts");
  const flashcardFile = path.join(repoRoot, "data/sample-flashcards.ts");
  const questionPackFile = path.join(repoRoot, "data/sample-question-packs.ts");
  const flashcardPackFile = path.join(repoRoot, "data/sample-flashcard-packs.ts");

  const questions = loadExport(questionFile, "sampleQuestions");
  const flashcards = loadExport(flashcardFile, "sampleFlashcards");
  const questionPacks = loadExport(questionPackFile, "sampleQuestionPacks");
  const flashcardPacks = loadExport(flashcardPackFile, "sampleFlashcardPacks");

  const errors = [];

  assert(Array.isArray(questions), "sampleQuestions の読み込みに失敗しました。", errors);
  assert(Array.isArray(flashcards), "sampleFlashcards の読み込みに失敗しました。", errors);
  assert(Array.isArray(questionPacks), "sampleQuestionPacks の読み込みに失敗しました。", errors);
  assert(Array.isArray(flashcardPacks), "sampleFlashcardPacks の読み込みに失敗しました。", errors);

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  assert(questions.length === 200, `問題数が200件ではありません: ${questions.length}`, errors);
  assert(flashcards.length === 200, `カード数が200件ではありません: ${flashcards.length}`, errors);

  const questionIdCount = countBy(questions, (q) => q.id);
  const flashcardIdCount = countBy(flashcards, (c) => c.id);
  for (const [id, count] of questionIdCount) {
    assert(count === 1, `問題ID重複: ${id} (${count}件)`, errors);
  }
  for (const [id, count] of flashcardIdCount) {
    assert(count === 1, `カードID重複: ${id} (${count}件)`, errors);
  }

  const questionPackIds = new Set(questionPacks.map((pack) => pack.id));
  const flashcardPackIds = new Set(flashcardPacks.map((pack) => pack.id));

  for (const question of questions) {
    assert(questionPackIds.has(question.packId), `未定義の問題packId: ${question.packId}`, errors);
    assert(Array.isArray(question.choices), `choices が配列ではありません: question ${question.id}`, errors);
    assert(question.choices.length === 4, `選択肢数が4ではありません: question ${question.id}`, errors);
    assert(
      Number.isInteger(question.answerIndex) && question.answerIndex >= 0 && question.answerIndex < 4,
      `answerIndex が不正です: question ${question.id}`,
      errors
    );
  }

  for (const card of flashcards) {
    assert(flashcardPackIds.has(card.packId), `未定義のカードpackId: ${card.packId}`, errors);
  }

  const questionPackCounts = countBy(questions, (question) => question.packId);
  const flashcardPackCounts = countBy(flashcards, (card) => card.packId);

  for (const pack of questionPacks) {
    const actual = questionPackCounts.get(pack.id) ?? 0;
    assert(
      actual === pack.questionCount,
      `問題パック件数不一致: ${pack.id} 定義${pack.questionCount}件 / 実際${actual}件`,
      errors
    );
  }

  for (const pack of flashcardPacks) {
    const actual = flashcardPackCounts.get(pack.id) ?? 0;
    assert(
      actual === pack.cardCount,
      `カードパック件数不一致: ${pack.id} 定義${pack.cardCount}件 / 実際${actual}件`,
      errors
    );
  }

  const basicStems = new Set(
    questions
      .filter((question) => question.packId === QUESTION_BASIC_PACK_ID)
      .map((question) => question.stem)
  );
  const plusStems = new Set(
    questions
      .filter((question) => question.packId === QUESTION_PLUS_PACK_ID)
      .map((question) => question.stem)
  );
  for (const stem of plusStems) {
    assert(!basicStems.has(stem), `追加問題のstemが既存と重複: ${stem}`, errors);
  }

  const basicTerms = new Set(
    flashcards
      .filter((card) => card.packId === FLASHCARD_BASIC_PACK_ID)
      .map((card) => card.term)
  );
  const plusTerms = new Set(
    flashcards
      .filter((card) => card.packId === FLASHCARD_PLUS_PACK_ID)
      .map((card) => card.term)
  );
  for (const term of plusTerms) {
    assert(!basicTerms.has(term), `追加カードtermが既存と重複: ${term}`, errors);
  }

  const plusQuestionChapterCounts = countBy(
    questions.filter((question) => question.packId === QUESTION_PLUS_PACK_ID),
    (question) => question.chapter
  );
  const plusFlashcardChapterCounts = countBy(
    flashcards.filter((card) => card.packId === FLASHCARD_PLUS_PACK_ID),
    (card) => card.chapter
  );
  for (const chapter of CHAPTERS) {
    assert(
      (plusQuestionChapterCounts.get(chapter) ?? 0) === 20,
      `追加問題の章配分が20件ではありません: ${chapter}`,
      errors
    );
    assert(
      (plusFlashcardChapterCounts.get(chapter) ?? 0) === 20,
      `追加カードの章配分が20件ではありません: ${chapter}`,
      errors
    );
  }

  if (errors.length > 0) {
    console.log("[NG] データ検証に失敗しました。");
    errors.forEach((error) => console.log(`- ${error}`));
    process.exit(1);
  }

  console.log("[OK] 追加パックのデータ検証に成功しました。");
}

try {
  main();
} catch (error) {
  console.error("[NG] スクリプト実行に失敗しました。");
  console.error(String(error));
  process.exit(1);
}
