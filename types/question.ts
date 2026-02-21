export interface Question {
  id: number;
  chapter: string;
  stem: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  packId: string;
}

export interface QuestionPack {
  id: string;
  productId: string | null;
  title: string;
  price: number;
  questionCount: number;
}
