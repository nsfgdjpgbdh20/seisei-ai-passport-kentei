import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/theme-context";
import { usePurchaseStore } from "@/stores/purchase-store";
import { QuestionPack } from "@/types/question";
import { FlashcardPack } from "@/types/flashcard";

const IS_IOS = Platform.OS === "ios";

function formatPrice(
  price: number,
  productId: string | null,
  productPriceMap: Map<string, string>
): string {
  if (price === 0 || !productId) {
    return "無料";
  }
  return productPriceMap.get(productId) ?? `¥${price}`;
}

interface PackSectionProps<TPack extends { id: string; title: string; price: number; productId: string | null }> {
  title: string;
  allLabel: string;
  selectedPackId: string | null;
  availablePacks: TPack[];
  productPriceMap: Map<string, string>;
  isInitializing: boolean;
  isPurchasing: boolean;
  onSelectAll: () => void;
  onSelectPack: (packId: string) => void;
  onPurchasePack: (packId: string) => void;
  isPackOwned: (packId: string) => boolean;
}

function PackSection<TPack extends { id: string; title: string; price: number; productId: string | null }>({
  title,
  allLabel,
  selectedPackId,
  availablePacks,
  productPriceMap,
  isInitializing,
  isPurchasing,
  onSelectAll,
  onSelectPack,
  onPurchasePack,
  isPackOwned,
}: PackSectionProps<TPack>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <TouchableOpacity
        style={styles.allScopeButton}
        onPress={onSelectAll}
        disabled={selectedPackId === null || isInitializing}
      >
        <View style={styles.allScopeTextWrap}>
          <Text style={styles.allScopeTitle}>{allLabel}</Text>
          <Text style={styles.allScopeSubtitle}>購入済みパックをまとめて出題</Text>
        </View>
        <MaterialIcons
          name={selectedPackId === null ? "radio-button-checked" : "radio-button-unchecked"}
          size={22}
          color={selectedPackId === null ? "#2563eb" : "#9ca3af"}
        />
      </TouchableOpacity>

      <View style={styles.listCard}>
        {availablePacks.map((pack, index) => {
          const owned = isPackOwned(pack.id);
          const selected = selectedPackId === pack.id;
          const priceLabel = formatPrice(pack.price, pack.productId, productPriceMap);
          const isLast = index === availablePacks.length - 1;

          return (
            <View
              key={pack.id}
              style={[styles.packRow, !isLast && styles.packRowDivider]}
            >
              <TouchableOpacity
                style={styles.packMainAction}
                onPress={() => {
                  if (owned) {
                    onSelectPack(pack.id);
                    return;
                  }
                  if (!IS_IOS) {
                    Alert.alert("購入不可", "追加パックの購入はiOS版で利用できます。");
                    return;
                  }
                  onPurchasePack(pack.id);
                }}
                disabled={isInitializing || isPurchasing}
              >
                <View style={styles.packTextWrap}>
                  <Text style={styles.packTitle}>{pack.title}</Text>
                  <Text style={styles.packMeta}>
                    {owned ? "購入済み" : IS_IOS ? `未購入 (${priceLabel})` : "未購入 (iOSのみ)"}
                  </Text>
                </View>
              </TouchableOpacity>

              {owned ? (
                <TouchableOpacity
                  onPress={() => onSelectPack(pack.id)}
                  disabled={isInitializing}
                >
                  <MaterialIcons
                    name={selected ? "radio-button-checked" : "radio-button-unchecked"}
                    size={22}
                    color={selected ? "#2563eb" : "#9ca3af"}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.purchaseButton}
                  onPress={() => onPurchasePack(pack.id)}
                  disabled={isInitializing || isPurchasing || !IS_IOS}
                >
                  <Text style={styles.purchaseButtonText}>
                    {IS_IOS ? priceLabel : "iOSのみ"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function PackManagementScreen() {
  const { colors } = useTheme();
  const {
    availableQuestionPacks,
    availableFlashcardPacks,
    selectedQuestionPackId,
    selectedFlashcardPackId,
    products,
    isInitializing,
    isLoadingProducts,
    isPurchasing,
    isRestoring,
    purchaseError,
    initializeStore,
    purchaseQuestionPack,
    purchaseFlashcardPack,
    restorePurchases,
    selectQuestionPack,
    selectFlashcardPack,
    isQuestionPackOwned,
    isFlashcardPackOwned,
  } = usePurchaseStore();

  useEffect(() => {
    void initializeStore();
  }, [initializeStore]);

  const productPriceMap = useMemo(() => {
    const entries: Array<[string, string]> = [];
    products.forEach((product) => {
      const productIdCandidate =
        (product as { productId?: unknown }).productId ??
        (product as { id?: unknown }).id;
      const displayPriceCandidate = (product as { displayPrice?: unknown }).displayPrice;
      if (
        typeof productIdCandidate === "string" &&
        typeof displayPriceCandidate === "string"
      ) {
        entries.push([productIdCandidate, displayPriceCandidate]);
      }
    });
    return new Map(entries);
  }, [products]);

  const handlePurchaseQuestionPack = async (packId: string) => {
    const success = await purchaseQuestionPack(packId);
    if (!success) {
      const message = usePurchaseStore.getState().purchaseError;
      if (message) {
        Alert.alert("購入エラー", message);
      }
      return;
    }
    Alert.alert("購入完了", "クイズ追加パックを利用できるようになりました。");
  };

  const handlePurchaseFlashcardPack = async (packId: string) => {
    const success = await purchaseFlashcardPack(packId);
    if (!success) {
      const message = usePurchaseStore.getState().purchaseError;
      if (message) {
        Alert.alert("購入エラー", message);
      }
      return;
    }
    Alert.alert("購入完了", "カード追加パックを利用できるようになりました。");
  };

  const handleRestore = async () => {
    const restoredCount = await restorePurchases();
    const message = usePurchaseStore.getState().purchaseError;

    if (message) {
      Alert.alert("復元エラー", message);
      return;
    }

    if (restoredCount > 0) {
      Alert.alert("復元完了", `${restoredCount}件の購入情報を復元しました。`);
      return;
    }

    Alert.alert("復元結果", "復元できる購入履歴はありませんでした。");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>問題パック管理</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            void handleRestore();
          }}
          disabled={isRestoring || isInitializing || !IS_IOS}
        >
          {isRestoring ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[styles.restoreText, { color: IS_IOS ? colors.primary : colors.textSecondary }]}>
              復元
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          クイズとフラッシュカードの出題範囲を切り替えられます。未購入パックは購入後に選択できます。
        </Text>

        {(isInitializing || isLoadingProducts) && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              課金情報を読み込み中...
            </Text>
          </View>
        )}

        <PackSection<QuestionPack>
          title="クイズパック"
          allLabel="購入済みの全クイズパック"
          selectedPackId={selectedQuestionPackId}
          availablePacks={availableQuestionPacks}
          productPriceMap={productPriceMap}
          isInitializing={isInitializing}
          isPurchasing={isPurchasing}
          onSelectAll={() => selectQuestionPack(null)}
          onSelectPack={(packId) => selectQuestionPack(packId)}
          onPurchasePack={(packId) => {
            void handlePurchaseQuestionPack(packId);
          }}
          isPackOwned={(packId) => isQuestionPackOwned(packId)}
        />

        <PackSection<FlashcardPack>
          title="カードパック"
          allLabel="購入済みの全カードパック"
          selectedPackId={selectedFlashcardPackId}
          availablePacks={availableFlashcardPacks}
          productPriceMap={productPriceMap}
          isInitializing={isInitializing}
          isPurchasing={isPurchasing}
          onSelectAll={() => selectFlashcardPack(null)}
          onSelectPack={(packId) => selectFlashcardPack(packId)}
          onPurchasePack={(packId) => {
            void handlePurchaseFlashcardPack(packId);
          }}
          isPackOwned={(packId) => isFlashcardPackOwned(packId)}
        />

        {purchaseError && (
          <Text style={[styles.errorText, { color: colors.error }]}>{purchaseError}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    minWidth: 44,
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  restoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  allScopeButton: {
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  allScopeTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  allScopeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  allScopeSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#6b7280",
  },
  listCard: {
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  packRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  packRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  packMainAction: {
    flex: 1,
    marginRight: 10,
  },
  packTextWrap: {
    flex: 1,
  },
  packTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  packMeta: {
    marginTop: 2,
    fontSize: 12,
    color: "#6b7280",
  },
  purchaseButton: {
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  purchaseButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1d4ed8",
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
