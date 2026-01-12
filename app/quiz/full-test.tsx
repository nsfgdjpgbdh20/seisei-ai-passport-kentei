import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { router, useNavigation } from "expo-router";
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
import QuizHeader from "../../components/QuizHeader";

const FULL_TEST_TIME = 120 * 60; // 120 minutes in seconds
const FULL_TEST_QUESTIONS = 160;

export default function FullTestScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { questions, getFullTestQuestions, saveTestProgress, loadTestProgress } = useQuestionStore();
  const { updateProgress } = useProgressStore();

  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(FULL_TEST_TIME);
  const [isActive, setIsActive] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [hasExistingTest, setHasExistingTest] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | number | null>(null);
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    // Check for existing test
    const checkExistingTest = async () => {
      const savedTest = await loadTestProgress();

      if (savedTest && savedTest.questions.length > 0) {
        setHasExistingTest(true);
        Alert.alert(
          "テスト再開",
          "前回中断したテストがあります。再開しますか？",
          [
            {
              text: "新規開始",
              onPress: () => initializeNewTest(),
              style: "destructive"
            },
            {
              text: "再開する",
              onPress: () => resumeTest(savedTest)
            }
          ]
        );
      } else {
        initializeNewTest();
      }
    };

    checkExistingTest();

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

  const initializeNewTest = () => {
    const fullTestQuestions = getFullTestQuestions(FULL_TEST_QUESTIONS);
    setTestQuestions(fullTestQuestions);
    setAnswers(new Array(fullTestQuestions.length).fill(null));
    setFlagged(new Array(fullTestQuestions.length).fill(false));
    startTimer();
  };

  const resumeTest = (savedTest: any) => {
    setTestQuestions(savedTest.questions);
    setAnswers(savedTest.answers);
    setFlagged(savedTest.flagged);
    setTimeRemaining(savedTest.timeRemaining);
    setCurrentIndex(savedTest.currentIndex);
    startTimer();
  };

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
        "テスト中断",
        "テストを中断しますか？進捗は保存されます。",
        [
          { text: "キャンセル", style: "cancel" },
          { text: "中断する", onPress: handleSaveAndExit }
        ]
      );
      return true;
    }
    return false;
  };

  const handleSaveAndExit = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    await saveTestProgress({
      questions: testQuestions,
      answers,
      flagged,
      timeRemaining,
      currentIndex
    });

    router.back();
  };

  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleToggleFlag = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newFlagged = [...flagged];
    newFlagged[currentIndex] = !newFlagged[currentIndex];
    setFlagged(newFlagged);
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

  const handleShowSummary = () => {
    setShowSummary(true);
  };

  const handleHideSummary = () => {
    setShowSummary(false);
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
      lastScore: score,
      testCompleted: true,
      answeredQuestions: testQuestions.map((q, i) => ({
        id: q.id,
        chapter: q.chapter,
        correct: answers[i] === q.answerIndex
      })),
      chapterScores,
      testType: 'full'
    });

    // Navigate to results
    router.push({
      pathname: "/quiz/results",
      params: {
        score: score.toString(),
        total: totalQuestions.toString(),
        correct: correctAnswers.toString(),
        answered: answeredQuestions.toString(),
        testType: "full"
      }
    });
  };

  const renderSummary = () => {
    const answeredCount = answers.filter(a => a !== null).length;
    const flaggedCount = flagged.filter(f => f).length;

    return (
      <SafeAreaView style={[styles.summaryContainer, { backgroundColor: colors.background }]}>
        <View style={styles.summaryHeader}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            問題一覧
          </Text>
          <TouchableOpacity onPress={handleHideSummary}>
            <Text style={[styles.closeButton, { color: colors.primary }]}>
              閉じる
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.summaryStats, { color: colors.textSecondary }]}>
          回答済み: {answeredCount}/{testQuestions.length} •
          フラグ付き: {flaggedCount}
        </Text>

        <ScrollView style={styles.questionGrid}>
          <View style={styles.gridContainer}>
            {testQuestions.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.questionButton,
                  currentIndex === index && { borderColor: colors.primary, borderWidth: 2 },
                  answers[index] !== null && { backgroundColor: colors.primaryLight },
                  flagged[index] && { borderColor: colors.warning, borderWidth: 2 }
                ]}
                onPress={() => {
                  setCurrentIndex(index);
                  handleHideSummary();
                }}
              >
                <Text
                  style={[
                    styles.questionNumber,
                    { color: answers[index] !== null ? colors.primary : colors.text }
                  ]}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.summaryActions}>
          <TouchableOpacity
            style={[styles.finishButton, { backgroundColor: colors.primary }]}
            onPress={handleFinishTest}
            activeOpacity={0.7}
          >
            <Text style={styles.finishButtonText}>テスト終了</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  if (testQuestions.length === 0) {
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
  const isTimeWarning = timeRemaining < 300; // Less than 5 minutes

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
      {showSummary ? (
        renderSummary()
      ) : (
        <>
          <QuizHeader
            onExit={handleBackPress}
            timeRemaining={timeRemaining}
            isTimeWarning={isTimeWarning}
            answeredCount={answeredCount}
            totalCount={testQuestions.length}
            colors={colors}
            insets={insets}
            formatTime={formatTime}
          />

          <View style={styles.progressContainer}>
            <ProgressBar
              progress={(currentIndex / (testQuestions.length - 1)) * 100}
              height={4}
            />
          </View>

          <View style={styles.questionContainer}>
            <Text style={[styles.questionNumber, { color: colors.textSecondary }]}>
              問題 {currentIndex + 1} / {testQuestions.length}
            </Text>

            <QuestionView
              question={currentQuestion}
              onSelectAnswer={(index, isCorrect) => handleSelectAnswer(currentIndex, index)}
              feedbackStatus={null}
            />
          </View>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
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
              <Text style={[styles.navButtonText, { color: colors.text }]}>
                前へ
              </Text>
            </TouchableOpacity>

            {isLastQuestion ? (
              <TouchableOpacity
                style={[styles.finishButton, { backgroundColor: colors.primary }]}
                onPress={handleShowSummary}
                activeOpacity={0.7}
              >
                <Text style={styles.finishButtonText}>
                  確認する
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navButton, { backgroundColor: colors.primary }]}
                onPress={handleNextQuestion}
              >
                <Text style={[styles.navButtonText, { color: "#fff" }]}>
                  次へ
                </Text>
                <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
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
    backgroundColor: undefined,
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
  summaryContainer: {
    flex: 1,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 10,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 16,
    fontWeight: "500",
  },
  summaryStats: {
    fontSize: 14,
    marginBottom: 16,
  },
  questionGrid: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  questionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  summaryActions: {
    marginTop: 16,
    alignItems: "center",
    paddingBottom: 20,
  },
});