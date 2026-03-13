# Config - 應用程式配置管理

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/book-open-duotone.svg" width="20" height="20" align="center" /> 功能概述

Config 是一個集中管理應用程式常數和配置的模組。它包含了天氣 API、地圖和應用程式全域設定，讓您能夠在單一位置管理所有配置參數。

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/target-duotone.svg" width="20" height="20" align="center" /> 核心概念

### 1. 集中式配置管理

**為什麼需要配置文件？**

- 將所有常數集中在一個地方，方便維護
- 避免在程式碼中散落 "魔術數字" (Magic Numbers)
- 便於修改預設值，不需要搜尋整個專案
- 提供型別安全，IDE 會自動提示可用的配置

**分散配置（❌ 不好）：**

```typescript
// 在 MapComponent.tsx
const zoom = 12.5;
const center = [-84.4096729, 40.2338211];

// 在 WeatherService.ts
const limit = 5;
const unit = "metric";

// 在 SettingsPage.tsx
const tempUnit = "°C";
```

**集中配置（✅ 好）：**

```typescript
// 在 config/Index.ts
export const MAPBOX = {
  DEFAULTS: { ZOOM: 12.5, CENTER: [...] }
};

// 在任何地方使用
import { MAPBOX } from '@/config';
const zoom = MAPBOX.DEFAULTS.ZOOM;
```

---

### 2. TypeScript `as const` 斷言

**什麼是 `as const`？**

- 將物件轉換為唯讀常數
- 防止意外修改配置值
- 讓 TypeScript 推斷更精確的型別

**範例對比：**

```typescript
// 沒有 as const
const config = {
  unit: "metric", // 型別：string
};
config.unit = "imperial"; // ✅ 可以修改

// 有 as const
const config = {
  unit: "metric", // 型別：字面量 "metric"
} as const;
config.unit = "imperial"; // ❌ 錯誤：無法修改唯讀屬性
```

**好處：**

- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 編譯時錯誤檢查
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 更好的 IDE 自動完成
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 防止意外修改常數

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/wrench-duotone.svg" width="20" height="20" align="center" /> 完整配置解析

### 第 1 部分：WEATHER_API - 天氣 API 配置

```typescript
export const WEATHER_API = {
  DEFAULTS: {
    LATITUDE: 40.2338211, // 預設緯度
    LONGITUDE: -84.4096729, // 預設經度
    UNIT: "metric", // 單位系統
    LANG: "en", // 語言
    SEARCH_RESULT_LIMIT: 5, // 搜尋結果上限
  },
} as const;
```

#### 參數說明

| 參數                  | 型別   | 說明                       | 範例值             |
| --------------------- | ------ | -------------------------- | ------------------ |
| `LATITUDE`            | number | 緯度（-90 到 90）          | `25.0330`（台北）  |
| `LONGITUDE`           | number | 經度（-180 到 180）        | `121.5654`（台北） |
| `UNIT`                | string | `"metric"` 或 `"imperial"` | `"metric"`         |
| `LANG`                | string | ISO 639-1 語言代碼         | `"zh_tw"`, `"en"`  |
| `SEARCH_RESULT_LIMIT` | number | 最多顯示幾筆搜尋結果       | `5`                |

#### 使用範例

```typescript
import { WEATHER_API } from "@/config";

// 讀取預設位置
const defaultLat = WEATHER_API.DEFAULTS.LATITUDE;
const defaultLon = WEATHER_API.DEFAULTS.LONGITUDE;

// 呼叫天氣 API
const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${defaultLat}&lon=${defaultLon}&units=${WEATHER_API.DEFAULTS.UNIT}`;

// 搜尋城市時限制結果數量
const searchUrl = `https://api.openweathermap.org/geo/1.0/direct?q=Taipei&limit=${WEATHER_API.DEFAULTS.SEARCH_RESULT_LIMIT}`;
```

---

### 第 2 部分：MAPBOX - 地圖配置

```typescript
export const MAPBOX = {
  DEFAULTS: {
    CENTER: [
      WEATHER_API.DEFAULTS.LONGITUDE,
      WEATHER_API.DEFAULTS.LATITUDE,
    ] as LngLatLike,
    ZOOM: 12.5,
  },
} as const;
```

#### 參數說明

| 參數     | 型別             | 說明                      | 範例值                |
| -------- | ---------------- | ------------------------- | --------------------- |
| `CENTER` | [number, number] | 地圖中心點 `[經度, 緯度]` | `[121.5654, 25.0330]` |
| `ZOOM`   | number           | 縮放等級（0-22）          | `12.5`                |

#### ⚠️ 重要注意事項

**Mapbox 使用 [經度, 緯度] 順序**，與一般習慣相反！

```typescript
// ❌ 錯誤
const center = [lat, lon]; // 緯度在前

// ✅ 正確（Mapbox 格式）
const center = [lon, lat]; // 經度在前
```

#### 縮放等級參考

| ZOOM 值 | 視覺效果  |
| ------- | --------- |
| 0-2     | 世界地圖  |
| 5-8     | 國家/省份 |
| 10-12   | 城市      |
| 13-15   | 街道      |
| 16-18   | 建築物    |
| 19+     | 詳細街景  |

#### 使用範例

```typescript
import { MAPBOX } from "@/config";
import mapboxgl from "mapbox-gl";

// 初始化 Mapbox 地圖
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: MAPBOX.DEFAULTS.CENTER, // [經度, 緯度]
  zoom: MAPBOX.DEFAULTS.ZOOM,
});

// 飛行到新位置
map.flyTo({
  center: [121.5654, 25.033], // 台北
  zoom: MAPBOX.DEFAULTS.ZOOM,
});
```

---

### 第 3 部分：APP - 應用程式全域配置

```typescript
export const APP = {
  STORE_KEY: {
    LATITUDE: "dethveiler-latitude",
    LONGITUDE: "dethveiler-longitude",
    UNIT: "dethveiler-unit",
  },
} as const;

// 單位顯示格式已移至 Unit.ts 中的 UNITS 配置
// 請參考 Unit.md 文檔
```

#### 3.1 STORE_KEY - localStorage 鍵名

**用途**：定義儲存使用者偏好設定的 key 名稱

| 鍵名        | 儲存內容             | 範例值       |
| ----------- | -------------------- | ------------ |
| `LATITUDE`  | 使用者選擇的緯度     | `"25.0330"`  |
| `LONGITUDE` | 使用者選擇的經度     | `"121.5654"` |
| `UNIT`      | 使用者偏好的單位系統 | `"metric"`   |

**使用範例**：

```typescript
import { APP } from "@/config";

// 儲存使用者位置
function saveUserLocation(lat: number, lon: number) {
  localStorage.setItem(APP.STORE_KEY.LATITUDE, lat.toString());
  localStorage.setItem(APP.STORE_KEY.LONGITUDE, lon.toString());
}

// 讀取使用者位置
function getUserLocation() {
  const lat = localStorage.getItem(APP.STORE_KEY.LATITUDE);
  const lon = localStorage.getItem(APP.STORE_KEY.LONGITUDE);

  if (lat && lon) {
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
  }

  // 如果沒有儲存，使用預設值
  return {
    lat: WEATHER_API.DEFAULTS.LATITUDE,
    lon: WEATHER_API.DEFAULTS.LONGITUDE,
  };
}

// 儲存單位偏好
function saveUnitPreference(unit: "metric" | "imperial") {
  localStorage.setItem(APP.STORE_KEY.UNIT, unit);
}
```

---

#### 3.2 UNIT - 單位顯示格式

> ⚠️ **重要更新**：單位顯示格式已從 `APP.UNIT` 移至 `Unit.ts` 中的 `UNITS` 配置，請參考 [Unit.md](./Unit.md) 文檔。

**新的使用方式**：

```typescript
import { UNITS, formatWithUnit } from '@/config/Unit';
import type { UnitSystem } from '@/config/Unit';

// 動態顯示溫度
function formatTemperature(value: number, unit: UnitSystem) {
  return formatWithUnit(value, 'TEMPERATURE', unit);
}

console.log(formatTemperature(25, "metric"));    // "25.0°C"
console.log(formatTemperature(77, "imperial"));  // "77.0°F"

// 格式化風速
function formatWindSpeed(value: number, unit: UnitSystem) {
  return formatWithUnit(value, 'WIND_SPEED', unit);
}

console.log(formatWindSpeed(5, "metric"));    // "5.0 m/s"
console.log(formatWindSpeed(11, "imperial")); // "11.0 mph"

// 在 React 元件中使用
function WeatherDisplay({ temp, unit }: { temp: number, unit: UnitSystem }) {
  return (
    <div>
      <span className="text-4xl">{temp}</span>
      <span className="text-xl">{UNITS.TEMPERATURE[unit]}</span>
    </div>
  );
}
```

**舊的 APP.UNIT 對照表**：

| 舊的 API                 | 新的 API                     |
| ------------------------ | ---------------------------- |
| `APP.UNIT.TEMP.metric`   | `UNITS.TEMPERATURE.metric`   |
| `APP.UNIT.TEMP.imperial` | `UNITS.TEMPERATURE.imperial` |
| `APP.UNIT.WIND.metric`   | `UNITS.WIND_SPEED.metric`    |
| `APP.UNIT.WIND.imperial` | `UNITS.WIND_SPEED.imperial`  |

更多單位類型（氣壓、降雨量、日照量等）請參考 [Unit.md](./Unit.md)。

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/note-pencil-duotone.svg" width="20" height="20" align="center" /> 完整實戰範例

### 範例 1：初始化應用程式

```typescript
import { WEATHER_API, MAPBOX, APP } from "@/config";

function initializeApp() {
  // 1️⃣ 檢查是否有儲存的位置
  const savedLat = localStorage.getItem(APP.STORE_KEY.LATITUDE);
  const savedLon = localStorage.getItem(APP.STORE_KEY.LONGITUDE);

  // 2️⃣ 使用儲存的位置或預設位置
  const lat = savedLat ? parseFloat(savedLat) : WEATHER_API.DEFAULTS.LATITUDE;
  const lon = savedLon ? parseFloat(savedLon) : WEATHER_API.DEFAULTS.LONGITUDE;

  // 3️⃣ 初始化地圖
  const map = initMap([lon, lat], MAPBOX.DEFAULTS.ZOOM);

  // 4️⃣ 獲取天氣資料
  fetchWeatherData(lat, lon);
}
```

### 範例 2：處理使用者搜尋

```typescript
import { WEATHER_API } from "@/config";
import axios from "axios";

async function searchCity(cityName: string) {
  // 使用配置中的搜尋結果上限
  const url = `https://api.openweathermap.org/geo/1.0/direct`;
  const params = {
    q: cityName,
    limit: WEATHER_API.DEFAULTS.SEARCH_RESULT_LIMIT, // 最多 5 筆
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
  };

  const response = await axios.get(url, { params });
  return response.data;
}
```

### 範例 3：切換單位系統

```typescript
import { APP } from '@/config';
import { UNITS } from '@/config/Unit';
import { useState } from 'react';

function SettingsPanel() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const handleUnitChange = (newUnit: "metric" | "imperial") => {
    // 更新狀態
    setUnit(newUnit);

    // 儲存到 localStorage
    localStorage.setItem(APP.STORE_KEY.UNIT, newUnit);

    // 重新獲取天氣資料
    fetchWeatherData(lat, lon, newUnit);
  };

  return (
    <div>
      <button onClick={() => handleUnitChange("metric")}>
        公制 ({UNITS.TEMPERATURE.metric})
      </button>
      <button onClick={() => handleUnitChange("imperial")}>
        英制 ({UNITS.TEMPERATURE.imperial})
      </button>
    </div>
  );
}
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/lightbulb-duotone.svg" width="20" height="20" align="center" /> 重點總結

### 配置結構

- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> `WEATHER_API` - 天氣 API 的預設參數
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> `MAPBOX` - 地圖的初始設定
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> `APP` - localStorage 鍵名和單位格式

### 最佳實踐

- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 始終從配置文件匯入常數，不要寫死在程式碼中
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 使用 `as const` 確保配置不被意外修改
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 利用 TypeScript 型別推斷獲得更好的開發體驗
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 記住 Mapbox 使用 `[經度, 緯度]` 順序

### 修改配置

```typescript
// ✅ 正確：修改配置文件中的值
export const WEATHER_API = {
  DEFAULTS: {
    LATITUDE: 25.033, // 改成台北
    LONGITUDE: 121.5654,
    // ...
  },
} as const;

// ❌ 錯誤：不要在程式碼中覆寫
import { WEATHER_API } from "@/config";
WEATHER_API.DEFAULTS.LATITUDE = 25.033; // 錯誤！as const 防止修改
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/rocket-duotone.svg" width="20" height="20" align="center" /> 進階概念

### 1. 型別推斷增強

```typescript
// TypeScript 會精確推斷型別
type UnitType = typeof WEATHER_API.DEFAULTS.UNIT; // "metric"
type TempUnit = keyof typeof UNITS.TEMPERATURE; // "metric" | "imperial"

// 創建型別安全的函數（使用 Unit.ts 中的輔助函數）
import { getUnit } from "@/config/Unit";

const tempSymbol = getUnit("TEMPERATURE", "metric"); // "°C"
const windSymbol = getUnit("WIND_SPEED", "imperial"); // "mph"
```

### 2. 環境變數整合

```typescript
// 在 config/Index.ts 中加入
export const API_KEYS = {
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  MAPBOX: import.meta.env.VITE_MAPBOX_TOKEN,
} as const;

// 使用時
import { API_KEYS } from "@/config";
const url = `${baseUrl}?appid=${API_KEYS.OPENWEATHER}`;
```

### 3. 擴展配置結構

如果需要新增配置，遵循相同模式：

```typescript
// 新增更多單位類型
export const APP = {
  // ... 現有配置
  UNIT: {
    TEMP: {
      /* ... */
    },
    WIND: {
      /* ... */
    },
    // 新增：氣壓單位
    PRESSURE: {
      metric: "hPa",
      imperial: "inHg",
    },
    // 新增：降雨量單位
    PRECIPITATION: {
      metric: "mm",
      imperial: "in",
    },
  },
} as const;
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/books-duotone.svg" width="20" height="20" align="center" /> 相關資源

- [TypeScript const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
- [Mapbox GL JS 文檔](https://docs.mapbox.com/mapbox-gl-js/api/)
- [OpenWeather API 文檔](https://openweathermap.org/api)
- [localStorage API](https://developer.mozilla.org/zh-TW/docs/Web/API/Window/localStorage)

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="20" height="20" align="center" /> 檢查清單

- [ ] 理解為什麼需要集中配置管理
- [ ] 知道 `as const` 的作用和好處
- [ ] 記住 Mapbox 使用 [經度, 緯度] 順序
- [ ] 掌握 localStorage 的基本操作
- [ ] 能夠根據單位系統顯示正確的符號
- [ ] 了解如何擴展配置結構
- [ ] 知道如何正確修改配置值

---

**最後更新**：2026年3月12日
