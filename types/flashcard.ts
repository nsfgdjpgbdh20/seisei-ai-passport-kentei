export interface Flashcard {
  id: number;
  term: string;
  definition: string;
  chapter: string;
  packId: string;
  
  // SM-2 algorithm fields
  interval?: number;
  repetitions?: number;
  easeFactor?: number;
  nextReview?: string;
}

export interface FlashcardPack {
  id: string;
  productId: string | null;
  title: string;
  price: number;
  cardCount: number;
}
