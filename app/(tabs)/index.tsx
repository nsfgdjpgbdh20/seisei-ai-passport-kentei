import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as StoreReview from "expo-store-review";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "@/context/theme-context";
import { useProgressStore } from "@/stores/progress-store";
import { useQuestionStore } from "@/stores/question-store";
import { useNotificationStore } from "@/stores/notification-store";
import { useFlashcardStore } from "@/stores/flashcard-store";
import { checkForQuestionUpdates } from "@/utils/question-updater";
import { scheduleNotification, setupNotifications, cancelAllNotifications } from "@/utils/notifications";
import ProgressBar from "@/components/ProgressBar";
import CommonHeader from "@/components/CommonHeader";
import ReviewModal from "@/components/ReviewModal";

// レビュー表示日を保存するキー
const REVIEW_SHOWN_KEY = "review-shown-date";

// 今日の日付を取得（YYYY-MM-DD形式）
function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

// ハプティックフィードバックを実行（Web以外）
function triggerHaptic(): void {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export default function HomeScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const { testHistory, questionsEverCorrect } = useProgressStore();
  const { questions, loadQuestions } = useQuestionStore();
  const { notificationTime, notificationsEnabled } = useNotificationStore();
  const { flashcards, studiedToday } = useFlashcardStore();

  const [reviewVisible, setReviewVisible] = useState(false);

  // 今日の日付
  const today = getTodayDateString();

  // 今日学習したフラッシュカード数
  const todayStudiedCardCount = studiedToday.length;

  // 今日解いたクイズ数を計算
  const todayAnsweredQuizCount = testHistory
    .filter((test) => test.date === today)
    .reduce((sum, test) => sum + (test.answeredCount || 0), 0);

  // 習得済み率を計算
  const masteryRate = calculateMasteryRate(questionsEverCorrect, flashcards, questions.length);

  // レビューモーダル表示チェック
  useEffect(() => {
    async function checkAndShowReview(): Promise<void> {
      const shownDate = await AsyncStorage.getItem(REVIEW_SHOWN_KEY);
      const quizDone = todayAnsweredQuizCount >= 10;
      const cardDone = todayStudiedCardCount >= 10;

      if (quizDone && cardDone && shownDate !== today) {
        setTimeout(() => {
          setReviewVisible(true);
          AsyncStorage.setItem(REVIEW_SHOWN_KEY, today);
        }, 800);
      }
    }
    checkAndShowReview();
  }, [todayAnsweredQuizCount, todayStudiedCardCount, today]);

  // レビュー送信時の処理
  async function handleReviewSubmit(rating: number, comment: string): Promise<void> {
    if (rating >= 4) {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) {
        StoreReview.requestReview();
      } else {
        Alert.alert("レビュー投稿", "App Storeレビュー画面を開けませんでした。");
      }
    } else {
      // 低評価の場合はコメントをログに記録（将来的にはサーバーに送信可能）
      if (comment) {
        console.log("ユーザーフィードバック:", { rating, comment });
      }
      Alert.alert("ご意見ありがとうございました", "ご意見は今後の参考にさせていただきます。");
    }
  }

  // 初期化処理（問題ロード、通知設定、更新チェック）
  useEffect(() => {
    loadQuestions();
    setupNotifications();
    checkForQuestionUpdates().catch((error) => {
      console.log("問題更新チェックに失敗:", error);
    });
  }, [loadQuestions]);

  // 通知スケジュール管理
  useEffect(() => {
    if (Platform.OS === "web") return;

    if (notificationsEnabled) {
      scheduleNotification(notificationTime);
    } else {
      cancelAllNotifications();
    }
  }, [notificationsEnabled, notificationTime]);

  // 習得条件の説明を表示
  function showMasteryInfoAlert(): void {
    Alert.alert(
      "習得済みの条件",
      "1回以上正解した問題・カードが習得済みとみなされます。"
    );
  }

  // クイズ画面へ遷移
  function navigateToQuiz(): void {
    triggerHaptic();
    router.push("/(tabs)/quiz");
  }

  // フラッシュカード画面へ遷移
  function navigateToCards(): void {
    triggerHaptic();
    router.push("/(tabs)/cards");
  }

  // タスク完了判定
  const isCardTaskComplete = todayStudiedCardCount >= 10;
  const isQuizTaskComplete = todayAnsweredQuizCount >= 10;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CommonHeader title="" />
      <View style={styles.contentContainer}>
        {/* 習得済み率カード */}
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}>
          <View style={styles.masteryHeader}>
            <Text style={[styles.masteryTitle, { color: colors.text }]}>アプリ習得済み率</Text>
            <TouchableOpacity
              onPress={showMasteryInfoAlert}
              style={styles.infoButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="info-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ProgressBar progress={masteryRate} height={10} />
          <Text style={[styles.masteryPercentage, { color: colors.text }]}>{masteryRate}%</Text>
        </View>

        {/* 今日の学習タスク */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>今日の学習タスク</Text>
          <View style={styles.taskList}>
            <TaskCard
              title="フラッシュカードを10枚学習"
              current={todayStudiedCardCount}
              target={10}
              isComplete={isCardTaskComplete}
              colors={colors}
            />
            <TaskCard
              title="クイズを10問解く"
              current={todayAnsweredQuizCount}
              target={10}
              isComplete={isQuizTaskComplete}
              colors={colors}
            />
          </View>
        </View>

        {/* 学習メニュー */}
        <View style={[styles.section, styles.menuSection]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>学習メニュー</Text>
          <View style={styles.actionsGrid}>
            <ActionButton
              icon="menu-book"
              title="クイズ"
              subtitle="設問形式で学習"
              colors={colors}
              onPress={navigateToQuiz}
            />
            <ActionButton
              icon="layers"
              title="フラッシュカード"
              subtitle="重要用語の暗記"
              colors={colors}
              onPress={navigateToCards}
            />
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

// 習得済み率の計算
function calculateMasteryRate(
  questionsEverCorrect: Record<number, boolean>,
  flashcards: { repetitions?: number }[],
  totalQuestionsCount: number
): number {
  const masteredQuestions = questionsEverCorrect ? Object.keys(questionsEverCorrect).length : 0;
  const masteredCards = flashcards.filter((card) => (card.repetitions ?? 0) >= 1).length;
  const total = totalQuestionsCount + flashcards.length;

  if (total === 0) return 0;
  return Math.round(((masteredQuestions + masteredCards) / total) * 100);
}

// タスクカードコンポーネント
interface TaskCardProps {
  title: string;
  current: number;
  target: number;
  isComplete: boolean;
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    success: string;
  };
}

function TaskCard({ title, current, target, isComplete, colors }: TaskCardProps): React.JSX.Element {
  return (
    <View style={[styles.taskCard, { backgroundColor: colors.card, shadowColor: colors.text }]}>
      <View
        style={[
          styles.taskCheckCircle,
          isComplete && { backgroundColor: colors.success, borderColor: colors.success },
        ]}
      >
        {isComplete && <MaterialIcons name="check" size={14} color="#FFF" />}
      </View>
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskText,
            { color: colors.text },
            isComplete && { color: colors.textSecondary, textDecorationLine: "line-through" },
          ]}
        >
          {title}
        </Text>
        <Text style={[styles.taskProgress, { color: colors.textSecondary }]}>
          {current}/{target}
        </Text>
      </View>
    </View>
  );
}

// アクションボタンコンポーネント
interface ActionButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
  onPress: () => void;
}

function ActionButton({ icon, title, subtitle, colors, onPress }: ActionButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: colors.card, shadowColor: colors.text }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[colors.primary + "20", "transparent"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
        <MaterialIcons name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={[styles.actionText, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.actionSubtext, { color: colors.textSecondary }]}>{subtitle}</Text>
    </TouchableOpacity>
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
  masteryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  masteryTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoButton: {
    marginLeft: 6,
  },
  masteryPercentage: {
    textAlign: "right",
    marginTop: 4,
    fontWeight: "600",
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  menuSection: {
    flex: 1,
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
    flexDirection: "row",
    alignItems: "center",
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
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
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
    overflow: "hidden",
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
