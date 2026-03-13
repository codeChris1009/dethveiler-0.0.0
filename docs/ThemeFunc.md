# ThemeFunc - 主題功能模組

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/book-open-duotone.svg" width="20" height="20" align="center" /> 功能概述

ThemeFunc 是主題切換功能模組，包含兩個核心檔案：

- `ThemeProvider.tsx`：提供全域主題狀態（light / dark / system）
- `ThemeDropdown.tsx`：提供 UI 操作介面給使用者切換主題

此模組目標是：

- 讓主題切換可在整個應用共用
- 將使用者選擇持久化到 `localStorage`
- 透過 `<html>` 的 class（`light` / `dark`）與 Tailwind `dark:` 樣式整合

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/target-duotone.svg" width="20" height="20" align="center" /> 核心概念

### 1. Context 管理全域主題

`ThemeProvider` 使用 React Context 將 `theme` 與 `setTheme` 提供給所有子元件，避免逐層傳 props。

### 2. DOM class 切換是主題生效關鍵

主題實際套用不是靠 React 樣式直接改，而是透過：

1. 移除舊 class：`light` / `dark`
2. 新增新 class：`light`、`dark` 或 system 判斷後的 class

Tailwind 再根據 `.dark` 類別啟用 `dark:*` 規則。

### 3. Dropdown 事件差異（本專案重點）

本專案的 Dropdown 是基於 Base UI 包裝，主題項目使用 `onClick` 觸發切換。

- 教學影片常見 `onSelect`（多為 Radix 範例）
- 本專案現況應使用 `onClick`

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/wrench-duotone.svg" width="20" height="20" align="center" /> 完整程式碼解析

### A. ThemeProvider.tsx

#### 1. 型別定義

```typescript
type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};
```

用聯合型別限制合法值，避免出現無效主題字串。

#### 2. 初始主題來源

```typescript
const [theme, setTheme] = useState<Theme>(
  () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
);
```

優先讀取 `localStorage`，沒有才使用 `defaultTheme`。

#### 3. 主題同步邏輯

```typescript
useEffect(() => {
  localStorage.setItem(storageKey, theme);
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
    return;
  }

  root.classList.add(theme);
}, [theme, storageKey]);
```

重點：`system` 會依作業系統偏好判斷，不應硬寫固定 dark。

#### 4. Context 提供值

```typescript
const value = {
  theme,
  setTheme: (theme: Theme) => {
    localStorage.setItem(storageKey, theme);
    setTheme(theme);
  },
};
```

`setTheme` 同步更新 state 與儲存層。

### B. ThemeDropdown.tsx

#### 1. 讀取 setTheme

```typescript
const { setTheme } = useTheme();
```

#### 2. 三個主題選項

```typescript
<DropdownMenuItem onClick={() => setTheme("light")}>
  Light
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setTheme("dark")}>
  Dark
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setTheme("system")}>
  system
</DropdownMenuItem>
```

目前專案以 `onClick` 作為切換觸發點。

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/note-pencil-duotone.svg" width="20" height="20" align="center" /> 使用方式

### 步驟 1：在上層包住 Provider

```tsx
import { ThemeProvider } from "@/components/themeFunc/ThemeProvider";

export const App = () => {
  return <ThemeProvider>{/* 你的頁面內容 */}</ThemeProvider>;
};
```

### 步驟 2：在工具列放入 ThemeDropdown

```tsx
import { ThemeDropdown } from "@/components/themeFunc/ThemeDropdown";

<ThemeDropdown />;
```

### 步驟 3：在樣式中使用 dark 變體

```tsx
<div className="bg-white text-black dark:bg-black dark:text-white">
  Theme preview
</div>
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/magnifying-glass-duotone.svg" width="20" height="20" align="center" /> 完整流程示意圖

```text
使用者點擊 ThemeDropdown 項目
    ↓
setTheme("light" | "dark" | "system")
    ↓
ThemeProvider state 更新
    ↓
useEffect 觸發
    ↓
1. localStorage 寫入主題
2. <html> 移除舊 class
3. <html> 加上新 class（或 system 判斷結果）
    ↓
Tailwind 根據 dark: 規則更新畫面
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/lightbulb-duotone.svg" width="20" height="20" align="center" /> 重點總結

- 主題核心由 `ThemeProvider` 控制，UI 切換由 `ThemeDropdown` 提供
- `system` 必須使用 `matchMedia` 結果，不要硬編碼成單一主題
- 本專案的 dropdown item 以 `onClick` 觸發切換
- 主題效果成立依賴 `<html>` 的 class 與 Tailwind `dark:` 搭配

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/rocket-duotone.svg" width="20" height="20" align="center" /> 進階概念

### 1. 首次載入閃爍（FOUC）

若頁面首次載入有亮暗閃爍，可考慮在更前期注入 theme class（例如在 HTML entry 階段）。

### 2. 監聽系統主題即時變更

目前是設定 `system` 時讀一次系統偏好；若需要「系統主題改變立即跟著變」，可再加 `matchMedia` change listener。

### 3. Provider 與 Hook 檔案拆分

若要消除 React Fast Refresh 的提示，可將 `useTheme` 移到獨立檔案，讓 Provider 檔案只輸出元件。

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/books-duotone.svg" width="20" height="20" align="center" /> 相關資源

- [React createContext](https://react.dev/reference/react/createContext)
- [React useContext](https://react.dev/reference/react/useContext)
- [React useEffect](https://react.dev/reference/react/useEffect)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [MDN localStorage](https://developer.mozilla.org/zh-TW/docs/Web/API/Window/localStorage)

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="20" height="20" align="center" /> 檢查清單

- [ ] 確認 `ThemeProvider` 已包住需要使用主題的區塊
- [ ] 確認 `ThemeDropdown` 點擊可切換 light / dark / system
- [ ] 確認切換後 `<html>` class 會更新
- [ ] 確認重新整理後主題仍可從 localStorage 還原
- [ ] 確認 `system` 模式會依作業系統偏好套用

---

**最後更新**：2026年3月13日
