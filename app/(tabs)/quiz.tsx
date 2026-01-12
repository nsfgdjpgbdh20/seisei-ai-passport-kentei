import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { useQuestionStore } from "@/stores/question-store";
import { useProgressStore } from "@/stores/progress-store";
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommonHeader from "../../components/CommonHeader";
import { CHAPTERS } from "@/constants/chapters";
import { useUIStateStore } from "@/stores/ui-state-store";

export default function QuizScreen() {
  const { colors } = useTheme();
  const { questions } = useQuestionStore();
  const { chapterProgress, lastScore, questionMastery, questionsEverCorrect } = useProgressStore();
  const { selectedQuizChapter, setSelectedQuizChapter } = useUIStateStore();
  const insets = useSafeAreaInsets();

  const totalCount = questions.length;
  const masteredCount = Object.keys(questionsEverCorrect).filter(id =>
    questions.some(q => q.id === parseInt(id, 10))
  ).length;
  const unmasteredCount = totalCount - masteredCount;

  const handleStartFullTest = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push("/quiz/full-test");
  };

  const handleStartMiniTest = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({
      pathname: "/quiz/mini-test",
      params: { chapter: selectedQuizChapter || "random" }
    });
  };

  const chapters = CHAPTERS;

  const questionCountByChapter = chapters.map(chapter => {
    if (questions.length === 0) {
      return { chapter, totalCount: '-', masteredCount: '-' };
    }
    const chapterQuestions = questions.filter(q => q.chapter === chapter);
    const totalChapterCount = chapterQuestions.length;
    let masteredChapterCount = 0;
    chapterQuestions.forEach(q => {
      if (questionsEverCorrect[q.id]) {
        masteredChapterCount++;
      }
    });
    return {
      chapter,
      totalCount: totalChapterCount,
      masteredCount: masteredChapterCount
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <CommonHeader title="" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 80 + insets.bottom }
        ]}
      >
        <View style={{ marginBottom: 24 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, flexDirection: 'row', alignItems: 'stretch', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
              <MaterialIcons name="layers" size={28} color={colors.primary} />
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.primary, marginTop: 8 }}>総クイズ数</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginTop: 2 }}>{totalCount}</Text>
            </View>
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 16 }} />
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
              <MaterialIcons name="check-circle" size={28} color={colors.success} />
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.success, marginTop: 8 }}>習得済み</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginTop: 2 }}>{masteredCount}</Text>
            </View>
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 16 }} />
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
              <MaterialIcons name="cancel" size={28} color={colors.error} />
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.error, marginTop: 8 }}>未習得</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginTop: 2 }}>{unmasteredCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.chapterSelectorContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>分野を選択</Text>
          <View style={styles.chapterList}>
            <TouchableOpacity
              key="all-chapters"
              style={[
                styles.chapterListItem,
                selectedQuizChapter === null && { backgroundColor: colors.primary + '22' }
              ]}
              onPress={() => setSelectedQuizChapter(null)}
            >
              <View style={styles.chapterRadioIcon}>
                <Text style={{ color: selectedQuizChapter === null ? colors.primary : colors.textSecondary, fontSize: 18 }}>
                  {selectedQuizChapter === null ? "●" : "○"}
                </Text>
              </View>
              <Text style={[styles.chapterListText, { color: colors.text }, selectedQuizChapter === null && { color: colors.primary }]}>全分野</Text>
              <View style={styles.chapterListCount}>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{masteredCount}/{totalCount}</Text>
              </View>
            </TouchableOpacity>

            {questionCountByChapter.map((item) => (
              <TouchableOpacity
                key={item.chapter}
                style={[
                  styles.chapterListItem,
                  selectedQuizChapter === item.chapter && { backgroundColor: colors.primary + '22' }
                ]}
                onPress={() => setSelectedQuizChapter(item.chapter)}
              >
                <View style={styles.chapterRadioIcon}>
                  <Text style={{ color: selectedQuizChapter === item.chapter ? colors.primary : colors.textSecondary, fontSize: 18 }}>
                    {selectedQuizChapter === item.chapter ? "●" : "○"}
                  </Text>
                </View>
                <Text style={[styles.chapterListText, { color: colors.text }, selectedQuizChapter === item.chapter && { color: colors.primary }]}>{item.chapter}</Text>
                <View style={styles.chapterListCount}>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    {typeof item.masteredCount === 'number' && typeof item.totalCount === 'number'
                      ? `${item.masteredCount}/${item.totalCount}`
                      : `-/-`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>

      <View style={[styles.fixedButtonContainer, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.primary, marginBottom: 0 }]}
          onPress={handleStartMiniTest}
        >
          <MaterialIcons name="layers" size={20} color="#fff" />
          <Text style={styles.startButtonText}>
            {(() => {
              if (selectedQuizChapter === null) {
                return '10問のクイズを学習する'; // 全分野は10問
              } else {
                // 特定分野の場合
                const chapterQuestions = questions.filter(q => q.chapter === selectedQuizChapter);
                const unmasteredQuestions = chapterQuestions.filter(q => !questionsEverCorrect[q.id]);
                let numToShow: number;
                if (unmasteredQuestions.length > 0) {
                  // 未習得があれば、その数 (最大10)
                  numToShow = Math.min(unmasteredQuestions.length, 10);
                } else {
                  // 未習得がなければ、分野の総数 (最大10)
                  numToShow = Math.min(chapterQuestions.length, 10);
                }
                return `${numToShow}問のクイズを学習する`;
              }
            })()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
// End of QuizScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  chapterSelectorContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  chapterList: {
    paddingRight: 16,
  },
  chapterListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  chapterRadioIcon: { width: 28, alignItems: 'center' },
  chapterListText: { flex: 1, fontSize: 15 },
  chapterListCount: { minWidth: 56, alignItems: 'flex-end' },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  card: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});