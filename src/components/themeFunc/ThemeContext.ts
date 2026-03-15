// theme-context.ts
// 僅提供 context 與型別，不含 React component

import { createContext } from "react";

// 嚴謹型別定義
export const THEME_ENUM = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;
export type Theme = (typeof THEME_ENUM)[keyof typeof THEME_ENUM]; // "light" | "dark" | "system"

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const initialState: ThemeProviderState = {
  theme: THEME_ENUM.SYSTEM,
  setTheme: () => {},
};

export const themeProviderContext =
  createContext<ThemeProviderState>(initialState);
