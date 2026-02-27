"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/features/slices/theme";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export const ThemeToggle = () => {
  const { isDarkMode, setTheme } = useTheme();

  // Sync with HTML class
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(!isDarkMode)}
      className="text-muted-foreground hover:text-foreground"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-5 w-5 rotate-0 scale-100 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
