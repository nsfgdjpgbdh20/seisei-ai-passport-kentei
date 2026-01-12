import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificationState {
  notificationsEnabled: boolean;
  notificationTime: string;

  // Actions
  toggleNotifications: () => void;
  setNotificationTime: (time: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      notificationTime: "21:00",

      toggleNotifications: () => {
        set(state => ({ notificationsEnabled: !state.notificationsEnabled }));
      },

      setNotificationTime: (time) => {
        set({ notificationTime: time });
      },
    }),
    {
      name: "seisei-ai-passport-notifications",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);