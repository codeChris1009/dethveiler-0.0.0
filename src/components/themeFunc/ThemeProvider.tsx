// Node modules and libraries
import { themeProviderContext, THEME_ENUM } from "./ThemeContext";
import type { Theme } from "./ThemeContext";

// Hooks
import { useEffect, useState } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export const ThemeProvider = ({
  children,
  defaultTheme = THEME_ENUM.SYSTEM,
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
    const root = document.documentElement;
    root.classList.remove(THEME_ENUM.LIGHT, THEME_ENUM.DARK);
    if (theme === THEME_ENUM.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? THEME_ENUM.DARK
        : THEME_ENUM.LIGHT;
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <themeProviderContext.Provider {...props} value={value}>
      {children}
    </themeProviderContext.Provider>
  );
};
