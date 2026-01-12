import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { useFlashcardStore } from "@/stores/flashcard-store";
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommonHeader from "../../components/CommonHeader";
import { CHAPTERS } from "@/constants/chapters";

export default function CardsScreen() {
  const { colors } = useTheme();
  const {
    flashcards,
    dueCards,
    totalMastered,
    loadFlashcards,
    getDueCardsByChapter
  } = useFlashcardStore();
  const insets = useSafeAreaInsets();

  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadFlashcards();
    }, [])
  );

  const handleStartFlashcards = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // 「全分野」選択時は chapter="random" を渡す
    const studyChapterParam = selectedChapter === null ? "random" : selectedChapter;

    router.push({
      pathname: "/cards/study",
      params: { chapter: studyChapterParam }
    });
  };

  const chapters = CHAPTERS;

  // 総カード数
  const totalCount = flashcards.length;

  // 分野ごとの件数もflashcardsからのみ取得
  const dueCardsByChapter = chapters.map(chapter => {
    if (flashcards.length === 0) {
      return { chapter, dueCount: '-', totalCount: '-', masteredCount: '-' };
    }
    return {
      chapter,
      dueCount: getDueCardsByChapter(chapter).length,
      totalCount: flashcards.filter(card => card.chapter === chapter).length,
      masteredCount: flashcards.filter(card => card.chapter === chapter && (card.repetitions ?? 0) >= 1).length
    };
  });

  // 変更: ボタンに表示する枚数計算ロジックを study.tsx と統一
  const calculateNumberOfCardsForButton = () => {
    if (selectedChapter === null) {
      // 全分野の場合は10枚固定 (study.tsx のロジックと一致)
      return 10;
    } else {
      // 特定分野の場合
      const chapterCards = flashcards.filter(card => card.chapter === selectedChapter);
      const unmasteredCards = chapterCards.filter(card => (card.repetitions ?? 0) < 1);

      if (unmasteredCards.length > 0) {
        // 未習得カードがあれば、その枚数 (最大10枚)
        return Math.min(unmasteredCards.length, 10);
      } else {
        // 未習得がなければ、分野の全カード数 (最大10枚)
        return Math.min(chapterCards.length, 10);
      }
    }
  };
  const numberOfCardsForButton = calculateNumberOfCardsForButton();

  // ボタン表示条件を修正: 全分野の場合はdueカードではなく全カードの存在を確認
  const hasCardsToStudy = selectedChapter !== null
    ? getDueCardsByChapter(selectedChapter).length > 0 // 特定分野: dueカードがあるか？
    : flashcards.length > 0;                        // 全分野: カードが1枚でもあるか？

  // デバッグ用マスター数は維持
  const debugMastered = flashcards.filter(card => (card.repetitions ?? 0) >= 1).length;
  const masteredCount = flashcards.filter(card => (card.repetitions ?? 0) >= 1).length;
  const unmasteredCount = totalCount - masteredCount;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <CommonHeader title="" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 80 + insets.bottom }
        ]}
      >
        {/* --- カード統計（横並び1枚のカードに統合） --- */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, flexDirection: 'row', alignItems: 'stretch', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
            {/* 総カード数 */}
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
              <MaterialIcons name="layers" size={28} color={colors.primary} />
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.primary, marginTop: 8 }}>総カード数</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginTop: 2 }}>{totalCount}</Text>
            </View>
            {/* 区切り線 */}
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 16 }} />
            {/* 習得済み */}
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
              <MaterialIcons name="check-circle" size={28} color={colors.success} />
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.success, marginTop: 8 }}>習得済み</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginTop: 2 }}>{masteredCount}</Text>
            </View>
            {/* 区切り線 */}
            <View style={{ width: 1, backgroundColor: colors.border, marginVertical: 16 }} />
            {/* 未習得 */}
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
              <MaterialIcons name="cancel" size={28} color={colors.error} />
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.error, marginTop: 8 }}>未習得</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginTop: 2 }}>{unmasteredCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.chapterSelector}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>分野を選択</Text>
          <View style={styles.chapterList}>
            {/* 全分野選択ボタンを追加 */}
            <TouchableOpacity
              key="all-flashcards"
              style={[
                styles.chapterListItem,
                selectedChapter === null && { backgroundColor: colors.primary + '22' }
              ]}
              onPress={() => setSelectedChapter(null)}
            >
              <View style={styles.chapterRadioIcon}>
                <Text style={{ color: selectedChapter === null ? colors.primary : colors.textSecondary, fontSize: 18 }}>
                  {selectedChapter === null ? "●" : "○"}
                </Text>
              </View>
              <Text style={[styles.chapterListText, { color: colors.text }, selectedChapter === null && { color: colors.primary }]}>全分野</Text>
              <View style={styles.chapterListCount}>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{masteredCount}/{totalCount}</Text>
              </View>
            </TouchableOpacity>
            {/* 各分野 */}
            {dueCardsByChapter.map((item) => (
              <TouchableOpacity
                key={item.chapter}
                style={[
                  styles.chapterListItem,
                  selectedChapter === item.chapter && { backgroundColor: colors.primary + '22' }
                ]}
                onPress={() => setSelectedChapter(item.chapter)}
              >
                <View style={styles.chapterRadioIcon}>
                  <Text style={{ color: selectedChapter === item.chapter ? colors.primary : colors.textSecondary, fontSize: 18 }}>
                    {selectedChapter === item.chapter ? "●" : "○"}
                  </Text>
                </View>
                <Text style={[styles.chapterListText, { color: colors.text }, selectedChapter === item.chapter && { color: colors.primary }]}>{item.chapter}</Text>
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

        {!hasCardsToStudy && (
          <View style={[styles.emptyStateCard, { backgroundColor: colors.card }]}>
            <MaterialIcons name="info" size={24} color={colors.primary} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              学習予定のカードがありません
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              この分野のカードは全て学習済みです。他の分野を選択するか、明日また確認してください。
            </Text>
          </View>
        )}
      </ScrollView>

      {hasCardsToStudy && (
        <View style={[styles.fixedButtonContainer, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: colors.primary, marginBottom: 0 }]}
            onPress={handleStartFlashcards}
          >
            <MaterialIcons name="layers" size={20} color="#fff" />
            <Text style={styles.startButtonText}>
              {numberOfCardsForButton}枚のカードを学習する
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
// End of CardsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  chapterSelector: {
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
  chapterListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4 },
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
  emptyStateCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
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