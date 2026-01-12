import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  Platform,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { useQuestionStore } from "@/stores/question-store";
import { useProgressStore } from "@/stores/progress-store";
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { Question } from "@/types/question";
import QuestionView from "@/components/QuestionView";
import ProgressBar from "@/components/ProgressBar";
import { formatTime } from "@/utils/format-time";
import CommonHeader from "../../components/CommonHeader";
// import { shuffleArray } from "@/utils/shuffle"; // utilsに存在しない可能性を考慮しコメントアウト

const MINI_TEST_TIME = 5 * 60; // 5 minutes in seconds
const MINI_TEST_QUESTIONS = 10;

export default function MiniTestScreen() {
  const { chapter } = useLocalSearchParams<{ chapter: string }>();
  const { colors } = useTheme();
  const { questions: allQuestions } = useQuestionStore();
  const { questionsEverCorrect, updateProgress } = useProgressStore();
  const insets = useSafeAreaInsets();

  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [feedbackStatus, setFeedbackStatus] = useState<Record<number, 'correct' | 'incorrect' | null>>({});
  const [timeRemaining, setTimeRemaining] = useState(MINI_TEST_TIME);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const timerRef = useRef<number | null>(null);

  // 簡易的なシャッフル関数 (utilsのが見つからない場合のため)
  const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // 修正: chapterパラメータに基づいて問題を絞り込む
    const targetChapter = chapter === 'random' || !chapter ? null : chapter;
    const chapterFilteredQuestions = targetChapter
      ? allQuestions.filter(q => q.chapter === targetChapter)
      : allQuestions;

    if (chapterFilteredQuestions.length > 0 && questionsEverCorrect) {
      // 絞り込んだリスト(chapterFilteredQuestions)に対してロジックを適用
      const unansweredQuestions = chapterFilteredQuestions.filter(q => !questionsEverCorrect[q.id]);
      let selectedQuestions: Question[] = [];
      const numQuestionsToSelect = MINI_TEST_QUESTIONS;

      if (unansweredQuestions.length > 0) {
        const shuffledUnanswered = shuffle(unansweredQuestions);
        selectedQuestions = shuffledUnanswered.slice(0, numQuestionsToSelect);
      } else {
        const shuffledFiltered = shuffle([...chapterFilteredQuestions]); // コピーをシャッフル
        selectedQuestions = shuffledFiltered.slice(0, numQuestionsToSelect);
      }

      // フォールバックも絞り込んだリストから
      if (selectedQuestions.length === 0 && chapterFilteredQuestions.length > 0) {
        selectedQuestions = shuffle(chapterFilteredQuestions).slice(0, numQuestionsToSelect);
      }

      if (selectedQuestions.length === 0) {
        // メッセージを少し具体的に
        const alertMessage = targetChapter
          ? `分野「${targetChapter}」には出題できる問題がありません。`
          : "出題できる問題がありません。";
        Alert.alert("エラー", alertMessage, [{ text: "OK", onPress: () => router.back() }]);
        return;
      }

      setTestQuestions(selectedQuestions);
      setAnswers(new Array(selectedQuestions.length).fill(null));
      setIsLoading(false);
    }
  }, [allQuestions, questionsEverCorrect, chapter]);

  useEffect(() => {
    // Start timer
    startTimer();

    // Handle back button on Android
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      backHandler.remove();
    };
  }, []);

  const startTimer = () => {
    setIsActive(true);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    Alert.alert(
      "時間終了",
      "制限時間が終了しました。結果を確認しましょう。",
      [{ text: "結果を見る", onPress: handleFinishTest }]
    );
  };

  const handleBackPress = () => {
    if (isActive) {
      Alert.alert(
        "クイズ中断",
        "クイズを中断しますか？ここまでの進捗は保存されます。",
        [
          { text: "キャンセル", style: "cancel" },
          {
            text: "中断する",
            onPress: () => {
              saveCurrentProgressAndExit();
            },
            style: "destructive"
          }
        ]
      );
      return true;
    }
    return false;
  };

  const saveCurrentProgressAndExit = () => {
    const answeredResults = testQuestions.reduce((acc, question, index) => {
      if (answers[index] !== null) {
        acc.push({
          id: question.id,
          chapter: question.chapter,
          correct: answers[index] === question.answerIndex
        });
      }
      return acc;
    }, [] as { id: number; chapter: string; correct: boolean }[]);

    if (answeredResults.length > 0) {
      updateProgress({
        answeredQuestions: testQuestions
          .map((q, i) => answers[i] !== null ? {
            id: q.id,
            chapter: q.chapter,
            correct: answers[i] === q.answerIndex
          } : null)
          .filter(Boolean) as { id: number; chapter: string; correct: boolean }[],
        miniTestCompleted: true,
        testType: "mini"
      });
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 前の画面に戻る
    router.back();
  };

  const handleSelectAnswer = (questionIndex: number, answerIndex: number, isCorrect: boolean) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);

    const newStatus = isCorrect ? 'correct' : 'incorrect';
    setFeedbackStatus(prev => ({ ...prev, [questionIndex]: newStatus }));
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinishTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsActive(false);

    // Calculate results
    const totalQuestions = testQuestions.length;
    const answeredQuestions = answers.filter(a => a !== null).length;
    const correctAnswers = answers.filter((answer, index) =>
      answer === testQuestions[index].answerIndex
    ).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // 章ごとの正解率を計算
    const chapterScores: Record<string, number> = {};
    const chapterQuestions: Record<string, { total: number, correct: number }> = {};

    testQuestions.forEach((q, i) => {
      if (!chapterQuestions[q.chapter]) {
        chapterQuestions[q.chapter] = { total: 0, correct: 0 };
      }

      chapterQuestions[q.chapter].total += 1;
      if (answers[i] === q.answerIndex) {
        chapterQuestions[q.chapter].correct += 1;
      }
    });

    // 章ごとのスコアを計算
    Object.entries(chapterQuestions).forEach(([chapter, data]) => {
      chapterScores[chapter] = Math.round((data.correct / data.total) * 100);
    });

    // Update progress
    updateProgress({
      answeredQuestions: testQuestions.map((q, i) => ({
        id: q.id,
        chapter: q.chapter,
        correct: answers[i] === q.answerIndex
      })),
      miniTestCompleted: true,
      testType: "mini"
    });

    const params = new URLSearchParams({
      score: score.toString(),
      total: totalQuestions.toString(),
      correct: correctAnswers.toString(),
      answered: answeredQuestions.toString(),
      testType: "mini"
    }).toString();
    router.replace(`/quiz/results?${params}`);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          問題を読み込み中...
        </Text>
      </View>
    );
  }

  const currentQuestion = testQuestions[currentIndex];
  const isLastQuestion = currentIndex === testQuestions.length - 1;
  const answeredCount = answers.filter(a => a !== null).length;
  const isTimeWarning = timeRemaining < 60; // Less than 1 minute

  // QuestionViewに渡すfeedbackStatusを決定し、ログ出力
  const currentFeedbackStatus = feedbackStatus[currentIndex] ?? null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom
        }
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleBackPress}
        >
          <MaterialIcons name="close" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            問題 {currentIndex + 1} / {testQuestions.length}
          </Text>
          <ProgressBar
            progress={(currentIndex + 1) / testQuestions.length}
            color={colors.primary}
            height={6}
          />
        </View>
        <View style={styles.timerContainer}>
          <MaterialIcons name="access-time" size={20} color={colors.textSecondary} />
          <Text style={[styles.timerText, { color: colors.textSecondary }]}>
            {formatTime(timeRemaining)}
          </Text>
        </View>
      </View>



      <View style={styles.questionContainer}>
        <Text style={[styles.questionNumber, { color: colors.textSecondary }]}>
          問題 {currentIndex + 1} / {testQuestions.length}
        </Text>

        <QuestionView
          question={currentQuestion}
          onSelectAnswer={(index, isCorrect) => handleSelectAnswer(currentIndex, index, isCorrect)}
          feedbackStatus={currentFeedbackStatus}
        />
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 32) }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: colors.border },
            currentIndex === 0 && styles.disabledButton
          ]}
          onPress={handlePrevQuestion}
          disabled={currentIndex === 0}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          <Text style={[styles.navButtonText, { color: colors.text }]}>前へ</Text>
        </TouchableOpacity>

        {isLastQuestion ? (
          <TouchableOpacity
            style={[styles.finishButton, { backgroundColor: colors.primary }]}
            onPress={handleFinishTest}
          >
            <Text style={styles.finishButtonText}>終了する</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.primary }]}
            onPress={handleNextQuestion}
          >
            <Text style={[styles.navButtonText, { color: "#fff" }]}>次へ</Text>
            <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
  },
  progressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  finishButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});