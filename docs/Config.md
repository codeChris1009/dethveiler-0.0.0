# Config - 應用程式配置管理

> 專案目前使用的 config 常數、預設值與 localStorage key

---

## <img src="./docIconImg/book-open-duotone.svg" width="20" height="20" align="center" /> Overview 功能概述

目前主要配置集中在 `src/config/index.ts`，並由它重新匯出：

- `OPENWEATHERMAP_API`
- `MAPBOX`
- `APP`
- `UNITS` / `UNIT_SYSTEM` / `getUnit` 等單位工具

這樣元件只需要從 `@/config` 匯入，不必分別記多個檔案路徑。

---

## <img src="./docIconImg/target-duotone.svg" width="20" height="20" align="center" /> Core Concepts 核心概念

### 1. `OPENWEATHERMAP_API`

```typescript
export const OPENWEATHERMAP_API = {
  ENDPOINTS: {
    GEOCODING: "http://api.openweathermap.org/geo/1.0/direct",
    REVERSE_GEOCODING: "http://api.openweathermap.org/geo/1.0/reverse",
    ONECALL: "https://api.openweathermap.org/data/3.0/onecall",
  },
  DEFAULTS: {
    LATITUDE: 25.0338,
    LONGITUDE: 121.5654,
    UNIT: UNIT_SYSTEM.METRIC,
    LANG: "en",
    SEARCH_RESULT_LIMIT: 5,
  },
} as const;
```

這是目前天氣資料相關的唯一配置來源。

### 2. `MAPBOX`

```typescript
export const MAPBOX = {
  DEFAULTS: {
    CENTER: [
      OPENWEATHERMAP_API.DEFAULTS.LONGITUDE,
      OPENWEATHERMAP_API.DEFAULTS.LATITUDE,
    ] as LngLatLike,
    ZOOM: 12.5,
  },
} as const;
```

Mapbox 仍然使用 `[經度, 緯度]` 順序，不是 `[緯度, 經度]`。

### 3. `APP.STORE_KEY`

```typescript
export const APP = {
  STORE_KEY: {
    LATITUDE: "dethveiler-latitude",
    LONGITUDE: "dethveiler-longitude",
    UNIT: "dethveiler-unit",
  },
} as const;
```

目前 `SearchDialog`、`UnitDropdown`、`OpenWeatherMapProvider` 都會讀寫這些 key。

---

## <img src="./docIconImg/note-pencil-duotone.svg" width="20" height="20" align="center" /> Usage 使用方式

### 讀取預設查詢位置

```typescript
import { OPENWEATHERMAP_API } from "@/config";

const lat = OPENWEATHERMAP_API.DEFAULTS.LATITUDE;
const lon = OPENWEATHERMAP_API.DEFAULTS.LONGITUDE;
```

### 讀取搜尋限制

```typescript
const limit = OPENWEATHERMAP_API.DEFAULTS.SEARCH_RESULT_LIMIT;
```

### 儲存使用者位置與單位

```typescript
import { APP } from "@/config";

localStorage.setItem(APP.STORE_KEY.LATITUDE, String(lat));
localStorage.setItem(APP.STORE_KEY.LONGITUDE, String(lon));
localStorage.setItem(APP.STORE_KEY.UNIT, unit);
```

### 匯入方式

```typescript
import { APP, MAPBOX, OPENWEATHERMAP_API, UNIT_SYSTEM } from "@/config";
```

---

## <img src="./docIconImg/lightbulb-duotone.svg" width="20" height="20" align="center" /> Key Points 重點總結

- 目前文件中的正確名稱是 `OPENWEATHERMAP_API`，不是 `WEATHER_API`
- `REVERSE_GEOCODING` 已是正式配置的一部分
- 單位預設值透過 `UNIT_SYSTEM` 提供，不再手寫 `"metric"`
- localStorage key 全部集中在 `APP.STORE_KEY`
