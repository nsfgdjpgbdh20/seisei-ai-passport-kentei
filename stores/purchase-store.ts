import { Platform } from "react-native";
import type { Product } from "react-native-iap";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuestionPack } from "@/types/question";
import { FlashcardPack } from "@/types/flashcard";
import { sampleQuestionPacks } from "@/data/sample-question-packs";
import { sampleFlashcardPacks } from "@/data/sample-flashcard-packs";
import {
  fetchProducts,
  getIapUnsupportedMessage,
  initIap,
  isIapRuntimeSupported,
  requestPackPurchase,
  restorePackPurchases,
} from "@/utils/iap";

const IS_IOS = Platform.OS === "ios";

const QUESTION_BASE_PACK_ID = "quiz_pack_basic_001";
const FLASHCARD_BASE_PACK_ID = "flashcard_pack_basic_001";

const QUESTION_PACK_ID_SET = new Set(sampleQuestionPacks.map((pack) => pack.id));
const FLASHCARD_PACK_ID_SET = new Set(sampleFlashcardPacks.map((pack) => pack.id));
const QUESTION_PAID_PACK_ID_SET = new Set(
  sampleQuestionPacks
    .filter((pack) => Boolean(pack.productId))
    .map((pack) => pack.id)
);
const FLASHCARD_PAID_PACK_ID_SET = new Set(
  sampleFlashcardPacks
    .filter((pack) => Boolean(pack.productId))
    .map((pack) => pack.id)
);

const QUESTION_PRODUCT_ID_TO_PACK_ID = new Map(
  sampleQuestionPacks
    .filter(
      (pack): pack is QuestionPack & { productId: string } => Boolean(pack.productId)
    )
    .map((pack) => [pack.productId, pack.id])
);

const FLASHCARD_PRODUCT_ID_TO_PACK_ID = new Map(
  sampleFlashcardPacks
    .filter(
      (pack): pack is FlashcardPack & { productId: string } => Boolean(pack.productId)
    )
    .map((pack) => [pack.productId, pack.id])
);

const QUESTION_PRODUCT_IDS = sampleQuestionPacks
  .map((pack) => pack.productId)
  .filter((productId): productId is string => Boolean(productId));

const FLASHCARD_PRODUCT_IDS = sampleFlashcardPacks
  .map((pack) => pack.productId)
  .filter((productId): productId is string => Boolean(productId));

const IAP_PRODUCT_IDS = Array.from(
  new Set([...QUESTION_PRODUCT_IDS, ...FLASHCARD_PRODUCT_IDS])
);

const DEFAULT_OWNED_QUESTION_PACK_IDS = QUESTION_PACK_ID_SET.has(
  QUESTION_BASE_PACK_ID
)
  ? [QUESTION_BASE_PACK_ID]
  : [];
const DEFAULT_OWNED_FLASHCARD_PACK_IDS = FLASHCARD_PACK_ID_SET.has(
  FLASHCARD_BASE_PACK_ID
)
  ? [FLASHCARD_BASE_PACK_ID]
  : [];

const toErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }
  return fallback;
};

const normalizeIds = (
  value: unknown,
  validSet: Set<string>,
  defaultIds: string[]
): string[] => {
  const normalized = new Set<string>(defaultIds);

  if (!Array.isArray(value)) {
    return Array.from(normalized);
  }

  value.forEach((item) => {
    if (typeof item === "string" && validSet.has(item)) {
      normalized.add(item);
    }
  });

  return Array.from(normalized);
};

const filterPaidIdsForCurrentPlatform = (
  ids: string[],
  paidPackIdSet: Set<string>
): string[] => {
  if (IS_IOS) {
    return ids;
  }
  return ids.filter((id) => !paidPackIdSet.has(id));
};

const normalizeOwnedQuestionPackIds = (value: unknown): string[] => {
  const normalized = normalizeIds(
    value,
    QUESTION_PACK_ID_SET,
    DEFAULT_OWNED_QUESTION_PACK_IDS
  );
  return filterPaidIdsForCurrentPlatform(normalized, QUESTION_PAID_PACK_ID_SET);
};

const normalizeOwnedFlashcardPackIds = (value: unknown): string[] => {
  const normalized = normalizeIds(
    value,
    FLASHCARD_PACK_ID_SET,
    DEFAULT_OWNED_FLASHCARD_PACK_IDS
  );
  return filterPaidIdsForCurrentPlatform(normalized, FLASHCARD_PAID_PACK_ID_SET);
};

const normalizeSelectedPackId = (
  value: unknown,
  ownedPackIds: string[],
  validSet: Set<string>
): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  if (!validSet.has(value)) {
    return null;
  }

  if (!ownedPackIds.includes(value)) {
    return null;
  }

  return value;
};

const mergeOwnedIds = (
  current: string[],
  additional: string[],
  validSet: Set<string>,
  defaultIds: string[]
): string[] => {
  const merged = new Set<string>(normalizeIds(current, validSet, defaultIds));
  additional.forEach((id) => {
    if (validSet.has(id)) {
      merged.add(id);
    }
  });
  return Array.from(merged);
};

const mergeOwnedQuestionPackIds = (
  current: string[],
  additional: string[]
): string[] => {
  const merged = mergeOwnedIds(
    current,
    additional,
    QUESTION_PACK_ID_SET,
    DEFAULT_OWNED_QUESTION_PACK_IDS
  );
  return normalizeOwnedQuestionPackIds(merged);
};

const mergeOwnedFlashcardPackIds = (
  current: string[],
  additional: string[]
): string[] => {
  const merged = mergeOwnedIds(
    current,
    additional,
    FLASHCARD_PACK_ID_SET,
    DEFAULT_OWNED_FLASHCARD_PACK_IDS
  );
  return normalizeOwnedFlashcardPackIds(merged);
};

export const getTargetQuestionPackIdsFromState = (
  selectedQuestionPackId: string | null,
  ownedQuestionPackIds: string[]
): string[] => {
  const normalizedOwned = normalizeOwnedQuestionPackIds(ownedQuestionPackIds);

  if (
    selectedQuestionPackId &&
    normalizedOwned.includes(selectedQuestionPackId)
  ) {
    return [selectedQuestionPackId];
  }

  return normalizedOwned.length > 0
    ? normalizedOwned
    : [...DEFAULT_OWNED_QUESTION_PACK_IDS];
};

export const getTargetFlashcardPackIdsFromState = (
  selectedFlashcardPackId: string | null,
  ownedFlashcardPackIds: string[]
): string[] => {
  const normalizedOwned = normalizeOwnedFlashcardPackIds(ownedFlashcardPackIds);

  if (
    selectedFlashcardPackId &&
    normalizedOwned.includes(selectedFlashcardPackId)
  ) {
    return [selectedFlashcardPackId];
  }

  return normalizedOwned.length > 0
    ? normalizedOwned
    : [...DEFAULT_OWNED_FLASHCARD_PACK_IDS];
};

interface PurchaseState {
  availableQuestionPacks: QuestionPack[];
  availableFlashcardPacks: FlashcardPack[];
  ownedQuestionPackIds: string[];
  ownedFlashcardPackIds: string[];
  selectedQuestionPackId: string | null;
  selectedFlashcardPackId: string | null;
  products: Product[];
  isInitializing: boolean;
  isLoadingProducts: boolean;
  isPurchasing: boolean;
  isRestoring: boolean;
  purchaseError: string | null;
  lastPurchaseAt: string | null;
  initializeStore: () => Promise<void>;
  loadProducts: () => Promise<void>;
  purchaseQuestionPack: (packId: string) => Promise<boolean>;
  purchaseFlashcardPack: (packId: string) => Promise<boolean>;
  restorePurchases: () => Promise<number>;
  selectQuestionPack: (packId: string | null) => void;
  selectFlashcardPack: (packId: string | null) => void;
  isQuestionPackOwned: (packId: string) => boolean;
  isFlashcardPackOwned: (packId: string) => boolean;
  getTargetQuestionPackIds: () => string[];
  getTargetFlashcardPackIds: () => string[];
}

const purchaseByProductId = async (
  productId: string
): Promise<boolean> => {
  const purchases = await requestPackPurchase(productId);
  const purchasedProductIds = new Set(purchases.map((purchase) => purchase.productId));

  if (!purchasedProductIds.has(productId)) {
    const restored = await restorePackPurchases([productId]);
    restored.forEach((purchase) => purchasedProductIds.add(purchase.productId));
  }

  return purchasedProductIds.has(productId);
};

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, get) => ({
      availableQuestionPacks: sampleQuestionPacks,
      availableFlashcardPacks: sampleFlashcardPacks,
      ownedQuestionPackIds: DEFAULT_OWNED_QUESTION_PACK_IDS,
      ownedFlashcardPackIds: DEFAULT_OWNED_FLASHCARD_PACK_IDS,
      selectedQuestionPackId: null,
      selectedFlashcardPackId: null,
      products: [],
      isInitializing: false,
      isLoadingProducts: false,
      isPurchasing: false,
      isRestoring: false,
      purchaseError: null,
      lastPurchaseAt: null,

      initializeStore: async () => {
        if (get().isInitializing) {
          return;
        }

        set({ isInitializing: true, purchaseError: null });
        try {
          if (!IS_IOS) {
            set({ products: [] });
            return;
          }

          if (!isIapRuntimeSupported()) {
            set({
              products: [],
              purchaseError: getIapUnsupportedMessage(),
            });
            return;
          }

          await initIap();
          await get().loadProducts();
        } catch (error) {
          set({
            purchaseError: toErrorMessage(
              error,
              "課金ストアの初期化に失敗しました。"
            ),
          });
        } finally {
          set({ isInitializing: false });
        }
      },

      loadProducts: async () => {
        if (get().isLoadingProducts) {
          return;
        }

        if (!IS_IOS) {
          set({ products: [] });
          return;
        }

        if (!isIapRuntimeSupported()) {
          set({
            products: [],
            purchaseError: getIapUnsupportedMessage(),
          });
          return;
        }

        if (IAP_PRODUCT_IDS.length === 0) {
          set({ products: [] });
          return;
        }

        set({ isLoadingProducts: true });
        try {
          const products = await fetchProducts(IAP_PRODUCT_IDS);
          set({ products, purchaseError: null });
        } finally {
          set({ isLoadingProducts: false });
        }
      },

      purchaseQuestionPack: async (packId) => {
        const state = get();
        const pack = state.availableQuestionPacks.find((item) => item.id === packId);
        const normalizedOwnedQuestionPackIds = normalizeOwnedQuestionPackIds(
          state.ownedQuestionPackIds
        );

        if (!pack) {
          set({ purchaseError: "指定された問題パックが見つかりません。" });
          return false;
        }

        if (normalizedOwnedQuestionPackIds.includes(packId)) {
          set({ selectedQuestionPackId: packId, purchaseError: null });
          return true;
        }

        if (!pack.productId) {
          const nextOwned = mergeOwnedQuestionPackIds(
            normalizedOwnedQuestionPackIds,
            [pack.id]
          );
          set({
            ownedQuestionPackIds: nextOwned,
            selectedQuestionPackId: pack.id,
            purchaseError: null,
            lastPurchaseAt: new Date().toISOString(),
          });
          return true;
        }

        if (!IS_IOS) {
          set({ purchaseError: "問題パックの購入はiOS版で利用できます。" });
          return false;
        }

        if (!isIapRuntimeSupported()) {
          set({
            purchaseError: getIapUnsupportedMessage(),
          });
          return false;
        }

        set({ isPurchasing: true, purchaseError: null });
        try {
          const success = await purchaseByProductId(pack.productId);
          if (!success) {
            throw new Error("購入結果を確認できませんでした。");
          }

          const nextOwned = mergeOwnedQuestionPackIds(
            get().ownedQuestionPackIds,
            [pack.id]
          );
          set({
            ownedQuestionPackIds: nextOwned,
            selectedQuestionPackId: pack.id,
            purchaseError: null,
            lastPurchaseAt: new Date().toISOString(),
          });
          return true;
        } catch (error) {
          set({
            purchaseError: toErrorMessage(error, "購入処理に失敗しました。"),
          });
          return false;
        } finally {
          set({ isPurchasing: false });
        }
      },

      purchaseFlashcardPack: async (packId) => {
        const state = get();
        const pack = state.availableFlashcardPacks.find((item) => item.id === packId);
        const normalizedOwnedFlashcardPackIds = normalizeOwnedFlashcardPackIds(
          state.ownedFlashcardPackIds
        );

        if (!pack) {
          set({ purchaseError: "指定されたカードパックが見つかりません。" });
          return false;
        }

        if (normalizedOwnedFlashcardPackIds.includes(packId)) {
          set({ selectedFlashcardPackId: packId, purchaseError: null });
          return true;
        }

        if (!pack.productId) {
          const nextOwned = mergeOwnedFlashcardPackIds(
            normalizedOwnedFlashcardPackIds,
            [pack.id]
          );
          set({
            ownedFlashcardPackIds: nextOwned,
            selectedFlashcardPackId: pack.id,
            purchaseError: null,
            lastPurchaseAt: new Date().toISOString(),
          });
          return true;
        }

        if (!IS_IOS) {
          set({ purchaseError: "カードパックの購入はiOS版で利用できます。" });
          return false;
        }

        if (!isIapRuntimeSupported()) {
          set({
            purchaseError: getIapUnsupportedMessage(),
          });
          return false;
        }

        set({ isPurchasing: true, purchaseError: null });
        try {
          const success = await purchaseByProductId(pack.productId);
          if (!success) {
            throw new Error("購入結果を確認できませんでした。");
          }

          const nextOwned = mergeOwnedFlashcardPackIds(
            get().ownedFlashcardPackIds,
            [pack.id]
          );
          set({
            ownedFlashcardPackIds: nextOwned,
            selectedFlashcardPackId: pack.id,
            purchaseError: null,
            lastPurchaseAt: new Date().toISOString(),
          });
          return true;
        } catch (error) {
          set({
            purchaseError: toErrorMessage(error, "購入処理に失敗しました。"),
          });
          return false;
        } finally {
          set({ isPurchasing: false });
        }
      },

      restorePurchases: async () => {
        if (!IS_IOS) {
          set({ purchaseError: "購入復元はiOS版で利用できます。" });
          return 0;
        }

        if (!isIapRuntimeSupported()) {
          set({
            purchaseError: getIapUnsupportedMessage(),
          });
          return 0;
        }

        set({ isRestoring: true, purchaseError: null });
        try {
          const purchases = await restorePackPurchases(IAP_PRODUCT_IDS);

          const restoredQuestionPackIds = Array.from(
            new Set(
              purchases
                .map((purchase) =>
                  QUESTION_PRODUCT_ID_TO_PACK_ID.get(purchase.productId)
                )
                .filter((id): id is string => Boolean(id))
            )
          );
          const restoredFlashcardPackIds = Array.from(
            new Set(
              purchases
                .map((purchase) =>
                  FLASHCARD_PRODUCT_ID_TO_PACK_ID.get(purchase.productId)
                )
                .filter((id): id is string => Boolean(id))
            )
          );

          const nextOwnedQuestionPackIds = mergeOwnedQuestionPackIds(
            get().ownedQuestionPackIds,
            restoredQuestionPackIds
          );
          const nextOwnedFlashcardPackIds = mergeOwnedFlashcardPackIds(
            get().ownedFlashcardPackIds,
            restoredFlashcardPackIds
          );

          const nextSelectedQuestionPackId = normalizeSelectedPackId(
            get().selectedQuestionPackId,
            nextOwnedQuestionPackIds,
            QUESTION_PACK_ID_SET
          );
          const nextSelectedFlashcardPackId = normalizeSelectedPackId(
            get().selectedFlashcardPackId,
            nextOwnedFlashcardPackIds,
            FLASHCARD_PACK_ID_SET
          );

          const restoredCount =
            restoredQuestionPackIds.length + restoredFlashcardPackIds.length;

          if (restoredCount > 0) {
            set({
              ownedQuestionPackIds: nextOwnedQuestionPackIds,
              ownedFlashcardPackIds: nextOwnedFlashcardPackIds,
              selectedQuestionPackId: nextSelectedQuestionPackId,
              selectedFlashcardPackId: nextSelectedFlashcardPackId,
              purchaseError: null,
              lastPurchaseAt: new Date().toISOString(),
            });
          }

          return restoredCount;
        } catch (error) {
          set({
            purchaseError: toErrorMessage(error, "購入履歴の復元に失敗しました。"),
          });
          return 0;
        } finally {
          set({ isRestoring: false });
        }
      },

      selectQuestionPack: (packId) => {
        if (packId === null) {
          set({ selectedQuestionPackId: null, purchaseError: null });
          return;
        }

        if (!QUESTION_PACK_ID_SET.has(packId)) {
          set({ purchaseError: "指定された問題パックが見つかりません。" });
          return;
        }

        const normalizedOwnedQuestionPackIds = normalizeOwnedQuestionPackIds(
          get().ownedQuestionPackIds
        );
        if (!normalizedOwnedQuestionPackIds.includes(packId)) {
          set({ purchaseError: "未購入の問題パックは選択できません。" });
          return;
        }

        set({ selectedQuestionPackId: packId, purchaseError: null });
      },

      selectFlashcardPack: (packId) => {
        if (packId === null) {
          set({ selectedFlashcardPackId: null, purchaseError: null });
          return;
        }

        if (!FLASHCARD_PACK_ID_SET.has(packId)) {
          set({ purchaseError: "指定されたカードパックが見つかりません。" });
          return;
        }

        const normalizedOwnedFlashcardPackIds = normalizeOwnedFlashcardPackIds(
          get().ownedFlashcardPackIds
        );
        if (!normalizedOwnedFlashcardPackIds.includes(packId)) {
          set({ purchaseError: "未購入のカードパックは選択できません。" });
          return;
        }

        set({ selectedFlashcardPackId: packId, purchaseError: null });
      },

      isQuestionPackOwned: (packId) => {
        return normalizeOwnedQuestionPackIds(get().ownedQuestionPackIds).includes(
          packId
        );
      },

      isFlashcardPackOwned: (packId) => {
        return normalizeOwnedFlashcardPackIds(get().ownedFlashcardPackIds).includes(
          packId
        );
      },

      getTargetQuestionPackIds: () => {
        const state = get();
        return getTargetQuestionPackIdsFromState(
          state.selectedQuestionPackId,
          state.ownedQuestionPackIds
        );
      },

      getTargetFlashcardPackIds: () => {
        const state = get();
        return getTargetFlashcardPackIdsFromState(
          state.selectedFlashcardPackId,
          state.ownedFlashcardPackIds
        );
      },
    }),
    {
      name: "seisei-ai-passport-purchase-v1",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState) => {
        const state = (persistedState as Partial<PurchaseState>) ?? {};

        const ownedQuestionPackIds = normalizeOwnedQuestionPackIds(
          state.ownedQuestionPackIds
        );
        const ownedFlashcardPackIds = normalizeOwnedFlashcardPackIds(
          state.ownedFlashcardPackIds
        );

        return {
          ...state,
          availableQuestionPacks: sampleQuestionPacks,
          availableFlashcardPacks: sampleFlashcardPacks,
          ownedQuestionPackIds,
          ownedFlashcardPackIds,
          selectedQuestionPackId: normalizeSelectedPackId(
            state.selectedQuestionPackId,
            ownedQuestionPackIds,
            QUESTION_PACK_ID_SET
          ),
          selectedFlashcardPackId: normalizeSelectedPackId(
            state.selectedFlashcardPackId,
            ownedFlashcardPackIds,
            FLASHCARD_PACK_ID_SET
          ),
          products: [],
          isInitializing: false,
          isLoadingProducts: false,
          isPurchasing: false,
          isRestoring: false,
          purchaseError: null,
          lastPurchaseAt:
            typeof state.lastPurchaseAt === "string" ? state.lastPurchaseAt : null,
        } as PurchaseState;
      },
      partialize: (state) => ({
        ownedQuestionPackIds: normalizeOwnedQuestionPackIds(
          state.ownedQuestionPackIds
        ),
        ownedFlashcardPackIds: normalizeOwnedFlashcardPackIds(
          state.ownedFlashcardPackIds
        ),
        selectedQuestionPackId: normalizeSelectedPackId(
          state.selectedQuestionPackId,
          normalizeOwnedQuestionPackIds(state.ownedQuestionPackIds),
          QUESTION_PACK_ID_SET
        ),
        selectedFlashcardPackId: normalizeSelectedPackId(
          state.selectedFlashcardPackId,
          normalizeOwnedFlashcardPackIds(state.ownedFlashcardPackIds),
          FLASHCARD_PACK_ID_SET
        ),
        lastPurchaseAt: state.lastPurchaseAt,
      }),
    }
  )
);
