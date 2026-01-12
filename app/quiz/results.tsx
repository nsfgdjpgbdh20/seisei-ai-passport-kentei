import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResultsScreen() {
  const {
    score,
    total,
    correct,
    answered,
    testType
  } = useLocalSearchParams<{
    score: string,
    total: string,
    correct: string,
    answered: string,
    testType: string
  }>();

  const { colors } = useTheme();

  const scoreNum = parseInt(score || "0", 10);
  const totalNum = parseInt(total || "0", 10);
  const correctNum = parseInt(correct || "0", 10);
  const answeredNum = parseInt(answered || "0", 10);

  useEffect(() => {
    if (Platform.OS !== "web") {
      if (scoreNum >= 70) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
  }, []);

  const getScoreColor = () => {
    if (scoreNum >= 80) return colors.success;
    if (scoreNum >= 70) return colors.primary;
    if (scoreNum >= 60) return colors.warning;
    return colors.error;
  };

  const getScoreMessage = () => {
    if (scoreNum >= 80) return "素晴らしい！";
    if (scoreNum >= 70) return "合格ライン！";
    if (scoreNum >= 60) return "もう少し！";
    return "頑張りましょう";
  };

  const handleRetry = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (testType === "full") {
      router.replace("/quiz/full-test");
    } else {
      router.replace("/quiz/mini-test");
    }
  };

  const handleGoHome = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.replace("/quiz");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            クイズ結果
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <LinearGradient
            colors={[colors.card, colors.background]}
            style={styles.scoreGradient}
          >
            <View style={styles.scoreCircle}>
              <MaterialIcons name="emoji-events" size={24} color={getScoreColor()} />
              <Text style={[styles.scoreText, { color: getScoreColor() }]}>
                {score}%
              </Text>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
                {getScoreMessage()}
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={styles.statItem}>
              <MaterialIcons name="check-circle" size={24} color={colors.success} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {correct}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                正解
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons name="cancel" size={24} color={colors.error} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {totalNum - correctNum}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                不正解
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons name="percent" size={24} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {answered}/{total}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                回答率
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.messageContainer}>
          {scoreNum >= 70 ? (
            <Text style={[styles.message, { color: colors.text }]}>
              おめでとうございます！合格ラインをクリアしました。
              引き続き学習を続けて、本番でも同様の結果を目指しましょう。
            </Text>
          ) : (
            <Text style={[styles.message, { color: colors.text }]}>
              生成AIパスポートの合格ラインは70%です。
              苦手な分野を重点的に学習して、次回のテストに備えましょう。
              フラッシュカードで重要用語を復習することもおすすめです。
            </Text>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleGoHome}
          >
            <MaterialIcons name="home" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>
              ホームに戻る
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginTop: 8,
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "NotoSansJP-Bold",
    marginBottom: 4,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  scoreGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 48,
    fontFamily: "NotoSansJP-Bold",
    marginTop: 8,
  },
  scoreLabel: {
    fontSize: 16,
    fontFamily: "NotoSansJP-Medium",
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    flexDirection: "row",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: "NotoSansJP-Bold",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "NotoSansJP-Regular",
  },
  messageContainer: {
    marginBottom: 32,
  },
  message: {
    fontSize: 16,
    fontFamily: "NotoSansJP-Regular",
    lineHeight: 24,
    textAlign: "center",
  },
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: "NotoSansJP-Bold",
    color: "#fff",
    marginLeft: 8,
  },
});