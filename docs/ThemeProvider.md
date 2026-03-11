# ThemeProvider - 深淺色主題切換功能

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/book-open-duotone.svg" width="20" height="20" align="center" /> 功能概述

ThemeProvider 是一個 React Context Provider 元件，用於管理整個應用程式的主題（深色模式/淺色模式）。它使用 React Context API 讓所有子元件都能存取和修改主題設定。

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/target-duotone.svg" width="20" height="20" align="center" /> 核心概念

### 1. React Context API

**什麼是 Context？**

- Context 讓你可以在元件樹中**跨層級傳遞資料**，不需要逐層透過 props 傳遞
- 適合用於「全域狀態」，例如：主題、語言、使用者資訊等

**傳統 Props 傳遞（<img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/x-circle-duotone.svg" width="16" height="16" align="center" /> 麻煩）：**

```tsx
<App theme={theme}>
  <Header theme={theme}>
    <Nav theme={theme}>
      <Button theme={theme} /> {/* 需要層層傳遞 */}
    </Nav>
  </Header>
</App>
```

**使用 Context（<img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 簡潔）：**

```tsx
<ThemeProvider>
  <App>
    <Header>
      <Nav>
        <Button /> {/* 可以直接存取 theme，不需要 props */}
      </Nav>
    </Header>
  </App>
</ThemeProvider>
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/wrench-duotone.svg" width="20" height="20" align="center" /> 完整程式碼解析

### 第 1 步：定義類型

```typescript
// 主題類型：只能是這三種之一
type Theme = "dark" | "light" | "system";

// Provider 元件的 Props
type ThemeProviderProps = {
  children: React.ReactNode; // 子元件
  defaultTheme?: Theme; // 預設主題（可選）
  storageKey?: string; // localStorage 鍵名（可選）
};

// 提供給消費者的狀態和方法
type ThemeProviderState = {
  theme: Theme; // 當前主題
  setTheme: (theme: Theme) => void; // 切換主題的函數
};
```

**重點**：

- `?` 表示可選參數
- `React.ReactNode` 可以是任何 React 元素（文字、元件、陣列等）

---

### 第 2 步：建立 Context

```typescript
// 初始狀態
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => {}, // 空函數（稍後會被真正的函數替換）
};

// 建立 Context（就像一個「傳送門」）
const themeProviderContext = createContext<ThemeProviderState>(initialState);
```

**重點**：

- `createContext` 建立一個 Context 物件
- `initialState` 只是預設值，實際值會由 Provider 提供

---

### 第 3 步：建立 Provider 元件

```typescript
export const ThemeProvider = ({
  children,
  defaultTheme = "system",           // 預設參數
  storageKey = "vite-ui-theme",      // 預設參數
  ...props                           // 其他 props
}: ThemeProviderProps) => {
```

**解構賦值（Destructuring）**：

```typescript
// 傳統寫法
function ThemeProvider(props) {
  const children = props.children;
  const defaultTheme = props.defaultTheme || "system";
}

// 解構賦值寫法（更簡潔）
function ThemeProvider({ children, defaultTheme = "system" }) {
  // 直接使用 children 和 defaultTheme
}
```

---

### 第 4 步：初始化狀態

```typescript
const [theme, setTheme] = useState<Theme>(
  () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
);
```

**useState 的初始化函數**：

```typescript
// ❌ 這樣寫，每次 render 都會讀取 localStorage
const [theme, setTheme] = useState(
  localStorage.getItem(storageKey) || defaultTheme,
);

// ✅ 這樣寫，只在初始化時讀取一次
const [theme, setTheme] = useState(
  () => localStorage.getItem(storageKey) || defaultTheme,
);
```

**流程**：

1. 先從 localStorage 讀取儲存的主題
2. 如果沒有儲存過，使用 `defaultTheme`（預設 "system"）

---

### 第 5 步：主題切換邏輯（核心）

```typescript
useEffect(() => {
  // 1️⃣ 儲存到 localStorage（持久化）
  localStorage.setItem(storageKey, theme);

  // 2️⃣ 取得 HTML 根元素
  const root = document.documentElement; // <html> 標籤

  // 3️⃣ 移除舊的主題類別
  root.classList.remove("light", "dark");

  // 4️⃣ 如果是系統模式，偵測作業系統設定
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
    return;
  }

  // 5️⃣ 添加新的主題類別
  root.classList.add(theme);
}, [theme, storageKey]); // 依賴陣列：當 theme 或 storageKey 變更時執行
```

**useEffect 解析**：

- `useEffect` 處理「副作用」（Side Effects）
- 副作用：與 UI render 無關的操作，如：API 請求、DOM 操作、localStorage

**執行時機**：

1. 元件首次渲染後
2. `theme` 或 `storageKey` 變更時

**實際效果**：

```html
<!-- 淺色模式 -->
<html class="light">
  ...
</html>

<!-- 深色模式 -->
<html class="dark">
  ...
</html>
```

**Tailwind CSS 配合**：

```css
/* 在 Tailwind 中可以這樣使用 */
.dark .bg-background {
  background: #000;
}
.light .bg-background {
  background: #fff;
}
```

---

### 第 6 步：提供 Context 值

```typescript
const value = {
  theme,                                  // 當前主題
  setTheme: (theme: Theme) => {          // 切換函數
    localStorage.setItem(storageKey, theme);
    setTheme(theme);
  },
};

return (
  <themeProviderContext.Provider {...props} value={value}>
    {children}
  </themeProviderContext.Provider>
);
```

**Props 展開運算符（Spread Operator）**：

```typescript
// ...props 會將剩餘的 props 全部傳遞給 Provider
<themeProviderContext.Provider {...props} value={value}>
// 等同於
<themeProviderContext.Provider id={props.id} className={props.className} value={value}>
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/note-pencil-duotone.svg" width="20" height="20" align="center" /> 使用方式

### 步驟 1：包裹整個應用

在 `main.tsx` 或 `App.tsx` 中：

```tsx
import { ThemeProvider } from "@/components/themeProvider/ThemeProvider";

function Main() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="my-app-theme">
      <App />
    </ThemeProvider>
  );
}
```

### 步驟 2：建立自訂 Hook（建議）

創建 `src/hooks/useTheme.ts`：

```typescript
import { useContext } from "react";
import { themeProviderContext } from "@/components/themeProvider/ThemeProvider";

export const useTheme = () => {
  const context = useContext(themeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme 必須在 ThemeProvider 內部使用");
  }

  return context;
};
```

### 步驟 3：在任何元件中使用

```tsx
import { useTheme } from "@/hooks/useTheme";

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>當前主題：{theme}</p>

      <button onClick={() => setTheme("light")}>淺色模式</button>

      <button onClick={() => setTheme("dark")}>深色模式</button>

      <button onClick={() => setTheme("system")}>跟隨系統</button>
    </div>
  );
}
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/palette-duotone.svg" width="20" height="20" align="center" /> 與 Tailwind CSS 整合

### 在 `tailwind.config.js` 中啟用 dark mode：

```javascript
export default {
  darkMode: ["class"], // 使用 class 策略
  // ...其他設定
};
```

### 在 CSS 中使用：

```tsx
<div className="bg-white dark:bg-black text-black dark:text-white">
  這段文字在淺色模式是黑色，深色模式是白色
</div>
```

**語法說明**：

- `bg-white` - 預設（淺色模式）背景是白色
- `dark:bg-black` - 深色模式背景是黑色
- Tailwind 會根據 `<html class="dark">` 自動套用對應樣式

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/magnifying-glass-duotone.svg" width="20" height="20" align="center" /> 完整流程示意圖

```
使用者點擊按鈕
    ↓
setTheme('dark')
    ↓
更新 React state (theme = 'dark')
    ↓
useEffect 觸發
    ↓
1. localStorage.setItem('theme', 'dark')  ← 儲存到瀏覽器
2. document.documentElement.classList.add('dark')  ← 更新 HTML
    ↓
Tailwind CSS 偵測到 .dark 類別
    ↓
套用深色模式樣式
    ↓
畫面更新 <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/sparkle-duotone.svg" width="16" height="16" align="center" />
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/lightbulb-duotone.svg" width="20" height="20" align="center" /> 重點總結

### React Hooks

- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> `useState` - 管理元件狀態
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> `useEffect` - 處理副作用（DOM 操作、localStorage）
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> `useContext` - 讀取 Context 值

### Context API

- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> `createContext` - 建立 Context
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> `Provider` - 提供值給子元件
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 不需要 props drilling（逐層傳遞）

### 資料流向

```
ThemeProvider (提供者)
    ↓ Context
任何子元件 (消費者) 使用 useTheme()
    ↓
讀取 theme、呼叫 setTheme
    ↓
狀態更新 → 觸發 useEffect → 更新 DOM
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/rocket-duotone.svg" width="20" height="20" align="center" /> 進階概念

### 1. LocalStorage 持久化

```typescript
// 儲存
localStorage.setItem("theme", "dark");

// 讀取
const savedTheme = localStorage.getItem("theme");

// 刪除
localStorage.removeItem("theme");
```

### 2. 系統主題偵測

```typescript
// 偵測作業系統是否使用深色模式
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// 監聽系統主題變更
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    console.log("系統主題變更為：", e.matches ? "dark" : "light");
  });
```

### 3. TypeScript 型別保護

```typescript
// 使用聯合型別限制可能的值
type Theme = "dark" | "light" | "system";

// 這樣寫會報錯
setTheme("blue"); // ❌ 型別 '"blue"' 不可指派給型別 'Theme'

// 只能使用定義的值
setTheme("dark"); // ✅
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/books-duotone.svg" width="20" height="20" align="center" /> 相關資源

- [React Context 官方文檔](https://react.dev/reference/react/createContext)
- [useEffect 完整指南](https://react.dev/reference/react/useEffect)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [localStorage API](https://developer.mozilla.org/zh-TW/docs/Web/API/Window/localStorage)

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="20" height="20" align="center" /> 檢查清單

- [ ] 理解 Context API 的作用
- [ ] 知道如何使用 useContext Hook
- [ ] 了解 useEffect 的執行時機
- [ ] 掌握 localStorage 的基本操作
- [ ] 能夠在 Tailwind CSS 中使用 dark: 前綴
- [ ] 理解解構賦值和預設參數
- [ ] 知道型別定義的重要性

---

**最後更新**：2026年3月11日
