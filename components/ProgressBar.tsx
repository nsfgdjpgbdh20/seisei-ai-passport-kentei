import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/context/theme-context";

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
}

export default function ProgressBar({ progress, height = 8, color }: ProgressBarProps) {
  const { colors } = useTheme();

  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  // Determine color based on progress
  const getProgressColor = () => {
    if (color) return color;
    if (clampedProgress >= 70) return colors.success;
    if (clampedProgress >= 40) return colors.primary;
    return colors.warning;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.border,
          height
        }
      ]}
    >
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress}%`,
            backgroundColor: getProgressColor(),
            height
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    borderRadius: 4,
  },
});