#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const DOMAINS = ["ストラテジ", "マネジメント", "テクノロジ"];
const DOMAIN_CODE = {
  ストラテジ: "ST",
  マネジメント: "MG",
  テクノロジ: "TE",
};
const LEVELS = new Set(["初級", "中級", "上級"]);

const usage = `
使い方:
  node .agents/skills/drill-pack-feature/scripts/generate-pack-draft.mjs --config ./pack-draft.config.json [--force]

オプション:
  --config  生成設定JSON（必須）
  --output  出力パスを上書き（任意）
  --force   既存出力ファイルを上書き（任意）
  --dry-run ファイルを書き込まず検証のみ実行（任意）
`;

const fail = (message) => {
  console.error(`[ERROR] ${message}`);
  process.exit(1);
};

const assertObject = (value, label) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(`${label} はオブジェクトで指定してください。`);
  }
};

const assertString = (value, label) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(`${label} は空でない文字列で指定してください。`);
  }
};

const assertInteger = (value, label, min = 0) => {
  if (!Number.isInteger(value) || value < min) {
    fail(`${label} は ${min} 以上の整数で指定してください。`);
  }
};

const parseArgs = (argv) => {
  const args = {
    config: null,
    output: null,
    force: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--config") {
      args.config = argv[i + 1] ?? null;
      i += 1;
      continue;
    }

    if (token === "--output") {
      args.output = argv[i + 1] ?? null;
      i += 1;
      continue;
    }

    if (token === "--force") {
      args.force = true;
      continue;
    }

    if (token === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (token === "--help" || token === "-h") {
      console.log(usage.trim());
      process.exit(0);
    }

    fail(`不明なオプションです: ${token}\n${usage}`);
  }

  if (!args.config) {
    fail(`--config は必須です。\n${usage}`);
  }

  return args;
};

const allocateByRatio = (total, domainRatio) => {
  const ratioSum = DOMAINS.reduce((sum, domain) => sum + domainRatio[domain], 0);

  if (ratioSum !== 100) {
    fail(`domainRatio の合計は100である必要があります。現在値: ${ratioSum}`);
  }

  const details = DOMAINS.map((domain) => {
    const raw = (total * domainRatio[domain]) / 100;
    const base = Math.floor(raw);
    return {
      domain,
      raw,
      base,
      remainder: raw - base,
    };
  });

  const allocated = Object.fromEntries(
    details.map((detail) => [detail.domain, detail.base])
  );

  let remaining = total - details.reduce((sum, detail) => sum + detail.base, 0);
  const sorted = [...details].sort((a, b) => {
    if (b.remainder !== a.remainder) {
      return b.remainder - a.remainder;
    }
    return DOMAINS.indexOf(a.domain) - DOMAINS.indexOf(b.domain);
  });

  for (let i = 0; i < remaining; i += 1) {
    const target = sorted[i % sorted.length];
    allocated[target.domain] += 1;
  }

  return allocated;
};

const buildStem = (level, term) => {
  if (level === "上級") {
    return `次のうち、高度論点「${term}」の説明として最も適切なものはどれか。`;
  }

  if (level === "中級") {
    return `実務で扱う「${term}」の説明として最も適切なものはどれか。`;
  }

  return `「${term}」の説明として最も適切なものはどれか。`;
};

const normalizeSeed = (seed, domain, index) => {
  assertObject(seed, `${domain} seeds[${index}]`);
  assertString(seed.topic, `${domain} seeds[${index}].topic`);
  assertString(seed.term, `${domain} seeds[${index}].term`);
  assertString(seed.definition, `${domain} seeds[${index}].definition`);

  if (seed.syllabusRef !== undefined && typeof seed.syllabusRef !== "string") {
    fail(`${domain} seeds[${index}].syllabusRef は文字列で指定してください。`);
  }

  return {
    topic: seed.topic.trim(),
    term: seed.term.trim(),
    definition: seed.definition.trim(),
    syllabusRef:
      typeof seed.syllabusRef === "string" && seed.syllabusRef.trim().length > 0
        ? seed.syllabusRef.trim()
        : null,
  };
};

const pickDistractors = (seeds, answerIndex) => {
  const answer = seeds[answerIndex];
  const distractors = [];

  for (let offset = 1; offset < seeds.length * 2; offset += 1) {
    const candidate = seeds[(answerIndex + offset) % seeds.length]?.definition;

    if (!candidate || candidate === answer.definition) {
      continue;
    }

    if (distractors.includes(candidate)) {
      continue;
    }

    distractors.push(candidate);

    if (distractors.length === 3) {
      break;
    }
  }

  if (distractors.length < 3) {
    fail(`「${answer.term}」の選択肢を作れませんでした。seeds の定義重複を確認してください。`);
  }

  return distractors;
};

const toExportName = (packId) => {
  const parts = packId.split("_").filter((part) => part.length > 0);
  if (parts.length === 0) {
    fail(`packId が不正です: ${packId}`);
  }

  const [first, ...rest] = parts;
  const camel = [first.toLowerCase()]
    .concat(rest.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()))
    .join("");

  return `${camel}Questions`;
};

const formatQuestion = (question) => {
  const choiceLines = question.choices.map((choice) => `      ${JSON.stringify(choice)},`).join("\n");

  return `  {
    id: ${question.id},
    domain: ${JSON.stringify(question.domain)},
    topic: ${JSON.stringify(question.topic)},
    stem: ${JSON.stringify(question.stem)},
    choices: [
${choiceLines}
    ],
    answerIndex: ${question.answerIndex},
    explanation: ${JSON.stringify(question.explanation)},
    glossaryTerm: ${JSON.stringify(question.glossaryTerm)},
    glossaryDefinition: ${JSON.stringify(question.glossaryDefinition)},
    syllabusRef: ${JSON.stringify(question.syllabusRef)},
    packId: ${JSON.stringify(question.packId)},
  },`;
};

const buildQuestions = (config) => {
  const perDomainCounts = allocateByRatio(config.questionCount, config.domainRatio);

  const questions = [];
  let globalIndex = 0;

  for (const domain of DOMAINS) {
    const seeds = config.seeds[domain];
    const count = perDomainCounts[domain];

    if (count === 0) {
      continue;
    }

    if (!Array.isArray(seeds)) {
      fail(`seeds.${domain} は配列で指定してください。`);
    }

    if (seeds.length < count) {
      fail(`seeds.${domain} が不足しています。必要 ${count} 件、実際 ${seeds.length} 件です。`);
    }

    if (seeds.length < 4) {
      fail(`seeds.${domain} は最低4件必要です。現在 ${seeds.length} 件です。`);
    }

    const normalizedSeeds = seeds.map((seed, index) => normalizeSeed(seed, domain, index));

    for (let localIndex = 0; localIndex < count; localIndex += 1) {
      const seed = normalizedSeeds[localIndex];
      const distractors = pickDistractors(normalizedSeeds, localIndex);
      const answerIndex = (config.startId + globalIndex) % 4;
      const choices = [...distractors];
      choices.splice(answerIndex, 0, seed.definition);

      const fallbackRef = `${config.syllabusPrefix}-${DOMAIN_CODE[domain]}-${String(localIndex + 1).padStart(3, "0")}`;

      questions.push({
        id: config.startId + globalIndex,
        domain,
        topic: seed.topic,
        stem: buildStem(config.level, seed.term),
        choices,
        answerIndex,
        explanation: `${seed.term}は、${seed.definition}`,
        glossaryTerm: seed.term,
        glossaryDefinition: seed.definition,
        syllabusRef: seed.syllabusRef ?? fallbackRef,
        packId: config.packId,
      });

      globalIndex += 1;
    }
  }

  return {
    questions,
    perDomainCounts,
  };
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, args.config);

  let rawConfig;
  try {
    rawConfig = JSON.parse(await fs.readFile(configPath, "utf8"));
  } catch (error) {
    fail(`設定JSONを読み込めませんでした: ${configPath}\n${String(error)}`);
  }

  assertObject(rawConfig, "設定JSON");
  assertString(rawConfig.packId, "packId");
  assertString(rawConfig.output, "output");
  assertInteger(rawConfig.questionCount, "questionCount", 1);
  assertInteger(rawConfig.startId, "startId", 1);
  assertString(rawConfig.syllabusPrefix, "syllabusPrefix");
  assertString(rawConfig.level, "level");
  assertObject(rawConfig.domainRatio, "domainRatio");
  assertObject(rawConfig.seeds, "seeds");

  if (!LEVELS.has(rawConfig.level)) {
    fail(`level は 初級 / 中級 / 上級 のいずれかで指定してください。`);
  }

  for (const domain of DOMAINS) {
    const ratioValue = rawConfig.domainRatio[domain];
    assertInteger(ratioValue, `domainRatio.${domain}`, 0);
  }

  const outputPath = path.resolve(cwd, args.output ?? rawConfig.output);

  if (!args.force) {
    try {
      await fs.access(outputPath);
      fail(`出力先ファイルが既に存在します: ${outputPath}\n上書きする場合は --force を付けてください。`);
    } catch {
      // ファイルが存在しないため続行
    }
  }

  const config = {
    packId: rawConfig.packId.trim(),
    output: outputPath,
    questionCount: rawConfig.questionCount,
    startId: rawConfig.startId,
    syllabusPrefix: rawConfig.syllabusPrefix.trim(),
    level: rawConfig.level,
    domainRatio: rawConfig.domainRatio,
    seeds: rawConfig.seeds,
    exportName:
      typeof rawConfig.exportName === "string" && rawConfig.exportName.trim().length > 0
        ? rawConfig.exportName.trim()
        : toExportName(rawConfig.packId),
  };

  const { questions, perDomainCounts } = buildQuestions(config);

  if (questions.length !== config.questionCount) {
    fail(`問題件数が一致しません。期待 ${config.questionCount} 件、生成 ${questions.length} 件です。`);
  }

  const rows = questions.map((question) => formatQuestion(question)).join("\n");
  const content = `import { Question } from "@/types/question";

export const ${config.exportName}: Question[] = [
${rows}
];
`;

  if (!args.dryRun) {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, "utf8");
  }

  console.log(`[OK] ${args.dryRun ? "dry-run: " : ""}問題下書きを生成しました`);
  console.log(`  packId: ${config.packId}`);
  console.log(`  exportName: ${config.exportName}`);
  console.log(`  output: ${outputPath}`);
  console.log(`  total: ${questions.length}`);
  DOMAINS.forEach((domain) => {
    console.log(`  - ${domain}: ${perDomainCounts[domain]}件`);
  });
};

main().catch((error) => {
  fail(String(error));
});
