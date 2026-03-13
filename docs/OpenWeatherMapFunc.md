# OpenWeatherMapFunc - 天氣資料狀態功能

> OpenWeatherMap Provider、Context、Hook 與初始化載入流程

---

## <img src="./docIconImg/book-open-duotone.svg" width="20" height="20" align="center" /> Overview 功能概述

這個功能由 3 個檔案組成：

- `src/components/featureOpenWeatherMap/OpenWeatherMapContext.ts`：定義 Context 與型別
- `src/components/featureOpenWeatherMap/OpenWeatherMapProvider.tsx`：管理天氣資料查詢與狀態
- `src/hooks/useWeather.tsx`：提供元件使用 `weather` / `setWeather`

它的責任是把「目前選擇位置 + 目前單位」對應的天氣資料集中管理，並提供給整個 UI 使用。

---

## <img src="./docIconImg/target-duotone.svg" width="20" height="20" align="center" /> Core Concepts 核心概念

### 1. Context 與 Provider 分檔

因為 Vite Fast Refresh 只希望 `.tsx` 檔案主要 export React component，所以 `OpenWeatherMapContext` 被拆到獨立檔案。

```typescript
export const OpenWeatherMapContext =
  createContext<WeatherProviderState>(initialState);
```

這樣 `OpenWeatherMapProvider.tsx` 就只負責 export Provider 元件。

### 2. Provider 一次整合兩支 API

`setWeather` 最後對外暴露的是 `getWeather`，它內部會做兩件事：

1. 呼叫 `getOneCallWeather` 取得完整天氣資料
2. 呼叫 `getReverseGeocoding` 依經緯度反查地名

最後再把兩份資料組成統一的 `Weather` state。

### 3. localStorage 作為 fallback

Provider 不在 render 階段先建立 `defaultLat` / `defaultLon` 變數，而是在 callback 內部讀取 localStorage：

```typescript
const lat =
  params.lat ??
  (Number(localStorage.getItem(APP.STORE_KEY.LATITUDE)) ||
    OPENWEATHERMAP_API.DEFAULTS.LATITUDE);
```

這樣可以避免 callback 依賴因 render 而改變，進而造成 `useEffect` 重跑。

### 4. 開發模式的重複請求

在 `main.tsx` 有包 `StrictMode` 時，初始載入會看到：

- `onecall` 2 次
- `reverse` 2 次

這是 React 開發模式的 double invoke，不是正式環境的真實行為。正式 build 只會是 1 次 `getWeather({})`，也就是 2 支 API。

---

## <img src="./docIconImg/wrench-duotone.svg" width="20" height="20" align="center" /> Code Walkthrough 程式碼解析

### Context 型別

```typescript
export type WeatherStateParam = {
  lat?: number;
  lon?: number;
  unit?: UnitSystem;
};

export type WeatherProviderState = {
  weather: Weather | null;
  setWeather: (weather: WeatherStateParam) => void;
};
```

`setWeather` 不直接收完整 weather 物件，而是收查詢條件，讓 Provider 自己決定如何重抓資料。

### Provider 初始化

```typescript
useEffect(() => {
  (async () => await getWeather({}))();
}, [getWeather]);
```

初始載入時，Provider 會使用：

- `params` 傳入值
- 或 localStorage 已保存的位置 / 單位
- 或 `OPENWEATHERMAP_API.DEFAULTS`

三層 fallback 來決定查詢參數。

### Hook 使用方式

```typescript
export const useWeather = () => {
  const context = useContext(OpenWeatherMapContext);
  if (!context) {
    throw new Error("useWeather must be used within an OpenWeatherMapProvider");
  }
  return context;
};
```

注意 `useContext` 要吃的是 `OpenWeatherMapContext`，不是 `OpenWeatherMapProvider` 元件本身。

---

## <img src="./docIconImg/note-pencil-duotone.svg" width="20" height="20" align="center" /> Usage 使用方式

```typescript
import { ThemeProvider } from "@/components/themeFunc/ThemeProvider";
import { OpenWeatherMapProvider } from "@/components/featureOpenWeatherMap/OpenWeatherMapProvider";

export const App = () => {
  return (
    <ThemeProvider>
      <OpenWeatherMapProvider>
        <TopAppBar />
      </OpenWeatherMapProvider>
    </ThemeProvider>
  );
};
```

任何需要讀取或更新天氣資料的元件，都透過 `useWeather()` 取用。

---

## <img src="./docIconImg/lightbulb-duotone.svg" width="20" height="20" align="center" /> Key Points 重點總結

- Provider 內部整合 `onecall` 與 `reverse geocoding`，對外只暴露一個 `setWeather`
- Context 必須獨立檔案，避免 Fast Refresh 警告
- localStorage fallback 要放在 callback 內部，避免 effect 依賴鏈震盪
- 開發模式看到 4 次請求是 `StrictMode` 行為，不是 API 重複實作錯誤
