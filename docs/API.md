# API 服務層導覽

本文件為 Dethveiler 專案 API 服務層的總覽與快速導航。

## <img src="./docIconImg/folders-duotone.svg" width="20" height="20" align="center" /> File Structure 文件結構

```
docs/
├── API.md                    # 本文件（API 服務層導覽）
└── apis/
    └── OpenWeatherMap.md     # OpenWeatherMap API 詳細教學
```

---

## <img src="./docIconImg/cube-duotone.svg" width="20" height="20" align="center" /> Architecture Overview 架構概覽

### 程式碼結構

```
src/api/
├── client.ts             # HTTP 客戶端配置（統一的 axios 實例）
├── index.ts              # 統一入口，匯出所有 API 函數和錯誤處理
└── OpenWeatherMap.ts     # OpenWeatherMap API 專用模組
```

### 設計理念

- **單一職責**：每個 API 模組只負責對應的 API 提供商
- **統一客戶端**：所有 API 使用相同的 `apiClient` 實例，確保配置一致
- **避免循環依賴**：將 `apiClient` 獨立到 `client.ts`，避免模組間循環引用
- **統一入口**：透過 `index.ts` 統一匯出，方便使用者匯入
- **易於擴展**：未來可輕鬆加入其他 API 提供商（如 NASA POWER API、Mapbox API 等）

### HTTP 客戶端配置（client.ts）

`client.ts` 負責建立和配置統一的 axios 實例，所有 API 模組都使用此實例發送請求。

**主要功能**：

- 統一的 timeout 設定（10 秒）
- 統一的 headers 配置
- 請求/響應攔截器（可擴展）
- 便於單元測試 mock

**使用方式**：

```typescript
// ✅ 在 API 模組中使用
import { apiClient } from "./client";

const response = await apiClient.get(url, { params });
```

**攔截器擴展範例**：

```typescript
// 在 client.ts 中添加攔截器
apiClient.interceptors.request.use(
  (config) => {
    // 統一添加 token
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 記錄請求日誌
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    // 統一處理響應
    return response;
  },
  (error) => {
    // 統一錯誤處理
    if (error.response?.status === 401) {
      // 登出或刷新 token
    }
    return Promise.reject(error);
  },
);
```

### 統一錯誤處理（index.ts）

`index.ts` 提供 `handleApiError` 函數，用於統一處理所有 API 的錯誤。

**功能**：

- 根據 HTTP 狀態碼提供具體錯誤訊息
- 統一的錯誤記錄格式
- 類型安全的錯誤處理

**使用方式**：

```typescript
import { apiClient } from "./client";
import { handleApiError } from "./index";

try {
  const response = await apiClient.get(url);
  return response.data;
} catch (error) {
  return handleApiError(error, "getFunctionName");
}
```

### 使用方式

```typescript
// 【推薦】從統一入口匯入
import { getGeocoding, getCurrentWeather } from "@/api";

// 【不推薦】直接從模組匯入（除非有特殊需求）
import { getGeocoding } from "@/api/OpenWeatherMap";
```

---

## <img src="./docIconImg/cloud-sun-duotone.svg" width="20" height="20" align="center" /> API Providers API 提供商

### OpenWeatherMap API

**功能**：天氣資料與地理編碼

**詳細文件**：[OpenWeatherMap.md](./apis/OpenWeatherMap.md)

**提供的 API**：

- **Geocoding API** - 根據地點名稱搜尋經緯度座標
- **Reverse Geocoding API** - 根據經緯度反查地點名稱
- **One Call API 3.0** - 完整天氣資料（當前、分鐘級、小時級、每日預報、警報）

**主要函數**：

| 函數                  | 用途                   | 回傳資料                     |
| --------------------- | ---------------------- | ---------------------------- |
| `getGeocoding`        | 地理編碼搜尋           | 地點名稱 → 經緯度座標        |
| `getReverseGeocoding` | 反向地理編碼           | 經緯度 → 地點名稱            |
| `getOneCallWeather`   | 完整天氣資料（可客製） | 當前 + 預報 + 警報（可排除） |
| `getCurrentWeather`   | 僅當前天氣             | 即時溫度、濕度、風速等       |
| `getHourlyForecast`   | 48 小時預報            | 未來 2 天的小時級預報        |
| `getDailyForecast`    | 8 天預報               | 未來一週的每日預報           |
| `getFullWeather`      | 完整資料（不排除）     | 所有區塊（當前 + 所有預報）  |

## <img src="./docIconImg/gear-duotone.svg" width="20" height="20" align="center" /> Environment Setup 環境設定

### API Key 設定

所有 API 提供商都需要 API Key 才能使用。在專案根目錄建立 `.env` 檔案：

```bash
# API Keys
VITE_OPENWEATHER_API_KEY=your_openweather_key_here
# 未來可能加入其他 API Key
# VITE_NASA_POWER_API_KEY=your_nasa_key_here
```

**安全提示**：

- `.env` 已加入 `.gitignore`，不會提交到版本控制
- 請勿在程式碼中硬編碼 API Key
- 請勿分享或公開你的 API Key

### 取得 API Key

| API 提供商     | 註冊連結                                                 | 說明                    |
| -------------- | -------------------------------------------------------- | ----------------------- |
| OpenWeatherMap | [openweathermap.org/api](https://openweathermap.org/api) | One Call 3.0 需付費方案 |

---

## <img src="./docIconImg/key-duotone.svg" width="20" height="20" align="center" /> API Key Management API Key 管理

### 統一的 API Key 取得方法（getApiKey）

所有 API 模組都使用 `index.ts` 中的 `getApiKey` 共通方法來取得 API Key。

**設計理念**：

- ✅ **統一管理** - 所有 API 提供商使用同一個函數
- ✅ **參數化** - 透過參數指定不同的環境變數
- ✅ **錯誤提示清晰** - 顯示缺少哪個具體的 API Key
- ✅ **易於擴展** - 新增 API 提供商時直接復用

**函數定義（在 src/api/index.ts）**：

```typescript
/**
 * 統一的 API Key 取得函數
 * 適用於所有 API 提供商
 *
 * @param keyName - 環境變數名稱（如 'VITE_OPENWEATHER_API_KEY'）
 * @returns API Key 字串
 * @throws {Error} 當 API Key 不存在時拋出錯誤
 */
export const getApiKey = (keyName: string): string => {
  const apiKey = import.meta.env[keyName];

  if (!apiKey) {
    throw new Error(`Missing API Key: ${keyName}`);
  }

  return apiKey;
};
```

**在各 API 模組中使用**：

```typescript
// src/api/OpenWeatherMap.ts
import { getApiKey } from "./index";

// 定義環境變數名稱常數
const OWM_API_KEY = "VITE_OPENWEATHER_API_KEY";

// 在 API 呼叫中使用
const response = await apiClient.get(url, {
  params: {
    appid: getApiKey(OWM_API_KEY),
    // ... 其他參數
  },
});
```

**未來擴展範例**：

```typescript
// 未來新增其他 API 提供商時
const nasaKey = getApiKey("VITE_NASA_API_KEY");
const mapboxKey = getApiKey("VITE_MAPBOX_API_KEY");
```

---

## <img src="./docIconImg/warning-duotone.svg" width="20" height="20" align="center" /> FAQ and Notes 常見問題與注意事項

### ⚠️ 新手常見錯誤

#### 1. 環境變數名稱錯誤

❌ **錯誤**：

```bash
# .env
OPENWEATHER_API_KEY=your_key_here  # 缺少 VITE_ 前綴
```

✅ **正確**：

```bash
# .env
VITE_OPENWEATHER_API_KEY=your_key_here  # 必須以 VITE_ 開頭
```

**原因**：在 Vite 中，只有以 `VITE_` 開頭的環境變數才會暴露給客戶端代碼。

#### 2. .env 檔案位置錯誤

❌ **錯誤**：

```
src/
  └── .env           # 錯誤：不應該放在 src/ 裡面
```

✅ **正確**：

```
dethveiler-0.0.0/    # 專案根目錄
├── .env             # ✅ 正確位置
├── package.json
├── vite.config.ts
└── src/
```

**規則**：`.env` 必須放在**專案根目錄**（與 `package.json` 同一層）。

#### 3. 修改 .env 後未重啟開發伺服器

❌ **錯誤情境**：

1. 創建或修改 `.env` 檔案
2. 直接刷新瀏覽器
3. 發現 API Key 還是讀不到 ❌

✅ **正確流程**：

1. 創建或修改 `.env` 檔案
2. **停止開發伺服器**（Ctrl+C）
3. **重新啟動**：`npm run dev`
4. 瀏覽器會自動刷新 ✅

**原因**：Vite 只在**啟動時**讀取環境變數，運行中修改不會生效。

#### 4. API Key 使用引號包裹

❓ **疑問**：API Key 需要用引號包著嗎？

✅ **答案**：通常**不需要**

```bash
# ✅ 推薦（不用引號）
VITE_OPENWEATHER_API_KEY=abc123def456ghi789

# ✅ 也可以（但沒必要）
VITE_OPENWEATHER_API_KEY="abc123def456ghi789"
```

**何時需要引號？**

只有當值包含**空格**或**特殊字符**時：

```bash
APP_NAME="My Weather App"  # 有空格，需要引號
DATABASE_URL="postgresql://user:pass@localhost:5432/db"  # 有特殊字符
```

#### 5. .env 檔案被提交到 Git

❌ **危險**：`.env` 包含敏感資訊，絕對不能提交到版本控制！

**檢查方式**：

```bash
# 確認 .gitignore 包含 .env
cat .gitignore | grep "\.env"
```

**應該看到**：

```
.env
.env.local
.env.*.local
```

**如果不小心提交了**：

```bash
# 從 Git 歷史中移除（謹慎操作！）
git rm --cached .env
git commit -m "Remove .env from git history"

# 然後立即更換 API Key（因為已經洩露）
```

---

## <img src="./docIconImg/book-open-text-duotone.svg" width="20" height="20" align="center" /> General Best Practices 通用最佳實踐

以下是跨所有 API 提供商都適用的開發實踐，透過實作這些模式可以提升應用效能、使用者體驗和程式碼品質。

---

### 1. 快取機制（Caching）

#### 為什麼需要快取？

- **減少 API 呼叫次數**：避免重複請求相同資料，節省配額和成本
- **提升回應速度**：從快取讀取資料比網路請求快得多
- **降低伺服器負載**：減少對 API 提供商的壓力
- **離線體驗**：即使網路暫時中斷，仍可顯示快取資料

#### 實作方式：使用 localStorage

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * 快取工具類別
 * 適用於任何類型的 API 資料
 */
class ApiCache {
  private static readonly PREFIX = "api_cache_";

  /**
   * 儲存資料到快取
   * @param key 快取鍵值（建議包含 API 名稱和參數）
   * @param data 要快取的資料
   */
  static set<T>(key: string, data: T): void {
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(cacheEntry));
  }

  /**
   * 從快取讀取資料
   * @param key 快取鍵值
   * @param maxAge 快取有效期（毫秒），預設 10 分鐘
   * @returns 快取資料或 null（資料不存在或已過期）
   */
  static get<T>(key: string, maxAge: number = 10 * 60 * 1000): T | null {
    const cached = localStorage.getItem(`${this.PREFIX}${key}`);
    if (!cached) return null;

    try {
      const entry: CacheEntry<T> = JSON.parse(cached);
      const age = Date.now() - entry.timestamp;

      if (age < maxAge) {
        return entry.data;
      } else {
        // 快取過期，清除資料
        this.remove(key);
        return null;
      }
    } catch (error) {
      console.error("快取解析錯誤：", error);
      this.remove(key);
      return null;
    }
  }

  /**
   * 移除特定快取
   */
  static remove(key: string): void {
    localStorage.removeItem(`${this.PREFIX}${key}`);
  }

  /**
   * 清除所有 API 快取
   */
  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}
```

#### 使用範例

```typescript
interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
}

/**
 * 帶快取的 API 呼叫包裝函數
 */
async function fetchWeatherWithCache(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  // 生成快取鍵值（包含座標資訊）
  const cacheKey = `weather_${lat}_${lon}`;

  // 嘗試從快取讀取
  const cached = ApiCache.get<WeatherData>(cacheKey, 15 * 60 * 1000); // 15 分鐘
  if (cached) {
    console.log("✅ 使用快取資料");
    return cached;
  }

  // 快取不存在，呼叫 API
  console.log("🌐 呼叫 API 取得新資料");
  const freshData = await fetchWeatherFromApi(lat, lon);

  // 儲存到快取
  ApiCache.set(cacheKey, freshData);

  return freshData;
}

// 在元件中使用
function WeatherDisplay({ lat, lon }: { lat: number; lon: number }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeatherWithCache(lat, lon).then(setWeather);
  }, [lat, lon]);

  // ... 渲染邏輯
}
```

#### 進階技巧

```typescript
// 1. 根據資料類型設定不同的快取時間
const CACHE_CONFIG = {
  weather: 10 * 60 * 1000, // 天氣資料：10 分鐘
  location: 24 * 60 * 60 * 1000, // 地點資料：1 天
  static: 7 * 24 * 60 * 60 * 1000, // 靜態資料：7 天
};

// 2. 使用情境化的快取鍵值
const cacheKey = `${apiName}_${functionName}_${JSON.stringify(params)}`;

// 3. 手動清除過期快取（應用啟動時執行）
ApiCache.clear();
```

---

### 2. 防抖技術（Debounce）

#### 什麼是防抖？

防抖（Debounce）是一種限制函數執行頻率的技術。當使用者連續觸發事件時（如輸入文字），函數不會立即執行，而是等待使用者停止操作一段時間後才執行。

**常見應用場景**：

- 搜尋輸入框（使用者停止輸入後才搜尋）
- 視窗大小調整（resize 事件）
- 表單驗證

#### 防抖工具函數

```typescript
/**
 * 防抖工具函數
 * @param fn 要執行的函數
 * @param delay 延遲時間（毫秒）
 * @returns 防抖後的函數
 */
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    // 清除之前的計時器
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 設定新的計時器
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}
```

#### React Hook 版本

```typescript
import { useEffect, useState } from "react";

/**
 * 防抖 Hook
 * @param value 要防抖的值
 * @param delay 延遲時間（毫秒）
 * @returns 防抖後的值
 */
function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清除計時器（當 value 改變或元件卸載時）
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

#### 使用原生防抖函數的範例

```typescript
function LocationSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // 建立防抖搜尋函數（只建立一次）
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (searchQuery.length < 2) return;

        try {
          const locations = await searchLocations(searchQuery);
          setResults(locations);
        } catch (error) {
          console.error(error);
        }
      }, 500),
    [], // 空依賴陣列，確保只建立一次
  );

  // 當輸入改變時，呼叫防抖函數
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return <input type="text" value={query} onChange={handleInputChange} />;
}
```

#### 效能比較

```typescript
// ❌ 沒有防抖：使用者輸入 "Tokyo" 會觸發 5 次 API
// T -> To -> Tok -> Toky -> Tokyo (5 次 API 呼叫)

// ✅ 有防抖（500ms）：只在使用者停止輸入後觸發 1 次
// T -> To -> Tok -> Toky -> Tokyo -> [等待 500ms] -> API 呼叫 (1 次)
```

---

### 3. 載入狀態管理

#### 為什麼需要載入狀態？

良好的載入狀態管理能提供更好的使用者體驗：

- **視覺回饋**：讓使用者知道系統正在處理請求
- **防止重複提交**：載入期間禁用按鈕或表單
- **錯誤處理**：清楚顯示錯誤訊息和重試選項
- **空狀態處理**：處理沒有資料的情況

#### 標準三狀態模式

```typescript
/**
 * 標準 API 狀態管理模式
 */
type LoadingState = "idle" | "loading" | "success" | "error";

interface ApiState<T> {
  status: LoadingState;
  data: T | null;
  error: string | null;
}

function useApiData<T>(fetchFn: () => Promise<T>) {
  const [state, setState] = useState<ApiState<T>>({
    status: "idle",
    data: null,
    error: null,
  });

  const fetch = async () => {
    setState({ status: "loading", data: null, error: null });

    try {
      const data = await fetchFn();
      setState({ status: "success", data, error: null });
    } catch (error) {
      setState({
        status: "error",
        data: null,
        error: error instanceof Error ? error.message : "未知錯誤",
      });
    }
  };

  return { ...state, fetch };
}
```

#### 進階：可重用的 API Hook

```typescript
import { useState, useEffect } from "react";

interface UseApiOptions<T> {
  immediate?: boolean; // 是否立即執行
  onSuccess?: (data: T) => void; // 成功回調
  onError?: (error: Error) => void; // 錯誤回調
}

/**
 * 通用 API Hook
 * @param apiFunction API 函數
 * @param params API 參數
 * @param options 選項
 */
function useApi<T, P extends any[]>(
  apiFunction: (...params: P) => Promise<T>,
  params: P,
  options: UseApiOptions<T> = {},
) {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiFunction(...params);
      setData(result);

      if (onSuccess) onSuccess(result);

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("未知錯誤");
      setError(error);

      if (onError) onError(error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute, // 手動觸發
    refetch: execute, // 重新載入
  };
}
```

#### 使用通用 API Hook

```typescript
function WeatherCard({ locationId }: { locationId: string }) {
  const { data, loading, error, refetch } = useApi(
    fetchWeatherById,
    [locationId],
    {
      immediate: true,
      onSuccess: (weather) => {
        console.log("天氣資料載入成功：", weather);
      },
      onError: (error) => {
        console.error("載入失敗：", error.message);
      },
    },
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data) return <EmptyState />;

  return (
    <div>
      <h2>溫度：{data.temperature}°C</h2>
      <button onClick={refetch}>刷新</button>
    </div>
  );
}
```

#### 骨架屏（Skeleton）載入效果

```typescript
function SkeletonCard() {
  return (
    <div className="border rounded p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

function WeatherList() {
  const { data, loading } = useApi(fetchAllWeatherData, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return <div>{/* 渲染真實資料 */}</div>;
}
```

---

### 4. 統一單位顯示

#### 為什麼需要統一單位？

不同的 API 提供商可能使用不同的單位系統：

- **溫度**：攝氏度（°C）vs 華氏度（°F）
- **風速**：公尺/秒（m/s）vs 公里/小時（km/h）vs 英里/小時（mph）
- **降水量**：公釐（mm）vs 英寸（in）
- **氣壓**：百帕（hPa）vs 毫米汞柱（mmHg）

統一單位系統可以：

- **提升使用者體驗**：根據地區習慣顯示適當單位
- **簡化程式碼**：不需要在每個元件中轉換單位
- **易於維護**：集中管理單位格式化邏輯

#### 使用專案的單位系統

本專案提供了完整的單位系統工具，詳見 [Unit.md](./Unit.md)。

```typescript
import { formatWithUnit, convertAndFormat } from "@/config";
import type { UnitCategory, UnitSystem } from "@/types";

// 1. 格式化單一值（使用原始單位系統）
const temp = 25.5;
const formatted = formatWithUnit(temp, "TEMPERATURE", "metric");
console.log(formatted); // "25.5°C"

// 2. 轉換並格式化（公制 → 英制）
const tempF = convertAndFormat(temp, "TEMPERATURE", "metric", "imperial");
console.log(tempF); // "77.9°F"

// 3. 格式化風速
const windSpeed = 5.2;
const windFormatted = formatWithUnit(windSpeed, "WIND_SPEED", "metric");
console.log(windFormatted); // "5.2 m/s"
```

#### 建立統一格式化工具

```typescript
/**
 * API 資料格式化工具
 * 統一處理來自不同 API 的資料格式
 */
class DataFormatter {
  private unitSystem: UnitSystem;

  constructor(unitSystem: UnitSystem = "metric") {
    this.unitSystem = unitSystem;
  }

  /**
   * 格式化溫度
   */
  temperature(value: number, sourceUnit: UnitSystem = "metric"): string {
    return convertAndFormat(value, "TEMPERATURE", sourceUnit, this.unitSystem);
  }

  /**
   * 格式化風速
   */
  windSpeed(value: number, sourceUnit: UnitSystem = "metric"): string {
    return convertAndFormat(value, "WIND_SPEED", sourceUnit, this.unitSystem);
  }

  /**
   * 格式化濕度（百分比）
   */
  humidity(value: number): string {
    return `${value.toFixed(0)}%`;
  }

  /**
   * 格式化降水量
   */
  precipitation(value: number, sourceUnit: UnitSystem = "metric"): string {
    return convertAndFormat(
      value,
      "PRECIPITATION",
      sourceUnit,
      this.unitSystem,
    );
  }

  /**
   * 格式化氣壓
   */
  pressure(value: number): string {
    return `${value.toFixed(0)} hPa`;
  }

  /**
   * 切換單位系統
   */
  setUnitSystem(system: UnitSystem): void {
    this.unitSystem = system;
  }
}
```

---

## <img src="./docIconImg/link-duotone.svg" width="20" height="20" align="center" /> Related Documents 相關文件

### API 提供商文件

- [OpenWeatherMap API](./apis/OpenWeatherMap.md) - 天氣資料與地理編碼完整文件

### 專案配置文件

- [Config.md](./Config.md) - 應用程式配置管理
- [Unit.md](./Unit.md) - 單位系統與格式化工具

### 功能文件

- [Intro.md](./Intro.md) - 文件索引與導覽

---

## <img src="./docIconImg/lightbulb-duotone.svg" width="20" height="20" align="center" /> Development Guide 開發指南

### 新增 API 提供商

當需要整合新的 API 提供商時，請遵循以下步驟：

1. **建立 API 模組檔案**：在 `src/api/` 目錄下建立新檔案（如 `NasaPower.ts`）
2. **實作 API 函數**：遵循單一職責原則，只負責該 API 的相關功能
3. **匯出函數**：在 `src/api/index.ts` 中匯出新的 API 函數
4. **建立文件**：在 `docs/apis/` 目錄下建立對應的 `.md` 文件
5. **更新總覽**：在本文件中加入新 API 提供商的簡介

### 統一規範

所有 API 模組應遵循以下規範：

- **錯誤處理**：使用 try-catch 包裝所有 API 呼叫
- **類型定義**：在 `src/types/Index.tsx` 中定義相關類型
- **配置管理**：在 `src/config/Index.ts` 中集中管理 API 設定
- **文件完整性**：提供詳細的 JSDoc 註解和 Markdown 文件

---

## <img src="./docIconImg/warning-duotone.svg" width="20" height="20" align="center" /> FAQ 常見問題

### API Key 無效或失效

**問題**：收到 401 Unauthorized 錯誤

**解決方式**：

1. 檢查 `.env` 檔案中的 API Key 是否正確
2. 確認 API Key 的權限和訂閱方案
3. 確認環境變數名稱是否正確（需要 `VITE_` 前綴）

### API 呼叫次數超過限制

**問題**：收到 429 Too Many Requests 錯誤

**解決方式**：

1. 實作快取機制，減少重複呼叫
2. 使用防抖（debounce）技術，避免頻繁呼叫
3. 考慮升級 API 方案

### 跨域問題

**問題**：CORS 錯誤

**解決方式**：

- 大多數天氣 API 支援跨域請求
- 如遇到問題，可考慮使用後端代理
- 確認 API 提供商的文件說明

---

## <img src="./docIconImg/check-duotone.svg" width="20" height="20" align="center" /> Checklist 檢查清單

在開發使用 API 的功能前，請確認：

- [ ] 已取得並設定所需的 API Key
- [ ] 已建立 `.env` 檔案並正確設定環境變數
- [ ] 已閱讀對應 API 提供商的詳細文件
- [ ] 已實作錯誤處理機制
- [ ] 已考慮快取策略以減少 API 呼叫次數
- [ ] 已設計載入狀態和錯誤訊息顯示
- [ ] 已使用專案的單位系統統一顯示格式
