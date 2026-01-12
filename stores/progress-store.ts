import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AnsweredQuestion {
  id: number;
  chapter: string;
  correct: boolean;
}

interface TestResult {
  date: string;
  score: number;
  type: 'full' | 'mini';
  chapterScores: Record<string, number>;
  answeredCount: number;
}

interface ProgressState {
  progress: number;
  lastScore: number | null;
  chapterProgress: Record<string, number>;
  monthlyLearningDays: number; // 変更: studyStreak → monthlyLearningDays
  lastStudyDate: string | null;
  currentMonth: string | null; // 追加: 現在の月を記録
  testHistory: TestResult[]; // 追加: テスト結果の履歴
  questionMastery: Record<number, boolean[]>; // 問題ごとの直近2回の正誤履歴
  questionsEverCorrect: Record<number, boolean>; // 1回でも正解したか

  // Actions
  updateProgress: (data: {
    lastScore?: number;
    testCompleted?: boolean;
    miniTestCompleted?: boolean;
    answeredQuestions?: AnsweredQuestion[];
    chapterScores?: Record<string, number>;
    testType?: 'full' | 'mini';
  }) => void;
  resetProgress: () => void;
  getAverageScore: () => number | null;
  getChapterAverageScores: () => Record<string, number>;
  getTodayAnsweredCount: () => number;
  getMasteryRate: (flashcards: { id: number, repetitions?: number }[], totalQuestions: number) => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: 0,
      lastScore: null,
      chapterProgress: {},
      monthlyLearningDays: 0,
      lastStudyDate: null,
      currentMonth: new Date().toISOString().slice(0, 7), // YYYY-MM 形式
      testHistory: [],
      questionMastery: {},
      questionsEverCorrect: {}, // 初期化

      updateProgress: ({ lastScore, testCompleted, miniTestCompleted, answeredQuestions, chapterScores, testType }) => {
        const state = get();
        const updates: Partial<ProgressState> = {};
        const today = new Date().toISOString().split("T")[0];
        const currentMonth = today.slice(0, 7);

        if (state.currentMonth !== currentMonth) {
          updates.monthlyLearningDays = 0;
          updates.currentMonth = currentMonth;
        }

        if (lastScore !== undefined) {
          updates.lastScore = lastScore;
        }

        if ((testCompleted || miniTestCompleted) && answeredQuestions && answeredQuestions.length > 0) {
          const newTest = {
            date: today,
            type: testType || (miniTestCompleted ? 'mini' : 'full'),
            score: lastScore ?? 0,
            answeredCount: answeredQuestions.length,
            chapterScores: chapterScores ?? {},
          };
          updates.testHistory = [...state.testHistory, newTest];

          // --- 分野別進捗(chapterProgress)の計算 ---
          const newChapterProgress = { ...state.chapterProgress };
          const chapterQuestions: Record<string, AnsweredQuestion[]> = {};
          answeredQuestions.forEach(q => {
            if (!chapterQuestions[q.chapter]) chapterQuestions[q.chapter] = [];
            chapterQuestions[q.chapter].push(q);
          });
          Object.entries(chapterQuestions).forEach(([chapter, questions]) => {
            const correctCount = questions.filter(q => q.correct).length;
            const totalCount = questions.length;
            const chapterScore = Math.round((correctCount / totalCount) * 100);
            newChapterProgress[chapter] = chapterScore;
          });
          updates.chapterProgress = newChapterProgress;

          // --- 全体進捗(progress)の計算 ---
          const chapters = Object.keys(newChapterProgress);
          if (chapters.length > 0) {
            const totalProgress = chapters.reduce((sum, chapter) => sum + newChapterProgress[chapter], 0);
            updates.progress = Math.round(totalProgress / chapters.length);
          }

          // --- 月間学習日数・最終学習日 ---
          if (state.lastStudyDate !== today) {
            updates.monthlyLearningDays = state.monthlyLearningDays + 1;
            updates.lastStudyDate = today;
          }
        }

        if (answeredQuestions && answeredQuestions.length > 0) {
          const newMastery = { ...state.questionMastery };
          answeredQuestions.forEach(q => {
            if (!newMastery[q.id]) newMastery[q.id] = [];
            newMastery[q.id].push(q.correct);
            if (newMastery[q.id].length > 2) newMastery[q.id] = newMastery[q.id].slice(-2);
          });
          updates.questionMastery = newMastery;

          // 1回でも正解したか記録
          const newEverCorrect = { ...state.questionsEverCorrect };
          answeredQuestions.forEach(q => {
            if (q.correct && !newEverCorrect[q.id]) {
              newEverCorrect[q.id] = true;
            }
          });
          updates.questionsEverCorrect = newEverCorrect;
        }

        set(updates);
      },

      resetProgress: () => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        set({
          progress: 0,
          lastScore: null,
          chapterProgress: {},
          monthlyLearningDays: 0,
          lastStudyDate: null,
          currentMonth,
          testHistory: [],
          questionMastery: {},
          questionsEverCorrect: {}, // リセット時も空にする
        });
      },

      // 直近3回のテスト平均スコアを計算
      getAverageScore: () => {
        const { testHistory } = get();
        if (testHistory.length === 0) return null;

        // 直近3回のフルテストのみを対象
        const fullTests = testHistory
          .filter(test => test.type === 'full')
          .slice(-3);

        if (fullTests.length === 0) return null;

        const sum = fullTests.reduce((acc, test) => acc + test.score, 0);
        return Math.round(sum / fullTests.length);
      },

      // 章ごとの直近3回の平均スコアを計算
      getChapterAverageScores: () => {
        const { testHistory } = get();
        const chapterScores: Record<string, number[]> = {};
        const result: Record<string, number> = {};

        // 直近のテスト結果から章ごとのスコアを収集
        testHistory.slice(-3).forEach(test => {
          Object.entries(test.chapterScores).forEach(([chapter, score]) => {
            if (!chapterScores[chapter]) {
              chapterScores[chapter] = [];
            }
            chapterScores[chapter].push(score);
          });
        });

        // 各章の平均スコアを計算
        Object.entries(chapterScores).forEach(([chapter, scores]) => {
          if (scores.length > 0) {
            const sum = scores.reduce((acc, score) => acc + score, 0);
            result[chapter] = Math.round(sum / scores.length);
          }
        });

        return result;
      },

      // 今日解いたクイズ数を返すgetter
      getTodayAnsweredCount: () => {
        const { testHistory } = get();
        const today = new Date().toISOString().split("T")[0];
        return testHistory
          .filter(test => test.date === today)
          .reduce((sum, test) => sum + (test.answeredCount || 0), 0);
      },

      // 「習得済み率」を返すgetter（ロジック変更）
      getMasteryRate: (flashcards, totalQuestions) => {
        const { questionsEverCorrect } = get();
        // クイズ問題の習得数（1回でも正解）
        const masteredQuestions = Object.keys(questionsEverCorrect).length;

        // フラッシュカードの習得数（repetitions >= 1）
        const masteredCards = flashcards.filter(card => (card.repetitions ?? 0) >= 1).length;

        const total = totalQuestions + flashcards.length;
        if (total === 0) return 0;
        // 計算ロジックは変わらず、カウントする対象が変わる
        return Math.round(((masteredQuestions + masteredCards) / total) * 100);
      }
    }),
    {
      name: "seisei-ai-passport-progress-v1",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);