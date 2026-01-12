import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  Platform,
  Linking
} from "react-native";
import { useTheme } from "@/context/theme-context";
import { useNotificationStore } from "@/stores/notification-store";
import { useProgressStore } from "@/stores/progress-store";
import { useQuestionStore } from "@/stores/question-store";
import { useFlashcardStore } from "@/stores/flashcard-store";
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from "expo-haptics";
import DateTimePicker from "@/components/DateTimePicker";
import { scheduleNotification, cancelAllNotifications } from "@/utils/notifications";
import { checkForQuestionUpdates } from "@/utils/question-updater";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommonHeader from "../../components/CommonHeader";
import { sampleQuestions } from "@/data/sample-questions";
import { sampleFlashcards } from "@/data/sample-flashcards";
import * as StoreReview from 'expo-store-review';

export default function SettingsScreen() {
  const { theme, colors, toggleTheme } = useTheme();
  const {
    notificationsEnabled,
    notificationTime,
    toggleNotifications,
    setNotificationTime
  } = useNotificationStore();

  const { resetProgress } = useProgressStore();
  const { resetFlashcards } = useFlashcardStore();
  const { resetQuestions } = useQuestionStore();
  const insets = useSafeAreaInsets();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleNotifications = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newValue = !notificationsEnabled;
    toggleNotifications();

    if (Platform.OS !== "web") {
      if (newValue) {
        scheduleNotification(notificationTime);
      } else {
        cancelAllNotifications();
      }
    }
  };

  const handleTimeChange = (time: string) => {
    setNotificationTime(time);
    setShowTimePicker(false);

    if (Platform.OS !== "web" && notificationsEnabled) {
      scheduleNotification(time);
    }
  };

  const handleResetProgress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Alert.alert(
      "進捗をリセット",
      "すべての学習進捗がリセットされます。この操作は元に戻せません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "リセット",
          style: "destructive",
          onPress: () => {
            resetProgress();
            resetFlashcards();
            Alert.alert("リセット完了", "学習進捗がリセットされました。");
          }
        }
      ]
    );
  };

  const handleCheckForUpdates = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsUpdating(true);

    try {
      // 更新チェック処理を実行
      const result = await checkForQuestionUpdates();

      // 常に「更新なし」と表示（モック実装のため）
      Alert.alert(
        "更新確認",
        "問題データは最新です。",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Update check failed:", error);
      Alert.alert(
        "更新エラー",
        "問題データの確認中にエラーが発生しました。ネットワーク接続を確認してください。",
        [{ text: "OK" }]
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenWebsite = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.error("リンクを開けませんでした:", err);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <CommonHeader title="" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            アプリ設定
          </Text>

          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={toggleTheme}
            >
              <View style={styles.settingIconContainer}>
                {theme === "dark" ? (
                  <MaterialIcons name="dark-mode" size={24} color={colors.primary} />
                ) : (
                  <MaterialIcons name="light-mode" size={24} color={colors.primary} />
                )}
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  ダークモード
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {theme === "dark" ? "オン" : "オフ"}
                </Text>
              </View>
              <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: colors.primaryLight }}
                thumbColor={theme === "dark" ? colors.primary : "#f4f3f4"}
              />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleToggleNotifications}
            >
              <View style={styles.settingIconContainer}>
                <MaterialIcons name="notifications" size={24} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  学習リマインダー
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {notificationsEnabled ? "オン" : "オフ"}
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: "#767577", true: colors.primaryLight }}
                thumbColor={notificationsEnabled ? colors.primary : "#f4f3f4"}
              />
            </TouchableOpacity>

            {notificationsEnabled && (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <TouchableOpacity
                  style={styles.settingRow}
                  onPress={() => setShowTimePicker(true)}
                >
                  <View style={styles.settingIconContainer}>
                    <MaterialIcons name="access-time" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      通知時刻
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      {notificationTime}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.timeButton, { backgroundColor: colors.border }]}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={[styles.timeButtonText, { color: colors.text }]}>
                      変更
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            データ管理
          </Text>

          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleCheckForUpdates}
              disabled={isUpdating}
            >
              <View style={styles.settingIconContainer}>
                <MaterialIcons name="refresh" size={24} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  問題データを更新
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {isUpdating ? "更新中..." : "最新の問題データを確認します"}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleResetProgress}
            >
              <View style={styles.settingIconContainer}>
                <MaterialIcons name="delete" size={24} color={colors.error} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  進捗をリセット
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  すべての学習データを削除します
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            アプリ情報
          </Text>

          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <MaterialIcons name="info" size={24} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  バージョン
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  1.0.0
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={async () => {
                if (await StoreReview.isAvailableAsync()) {
                  StoreReview.requestReview();
                } else {
                  Alert.alert("レビュー", "ストアのレビュー画面を開けませんでした。");
                }
              }}
            >
              <View style={styles.settingIconContainer}>
                <MaterialIcons name="star" size={24} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  アプリをレビューする
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  ストアで評価をお願いします
                </Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => handleOpenWebsite("https://guga.or.jp/")}
            >
              <View style={styles.settingIconContainer}>
                <MaterialIcons name="open-in-new" size={24} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  生成AIパスポート公式サイト
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  公式サイトを開く
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {showTimePicker && (
          <DateTimePicker
            mode="time"
            value={notificationTime}
            onConfirm={handleTimeChange}
            onCancel={() => setShowTimePicker(false)}
          />
        )}
      </ScrollView>
    </View>
  );
}
// End of SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  settingCard: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  timeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});