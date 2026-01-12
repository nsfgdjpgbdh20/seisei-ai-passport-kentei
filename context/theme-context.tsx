import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define theme colors
const lightColors = {
  primary: "#004aad", // Deep Blue
  primaryLight: "rgba(0, 74, 173, 0.1)",
  primaryDark: "#00337a",
  accent: "#00e5ff", // Cyan
  accentLight: "rgba(0, 229, 255, 0.1)",
  success: "#00c853",
  successLight: "rgba(0, 200, 83, 0.1)",
  warning: "#ffab00",
  warningLight: "rgba(255, 171, 0, 0.1)",
  error: "#d50000",
  errorLight: "rgba(213, 0, 0, 0.1)",
  background: "#f8f9fa", // Very light gray/white
  card: "#ffffff",
  text: "#1a1a1a",
  textSecondary: "#5f6368",
  border: "#e0e0e0",
  tabIconDefault: "#9aa0a6",
};

const darkColors = {
  primary: "#4dabf5", // Lighter Blue for dark mode
  primaryLight: "rgba(77, 171, 245, 0.2)",
  primaryDark: "#004aad",
  accent: "#84ffff", // Light Cyan
  accentLight: "rgba(132, 255, 255, 0.2)",
  success: "#69f0ae",
  successLight: "rgba(105, 240, 174, 0.2)",
  warning: "#ffd740",
  warningLight: "rgba(255, 215, 64, 0.2)",
  error: "#ff5252",
  errorLight: "rgba(255, 82, 82, 0.2)",
  background: "#0d1117", // Dark Navy/Gray
  card: "#161b22",
  text: "#e6edf3",
  textSecondary: "#8b949e",
  border: "#30363d",
  tabIconDefault: "#484f58",
};

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof lightColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colors: lightColors,
  toggleTheme: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme() as ThemeType;
  const [theme, setTheme] = useState<ThemeType>(systemColorScheme || "light");

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        }
      } catch (error) {
        console.log("Failed to load theme preference:", error);
      }
    };

    loadTheme();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem("theme", theme);
      } catch (error) {
        console.log("Failed to save theme preference:", error);
      }
    };

    saveTheme();
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);