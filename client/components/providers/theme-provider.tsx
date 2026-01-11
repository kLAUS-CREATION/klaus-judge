"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTheme } from "@/features/slices/theme";

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  isDarkMode: false,
  toggleTheme: () => { },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const setTheme = useTheme((state) => state.setTheme);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setTheme(!isDarkMode);

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className="w-full h-screen overflow-hidden">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
