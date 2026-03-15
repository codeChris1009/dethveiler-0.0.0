import { useContext } from "react";
import { themeProviderContext } from "../components/themeFunc/ThemeContext";

export const useTheme = () => {
  const context = useContext(themeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
