import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 通知設定の状態
interface NotificationState {
  // 状態
  notificationsEnabled: boolean;
  notificationTime: string; // HH:mm 形式

  // アクション
  toggleNotifications: () => void;
  setNotificationTime: (time: string) => void;
}

// デフォルトの通知時刻
const DEFAULT_NOTIFICATION_TIME = "21:00";

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notificationsEnabled: false,
      notificationTime: DEFAULT_NOTIFICATION_TIME,

      toggleNotifications: () => {
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled }));
      },

      setNotificationTime: (time: string) => {
        set({ notificationTime: time });
      },
    }),
    {
      name: "seisei-ai-passport-notifications",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
