import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { useFlashcardStore } from "@/stores/flashcard-store";
import { usePurchaseStore } from "@/stores/purchase-store";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Flashcard } from "@/types/flashcard";
import { MaterialIcons } from '@expo/vector-icons';

export default function StudyScreen() {
  const { chapter } = useLocalSearchParams<{ chapter: string }>();
  const { colors } = useTheme();
  const { getDueCardsByChapter, updateCardProgress, loadFlashcards, flashcards } = useFlashcardStore();
  const { getTargetFlashcardPackIds } = usePurchaseStore();

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadFlashcards();
    setTimeout(() => {
      try {
        const targetPackIds = getTargetFlashcardPackIds();
        const latestFlashcards = useFlashcardStore.getState().flashcards;
        const scopedCards = latestFlashcards.filter((card) =>
          targetPackIds.includes(card.packId)
        );
        const availableCards = scopedCards;

        let dueCards: Flashcard[] = [];
        if (chapter === "random") {
          // 全分野からランダム10枚
          let allDue = getDueCardsByChapter(null, targetPackIds);
          if (allDue.length === 0) {
            // 学習予定カードがなければ全カードからランダム10枚
            allDue = availableCards;
          }
          dueCards = shuffle([...allDue]).slice(0, 10);
        } else {
          // 特定分野の場合：未習得カードを優先 (最大10枚)
          const chapterCards = availableCards.filter(card => card.chapter === chapter);
          const unmasteredCards = chapterCards.filter(card => (card.repetitions ?? 0) < 1);
          
          if (unmasteredCards.length > 0) {
            // 未習得カードがあれば、それをシャッフルして最大10枚
            dueCards = shuffle(unmasteredCards).slice(0, 10);
          } else {
            // 未習得カードがなければ、その分野の全カードからランダムに最大10枚
            dueCards = shuffle(chapterCards).slice(0, 10);
          }
        }
        if (dueCards.length === 0) {
          Alert.alert(
            "カードがありません",
            "この分野には学習予定のカードがありません。",
            [{ text: "戻る", onPress: () => router.back() }]
          );
        } else {
          setCards(dueCards);
        }
      } catch (error) {
        Alert.alert(
          "エラー",
          "フラッシュカードの読み込みに失敗しました。",
          [{ text: "戻る", onPress: () => router.back() }]
        );
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  const handleInterrupt = () => {
    Alert.alert(
      "学習中断",
      "学習を中断しますか？ここまでの進捗は保存されます。",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "中断する", onPress: () => router.back(), style: "destructive" },
      ]
    );
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleResponse = (quality: number) => {
    if (cards[currentIndex]) {
      updateCardProgress(cards[currentIndex].id, quality);
    }
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>カードを読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (completed) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
        <View style={styles.completedContainer}>
          <Text style={[styles.completedTitle, { color: colors.primary }]}>学習完了！</Text>
          <Text style={[styles.completedMessage, { color: colors.text }]}>お疲れさまでした！</Text>
          <TouchableOpacity style={[styles.finishButton, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
            <Text style={styles.finishButtonText}>ホームに戻る</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = cards[currentIndex];
  if (!currentCard) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>カードデータが不正です</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) }]}>
        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleInterrupt}
        >
          <MaterialIcons name="close" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} activeOpacity={0.8} onPress={handleFlip}>
          {isFlipped ? (
            <Text style={[styles.cardDefinition, { color: colors.text }]}> {currentCard.definition} </Text>
          ) : (
            <>
              <View style={styles.chapterLabelContainer}>
                <Text style={[styles.chapterLabelText, { color: colors.textSecondary }]}>分野: {currentCard.chapter}</Text>
              </View>
              <Text style={[styles.cardTerm, { color: colors.text }]}>{currentCard.term}</Text>
              <Text style={[styles.flipHint, { color: colors.textSecondary }]}>タップして裏返す</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.responseButtons}>
        <TouchableOpacity style={[styles.responseButton, { backgroundColor: colors.error }]} onPress={() => handleResponse(1)}>
          <MaterialIcons name="close" size={20} color="#fff" />
          <Text style={styles.responseButtonText}>忘れていた</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.responseButton, { backgroundColor: colors.success }]} onPress={() => handleResponse(5)}>
          <MaterialIcons name="check" size={20} color="#fff" />
          <Text style={styles.responseButtonText}>覚えていた</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  exitButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardContainer: {
    flex: 1,
    flexGrow: 0.8,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  card: {
    width: 300,
    minHeight: 200,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    position: 'relative',
  },
  chapterLabelContainer: {
    position: 'absolute',
    top: 12,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chapterLabelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardTerm: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    marginTop: 24,
  },
  cardDefinition: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 28,
  },
  flipHint: {
    fontSize: 12,
    fontWeight: "normal",
    marginTop: 16,
  },
  responseButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 0,
  },
  responseButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  responseButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  completedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  completedMessage: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 32,
  },
  finishButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    paddingHorizontal: 32,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

// 配列シャッフル関数
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
