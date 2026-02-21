import { QuestionPack } from "@/types/question";

export const sampleQuestionPacks: QuestionPack[] = [
  {
    id: "quiz_pack_basic_001",
    productId: null,
    title: "デフォルト",
    price: 0,
    questionCount: 100,
  },
  {
    id: "quiz_pack_plus_001",
    productId: "app.shunnakayama.seisei.quizpack100",
    title: "追加クイズ100問",
    price: 100,
    questionCount: 100,
  },
];
