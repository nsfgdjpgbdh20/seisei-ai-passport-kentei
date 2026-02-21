import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Flashcard } from "@/types/flashcard";
import { sampleFlashcards } from "@/data/sample-flashcards";
import dayjs from "dayjs";
import {
  getTargetFlashcardPackIdsFromState,
  usePurchaseStore,
} from "@/stores/purchase-store";

interface FlashcardState {
  flashcards: Flashcard[];
  initialized: boolean;
  studiedToday: number[]; // 今日学習したカードID
  lastStudiedDate: string | null; // 最後に学習した日付

  // Computed
  dueCards: Flashcard[];
  totalMastered: () => number;
  getTodayStudiedCount: () => number;

  // Actions
  loadFlashcards: () => void;
  getScopedCards: (packIds?: string[]) => Flashcard[];
  getDueCardsByChapter: (chapter: string | null, packIds?: string[]) => Flashcard[];
  updateCardProgress: (id: number, quality: number) => void;
  resetFlashcards: () => void;
  addFlashcard: (term: string, definition: string, chapter: string) => void;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      flashcards: [],
      initialized: false,
      studiedToday: [],
      lastStudiedDate: null,

      get dueCards() {
        const flashcards = get().flashcards;
        const today = new Date();
        const due = flashcards.filter(card => {
          return !card.nextReview || new Date(card.nextReview) <= today;
        });
        // もしdueが0枚なら全カードを返す（初回学習やリセット直後対応）
        if (due.length === 0) return [...flashcards];
        return due;
      },

      totalMastered: () => {
        const flashcards = get().flashcards;
        return flashcards.filter(card => (card.repetitions ?? 0) >= 1).length;
      },

      getTodayStudiedCount: () => {
        const { studiedToday } = get();
        return studiedToday.length;
      },

      loadFlashcards: () => {
        const { initialized, flashcards } = get();

        // すでにデータがある場合でも、新しいカードが追加されているかチェックする
        if (flashcards.length > 0) {
          const existingIds = new Set(flashcards.map(c => c.id));
          const newCards = sampleFlashcards.filter(c => !existingIds.has(c.id)).map(card => ({
            ...card,
            nextReview: undefined,
            interval: undefined,
            repetitions: undefined,
            easeFactor: undefined
          }));

          if (newCards.length > 0) {

            set({
              flashcards: [...flashcards, ...newCards],
              initialized: true
            });
          } else if (!initialized) {
            set({ initialized: true });
          }
          return;
        }

        // データがない場合のみ、全サンプルデータをロードする
        const loadedCards = sampleFlashcards.map(card => ({
          ...card,
          nextReview: undefined,
          interval: undefined,
          repetitions: undefined,
          easeFactor: undefined
        }));
        set({
          flashcards: loadedCards,
          initialized: true
        });
      },

      getScopedCards: (packIds = []) => {
        const { flashcards } = get();
        if (packIds.length === 0) {
          const purchaseState = usePurchaseStore.getState();
          const targetPackIds = getTargetFlashcardPackIdsFromState(
            purchaseState.selectedFlashcardPackId,
            purchaseState.ownedFlashcardPackIds
          );
          return flashcards.filter(card => targetPackIds.includes(card.packId));
        }
        return flashcards.filter(card => packIds.includes(card.packId));
      },

      getDueCardsByChapter: (chapter, packIds = []) => {
        const { flashcards, initialized } = get();

        // 初期化されていない場合は初期化
        if (!initialized) {
          get().loadFlashcards();
        }

        const purchaseState = usePurchaseStore.getState();
        const targetPackIds =
          packIds.length > 0
            ? packIds
            : getTargetFlashcardPackIdsFromState(
                purchaseState.selectedFlashcardPackId,
                purchaseState.ownedFlashcardPackIds
              );
        const scopedCards = flashcards.filter(card => targetPackIds.includes(card.packId));
        const targetCards = scopedCards;

        const today = new Date();

        // フィルタリング
        const filteredCards = targetCards.filter(card => {
          // 学習予定かどうか
          const isDue = !card.nextReview || new Date(card.nextReview) <= today;
          // 章でフィルタリング
          const isChapterMatch = chapter === null || card.chapter === chapter;

          return isDue && isChapterMatch;
        });

        // 学習予定のカードがない場合は、全てのカードを返す（初回学習用）
        if (filteredCards.length === 0) {
          return targetCards.filter(card => chapter === null || card.chapter === chapter);
        }

        return filteredCards;
      },

      updateCardProgress: (id: number, quality: number) =>
        set((state) => {
          // 日付が変わったらstudiedTodayをリセット
          const today = new Date().toISOString().split("T")[0];
          let studiedToday = state.studiedToday;
          let lastStudiedDate = state.lastStudiedDate;
          if (lastStudiedDate !== today) {
            studiedToday = [];
            lastStudiedDate = today;
          }
          // まだ今日学習していないカードなら追加
          if (!studiedToday.includes(id)) {
            studiedToday = [...studiedToday, id];
          }
          const newFlashcards = state.flashcards.map((c) => {
            if (c.id !== id) return c;
            let repetitions = typeof c.repetitions === 'number' ? c.repetitions : 0;
            let interval = typeof c.interval === 'number' ? c.interval : 1;
            let easeFactor = typeof c.easeFactor === 'number' ? c.easeFactor : 2.5;
            if (quality === 5) {
              repetitions += 1;
              if (repetitions === 1) {
                interval = 1;
              } else if (repetitions === 2) {
                interval = 6;
              } else {
                interval = Math.round(interval * easeFactor);
              }
              easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * 0.08);
            } else {
              repetitions = 0;
              interval = 1;
              easeFactor = Math.max(1.3, easeFactor - 0.2);
            }
            return {
              ...c,
              repetitions,
              interval,
              easeFactor,
              nextReview: dayjs().add(interval, 'day').toISOString(),
            };
          });
          return { ...state, flashcards: newFlashcards, studiedToday, lastStudiedDate };
        }),

      resetFlashcards: () => {
        // Reset progress but keep the cards
        const { flashcards } = get();
        const resetCards = flashcards.map(card => ({
          ...card,
          interval: undefined,
          repetitions: undefined,
          easeFactor: undefined,
          nextReview: undefined,
        }));
        set({ flashcards: resetCards, studiedToday: [], lastStudiedDate: null });
      },

      addFlashcard: (term, definition, chapter) => {
        const { flashcards } = get();
        const maxId = flashcards.length > 0 ? Math.max(...flashcards.map(card => card.id)) : 0;
        const newCard = {
          id: maxId + 1,
          term,
          definition,
          chapter,
          packId: "flashcard_pack_basic_001",
        };
        set({ flashcards: [...flashcards, newCard] });
      },
    }),
    {
      name: "seisei-ai-passport-flashcards-v1",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
