import React from "react";
import { Tabs } from "expo-router";
import { useColorScheme, Platform, Dimensions } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from "@/context/theme-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { theme, colors } = useTheme();
  const windowWidth = Dimensions.get('window').width;
  const insets = useSafeAreaInsets();

  // 画面サイズに基づいてアイコンとラベルのサイズを調整
  const getIconSize = () => {
    if (windowWidth < 350) return 18;
    return 20;
  };

  const getLabelStyle = () => {
    if (windowWidth < 350) {
      return {
        fontSize: 10,
      };
    }
    return {
      fontSize: 11,
    };
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 85 : 60 + insets.bottom, // iOSでは安全領域を考慮
          paddingBottom: Platform.OS === 'ios' ? 28 : 8 + insets.bottom,
          paddingTop: 6,
        },
        headerShown: true, // ヘッダーを表示
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
        },
        tabBarLabelStyle: getLabelStyle(),
        tabBarIconStyle: {
          marginTop: 2,
        },
        // iPhoneのノッチやカメラ部分を考慮したパディング
        headerStatusBarHeight: insets.top,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ホーム",
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
          headerTitle: "生成AIパスポート合格ドリル",
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: "クイズ",
          headerTitle: "クイズ",
          tabBarIcon: ({ color }) => <MaterialIcons name="menu-book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "カード",
          tabBarIcon: ({ color }) => <MaterialIcons name="layers" size={24} color={color} />,
          headerTitle: "フラッシュカード",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "設定",
          tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
          headerTitle: "設定",
        }}
      />
    </Tabs>
  );
}