import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { useProgressStore } from "@/stores/progress-store";
import { useQuestionStore } from "@/stores/question-store";
import { useNotificationStore } from "@/stores/notification-store";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from "expo-haptics";
import ProgressBar from "@/components/ProgressBar";
import MonthlyLearningProgress from "@/components/MonthlyLearningProgress";
import ScoreRadarChart from "@/components/ScoreRadarChart";
import { checkForQuestionUpdates } from "@/utils/question-updater";
import { scheduleNotification, setupNotifications } from "@/utils/notifications";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommonHeader from "../../components/CommonHeader";
import { useFlashcardStore } from "@/stores/flashcard-store";
import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";
import ReviewModal from "../../components/ReviewModal";
import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REVIEW_SHOWN_KEY = 'review-shown-date';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { progress, lastScore, monthlyLearningDays, getAverageScore, testHistory, questionsEverCorrect } = useProgressStore();
  const { questions, loadQuestions } = useQuestionStore();
  const { notificationTime } = useNotificationStore();
  const { flashcards, studiedToday } = useFlashcardStore();
  const getTodayStudiedCount = () => studiedToday.length;
  const insets = useSafeAreaInsets();

  // 今日解いたクイズ数を計算
  const today = new Date().toISOString().split("T")[0];
  const todayAnsweredCount = testHistory
    .filter(test => test.date === today)
    .reduce((sum, test) => sum + (test.answeredCount || 0), 0);

  const averageScore = getAverageScore();

  // 変更: masteryRate の計算をコンポーネント内に移動
  const calculateMasteryRate = () => {
    // クイズ問題の習得数（1回でも正解）
    const masteredQuestions = questionsEverCorrect ? Object.keys(questionsEverCorrect).length : 0;

    // フラッシュカードの習得数（repetitions >= 1）
    const masteredCards = flashcards.filter(card => (card.repetitions ?? 0) >= 1).length;

    const totalQuestionsCount = questions.length;
    const totalFlashcardsCount = flashcards.length;
    const total = totalQuestionsCount + totalFlashcardsCount;

    if (total === 0) return 0;

    return Math.round(((masteredQuestions + masteredCards) / total) * 100);
  };
  const masteryRate = calculateMasteryRate();

  const [reviewVisible, setReviewVisible] = useState(false);
  const reviewShownRef = useRef(false);

  useEffect(() => {
    const checkAndShowReview = async () => {
      const shownDate = await AsyncStorage.getItem(REVIEW_SHOWN_KEY);
      const quizDone = todayAnsweredCount >= 10;
      const cardDone = getTodayStudiedCount() >= 10;

      if (quizDone && cardDone && shownDate !== today) {
        setTimeout(() => {
          setReviewVisible(true);
          AsyncStorage.setItem(REVIEW_SHOWN_KEY, today);
        }, 800);
      }
    };
    checkAndShowReview();
  }, [todayAnsweredCount, studiedToday]);

  // レビュー送信時の処理
  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (rating >= 4) {
      if (await StoreReview.isAvailableAsync()) {
        StoreReview.requestReview();
      } else {
        Alert.alert('レビュー投稿', 'App Storeレビュー画面を開けませんでした。');
      }
    } else {
      Alert.alert('ご意見ありがとうございました', 'ご意見は今後の参考にさせていただきます。');
    }
  };

  useEffect(() => {
    // Load questions on first launch
    loadQuestions();

    // Setup notifications
    setupNotifications();

    // Check for updates
    checkForQuestionUpdates().catch(error => {
      console.log("Failed to check for updates:", error);
    });

    // Schedule notification
    if (Platform.OS !== "web") {
      scheduleNotification(notificationTime);
    }
  }, []);

  const handlePressAction = (action: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    switch (action) {
      case "miniTest":
        router.push("/quiz/mini-test");
        break;
      case "flashcards":
        router.push("/cards/study");
        break;
      default:
        break;
    }
  };

  const getRecommendedAction = () => {
    if (progress < 30) {
      return "miniTest";
    } else {
      return "flashcards";
    }
  };

  const recommendedAction = getRecommendedAction();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CommonHeader title="" />
      <View style={styles.contentContainer}>
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>アプリ習得済み率</Text>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "習得済みの条件",
                  "1回以上正解した問題・カードが習得済みとみなされます。"
                );
              }}
              style={{ marginLeft: 6 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="info-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ProgressBar progress={masteryRate} height={10} />
          <Text style={{ textAlign: "right", marginTop: 4, color: colors.text, fontWeight: "600", fontSize: 12 }}>{masteryRate}%</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>今日の学習タスク</Text>
          <View style={styles.taskList}>
            {/* フラッシュカードタスク */}
            <View style={[styles.taskCard, { backgroundColor: colors.card, shadowColor: colors.text }]}>
              <View style={[styles.taskCheckCircle, getTodayStudiedCount() >= 10 && { backgroundColor: colors.success, borderColor: colors.success }]}>
                {getTodayStudiedCount() >= 10 && (
                  <MaterialIcons name="check" size={14} color="#FFF" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.taskText, { color: colors.text }, getTodayStudiedCount() >= 10 && { color: colors.textSecondary, textDecorationLine: 'line-through' }]}>
                  フラッシュカードを10枚学習
                </Text>
                <Text style={[styles.taskProgress, { color: colors.textSecondary }]}>
                  {getTodayStudiedCount()}/10
                </Text>
              </View>
            </View>
            {/* クイズタスク */}
            <View style={[styles.taskCard, { backgroundColor: colors.card, shadowColor: colors.text }]}>
              <View style={[styles.taskCheckCircle, todayAnsweredCount >= 10 && { backgroundColor: colors.success, borderColor: colors.success }]}>
                {todayAnsweredCount >= 10 && (
                  <MaterialIcons name="check" size={14} color="#FFF" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.taskText, { color: colors.text }, todayAnsweredCount >= 10 && { color: colors.textSecondary, textDecorationLine: 'line-through' }]}>
                  クイズを10問解く
                </Text>
                <Text style={[styles.taskProgress, { color: colors.textSecondary }]}>
                  {todayAnsweredCount}/10
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, { flex: 1 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>学習メニュー</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.card, shadowColor: colors.text }]}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push('/(tabs)/quiz');
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[colors.primary + '20', 'transparent']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <MaterialIcons name="menu-book" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>クイズ</Text>
              <Text style={[styles.actionSubtext, { color: colors.textSecondary }]}>設問形式で学習</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.card, shadowColor: colors.text }]}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push('/(tabs)/cards');
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[colors.primary + '20', 'transparent']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <MaterialIcons name="layers" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>フラッシュカード</Text>
              <Text style={[styles.actionSubtext, { color: colors.textSecondary }]}>重要用語の暗記</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ReviewModal
        visible={reviewVisible}
        onClose={() => setReviewVisible(false)}
        onSubmit={handleReviewSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 4,
  },
  taskList: {
    gap: 10,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  taskCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  taskProgress: {
    fontSize: 11,
  },
  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    flex: 1,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 11,
  },
});