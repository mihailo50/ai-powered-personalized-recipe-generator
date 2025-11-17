"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  // Detect system preference on mount
  useEffect(() => {
    setMounted(true);
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode | null;
    
    if (savedMode) {
      setModeState(savedMode);
    } else {
      setModeState(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme-mode", mode);
  }, [mode, mounted]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

