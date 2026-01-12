import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuestionStore } from "@/stores/question-store";

const LAST_CHECK_KEY = "seisei-ai-passport-last-update-check";

// モック実装：実際のAPIエンドポイントがないため、更新チェックをシミュレート
export async function checkForQuestionUpdates(): Promise<boolean> {
  try {
    // 最後のチェック日を確認
    const lastCheck = await AsyncStorage.getItem(LAST_CHECK_KEY);
    const today = new Date().toISOString().split("T")[0];

    if (lastCheck === today) {
      // 既に今日チェック済み
      console.log("Already checked for updates today");
      return false;
    }

    // 最終チェック日を更新
    await AsyncStorage.setItem(LAST_CHECK_KEY, today);

    // 現在のバージョンを取得
    const { version } = useQuestionStore.getState();
    console.log("Current version:", version);

    // デモ用：常に「更新なし」を返す
    // 実際のアプリでは、ここでAPIリクエストを行い、サーバーから最新バージョンを取得する
    const serverVersion = version; // 同じバージョンを返して「更新なし」とする

    // バージョンが一致する場合は更新なし
    if (serverVersion === version) {
      console.log("No updates available");
      return false;
    }

    return false; // 常に更新なしを返す
  } catch (error) {
    console.error("Error checking for updates:", error);
    throw new Error("Failed to check for updates");
  }
}