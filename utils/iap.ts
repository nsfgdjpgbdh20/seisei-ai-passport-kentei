import Constants from "expo-constants";
import { Platform } from "react-native";
import type { Product, Purchase } from "react-native-iap";

type IapModule = typeof import("react-native-iap");

let iapModulePromise: Promise<IapModule | null> | null = null;
let isIapReady = false;
let initIapPromise: Promise<boolean> | null = null;
let productFetchPromise: Promise<Product[]> | null = null;
let productFetchKey = "";

const executionEnvironment = Constants.executionEnvironment;
const appOwnership = Constants.appOwnership ?? null;
const isExpoGo =
  executionEnvironment === "storeClient" || appOwnership === "expo";
const isIapDisabledInDev =
  __DEV__ && process.env.EXPO_PUBLIC_ENABLE_IAP_DEV !== "true";
const canUseIap = Platform.OS === "ios" && !isExpoGo && !isIapDisabledInDev;

const toPurchaseList = (
  value: Purchase | Purchase[] | null | undefined
): Purchase[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

const loadIapModule = async (): Promise<IapModule | null> => {
  if (!canUseIap) {
    return null;
  }

  if (!iapModulePromise) {
    iapModulePromise = import("react-native-iap")
      .then((module) => module)
      .catch(() => null);
  }

  return iapModulePromise;
};

export const isIapRuntimeSupported = (): boolean => canUseIap;

export const getIapUnsupportedMessage = (): string => {
  if (Platform.OS !== "ios") {
    return "購入機能はiOS版で利用できます。";
  }

  if (isExpoGo) {
    return "Expo Goでは課金機能を利用できません。Development BuildまたはTestFlightで確認してください。";
  }

  if (isIapDisabledInDev) {
    return "開発環境では課金機能を無効化しています。実機のTestFlightで確認してください。";
  }

  return "この環境では課金機能を利用できません。";
};

export const initIap = async (): Promise<boolean> => {
  if (!canUseIap) {
    return false;
  }

  if (isIapReady) {
    return true;
  }

  if (initIapPromise) {
    return initIapPromise;
  }

  initIapPromise = (async () => {
    const iap = await loadIapModule();
    if (!iap) {
      return false;
    }

    const connected = await iap.initConnection();
    isIapReady = Boolean(connected);
    return isIapReady;
  })().finally(() => {
    initIapPromise = null;
  });

  return initIapPromise;
};

export const fetchProducts = async (
  productIds: string[]
): Promise<Product[]> => {
  if (!canUseIap || productIds.length === 0) {
    return [];
  }

  const iap = await loadIapModule();
  if (!iap) {
    return [];
  }

  const isConnected = await initIap();
  if (!isConnected) {
    return [];
  }

  const normalizedProductIds = Array.from(new Set(productIds)).sort();
  const requestKey = normalizedProductIds.join(",");
  if (productFetchPromise && productFetchKey === requestKey) {
    return productFetchPromise;
  }

  productFetchKey = requestKey;
  productFetchPromise = (async () => {
    try {
      const products = await iap.getProducts({
        skus: normalizedProductIds,
      });
      return products ?? [];
    } finally {
      productFetchPromise = null;
      productFetchKey = "";
    }
  })();

  return productFetchPromise;
};

export const requestPackPurchase = async (
  productId: string
): Promise<Purchase[]> => {
  if (!canUseIap) {
    return [];
  }

  const iap = await loadIapModule();
  if (!iap) {
    return [];
  }

  const isConnected = await initIap();
  if (!isConnected) {
    return [];
  }

  const purchaseResult = await iap.requestPurchase({
    sku: productId,
    andDangerouslyFinishTransactionAutomaticallyIOS: false,
  });

  const purchases = toPurchaseList(
    (purchaseResult ?? null) as Purchase | Purchase[] | null
  );

  if (purchases.length === 0) {
    const fallback = await iap.getAvailablePurchases({
      onlyIncludeActiveItems: true,
    });
    return fallback.filter((purchase) => purchase.productId === productId);
  }

  await Promise.allSettled(
    purchases.map((purchase) =>
      iap.finishTransaction({
        purchase,
        isConsumable: false,
      })
    )
  );

  return purchases;
};

export const restorePackPurchases = async (
  productIds: string[]
): Promise<Purchase[]> => {
  if (!canUseIap) {
    return [];
  }

  const iap = await loadIapModule();
  if (!iap) {
    return [];
  }

  const isConnected = await initIap();
  if (!isConnected) {
    return [];
  }

  const purchases = await iap.getAvailablePurchases({
    onlyIncludeActiveItems: true,
  });

  if (productIds.length === 0) {
    return purchases;
  }

  const targetProductIds = new Set(productIds);
  return purchases.filter((purchase) =>
    targetProductIds.has(purchase.productId)
  );
};

export const closeIap = async (): Promise<void> => {
  if (!isIapReady) {
    return;
  }

  const iap = await loadIapModule();
  if (!iap) {
    isIapReady = false;
    return;
  }

  await iap.endConnection();
  isIapReady = false;
};
