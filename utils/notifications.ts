import { Platform } from "react-native";

// Expo Go SDK 53 removed Android Push Notifications support.
// We avoid top-level imports and only require 'expo-notifications' inside functions
// on supported platforms to prevent any issues on Android.

export async function requestNotificationPermission() {
  if (Platform.OS === "web") return true;

  try {
    const Notifications = require("expo-notifications");
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (e) {
    console.warn("Failed to load expo-notifications", e);
    return false;
  }
}

export function setupNotifications() {
  if (Platform.OS === "web") return;

  try {
    const Notifications = require("expo-notifications");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (e) {
    console.warn("Failed to setup notifications", e);
  }
}

export async function scheduleNotification(time: string) {
  if (Platform.OS === "web") return;

  try {
    const Notifications = require("expo-notifications");
    const granted = await requestNotificationPermission();
    if (!granted) return;

    await cancelAllNotifications();

    const [hours, minutes] = time.split(":").map(Number);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "生成AIパスポート合格ドリル",
        body: "今日の学習を始めましょう！10問だけ解いて実力アップ！",
        sound: true,
      },
      trigger: {
        type: "daily",
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  } catch (e) {
    console.warn("Failed to schedule notification", e);
  }
}

export async function cancelAllNotifications() {
  if (Platform.OS === "web") return;

  try {
    const Notifications = require("expo-notifications");
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn("Failed to cancel notifications", e);
  }
}
