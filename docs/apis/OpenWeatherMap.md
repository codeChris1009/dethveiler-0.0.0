# OpenWeatherMap API 使用指南

本文件說明 OpenWeatherMap API 的具體使用方式和參數說明。

> **💡 架構說明**：關於 HTTP 客戶端配置（`client.ts`）、統一錯誤處理（`handleApiError`）等共通架構，請參考 [API.md - 架構概覽](../API.md#架構概覽)。

---

## <img src="../docIconImg/file-text-duotone.svg" width="20" height="20" align="center" /> Related Files 相關檔案

- **API 實作**：[src/api/OpenWeatherMap.ts](../../src/api/OpenWeatherMap.ts)
- **配置檔**：[src/config/WeatherMapAPI.ts](../../src/config/WeatherMapAPI.ts)
- **類型定義**：[src/types/Index.tsx](../../src/types/Index.tsx)

---

## <img src="../docIconImg/list-bullets-duotone.svg" width="20" height="20" align="center" /> Table of Contents 目錄

- [環境設定](#環境設定)
- [API 函數](#api-函數)
  - [getGeocoding](#getgeocoding)
  - [getReverseGeocoding](#getreversegeocoding)
  - [getOneCallWeather](#getonecallweather)
  - [getCurrentWeather](#getcurrentweather)
  - [getHourlyForecast](#gethourlyforecast)
  - [getDailyForecast](#getdailyforecast)
  - [getFullWeather](#getfullweather)
- [錯誤處理](#錯誤處理)
- [最佳實踐](#最佳實踐)

---

## <img src="../docIconImg/gear-duotone.svg" width="20" height="20" align="center" /> Environment Setup 環境設定

### 1. 取得 API Key

前往 [OpenWeather API](https://openweathermap.org/api) 註冊帳號並取得 API Key。

One Call API 3.0 需要訂閱付費方案，請參考官方定價資訊。

### 2. 設定環境變數

在專案根目錄建立 `.env` 檔案：

```bash
# .env
VITE_OPENWEATHER_API_KEY=你的_API_Key
```

⚠️ **重要安全提示**：

- `.env` 檔案已被加入 `.gitignore`，不會被提交到 Git
- 請勿將 API Key 硬編碼在程式碼中
- 請勿分享或公開你的 API Key

### 3. 匯入 API 函數

```typescript
// 從統一入口匯入
import {
  getGeocoding,
  getReverseGeocoding,
  getOneCallWeather,
  getCurrentWeather,
  getHourlyForecast,
  getDailyForecast,
  getFullWeather,
} from "@/api";
```

---

## <img src="../docIconImg/code-duotone.svg" width="20" height="20" align="center" /> API Functions API 函數

### getGeocoding

根據地點名稱搜尋地理位置資訊。

#### 函數簽章

```typescript
getGeocoding(query: string): Promise<Geocoding[]>
```

#### 參數

| 參數    | 類型     | 必填 | 說明                           |
| ------- | -------- | ---- | ------------------------------ |
| `query` | `string` | ✅   | 搜尋關鍵字（城市名稱、地點等） |

#### 回傳值

回傳 `Geocoding[]` 陣列，每個項目包含：

```typescript
interface Geocoding {
  name: string; // 地點名稱
  lat: number; // 緯度
  lon: number; // 經度
  country: string; // 國家代碼（ISO 3166）
  state?: string; // 州/省名稱（如有）
}
```

#### 使用範例

```typescript
// 搜尋 "Taipei"
const locations = await getGeocoding("Taipei");

// 回傳結果範例：
// [
//   {
//     name: "Taipei",
//     lat: 25.0375,
//     lon: 121.5625,
//     country: "TW"
//   },
//   // ... 最多 5 筆結果
// ]

// 使用第一個結果
if (locations.length > 0) {
  const { lat, lon, name } = locations[0];
  console.log(`${name}: ${lat}, ${lon}`);
}
```

#### 注意事項

- 預設最多回傳 5 筆結果（可在 `Config.ts` 的 `SEARCH_RESULT_LIMIT` 調整）
- 搜尋不區分大小寫
- 可使用城市名稱、州/省名稱、國家代碼等進行搜尋
- 範例：`"Taipei"`, `"Tokyo,JP"`, `"New York,NY,US"`

---

### getReverseGeocoding

根據經緯度反查地點名稱。

#### 函數簽章

```typescript
getReverseGeocoding(lat: number, lon: number, limit?: number): Promise<Geocoding[]>
```

#### 使用範例

```typescript
const locations = await getReverseGeocoding(40.7127281, -74.0060152, 1);
const location = locations[0] ?? null;

if (location) {
  console.log(`${location.name}, ${location.country}`);
}
```

#### 實際用途

這支 API 目前主要由 `OpenWeatherMapProvider` 使用。

流程是：

1. 先用 `onecall` 取得天氣資料
2. 再用 `reverse geocoding` 把經緯度轉成人類可讀的位置名稱
3. 組成完整 `weather` state 後提供給 UI

---

### getOneCallWeather

取得指定位置的完整天氣資料（One Call API 3.0）。

#### 函數簽章

```typescript
getOneCallWeather(params: OneCallParams): Promise<OneCallWeatherRes>
```

#### 參數

```typescript
interface OneCallParams {
  lat: number; // 緯度（必填）
  lon: number; // 經度（必填）
  exclude?: Array<
    // 排除的資料區塊（可選）
    "current" | "minutely" | "hourly" | "daily" | "alerts"
  >;
  units?: "metric" | "imperial"; // 單位系統（可選，預設：metric）
  lang?: string; // 語言代碼（可選，預設：en）
}
```

| 參數      | 類型     | 必填 | 預設值     | 說明                                           |
| --------- | -------- | ---- | ---------- | ---------------------------------------------- |
| `lat`     | `number` | ✅   | -          | 緯度（-90 ~ 90）                               |
| `lon`     | `number` | ✅   | -          | 經度（-180 ~ 180）                             |
| `exclude` | `array`  | ❌   | `[]`       | 排除的資料區塊                                 |
| `units`   | `string` | ❌   | `"metric"` | `"metric"` 或 `"imperial"`                     |
| `lang`    | `string` | ❌   | `"en"`     | 語言代碼（如 `"zh_tw"`, `"zh_cn"`, `"ja"` 等） |

#### 回傳值

回傳 `OneCallWeatherRes` 物件：

```typescript
interface OneCallWeatherRes {
  lat: number; // 地理座標：緯度
  lon: number; // 地理座標：經度
  timezone: string; // 時區名稱（如 "Asia/Taipei"）
  timezone_offset: number; // UTC 時差（秒）
  current: CurrentWeather; // 當前天氣
  minutely: MinutelyForecast[]; // 分鐘級預報（60 筆）
  hourly: HourlyForecast[]; // 小時級預報（48 筆）
  daily: DailyForecast[]; // 每日預報（8 天）
  alerts?: Alert[]; // 天氣警報（如有）
}
```

#### 使用範例

**基本使用：**

```typescript
// 取得台北的天氣資料
const weather = await getOneCallWeather({
  lat: 25.0338,
  lon: 121.5654,
});

console.log(weather.current.temp); // 當前溫度
console.log(weather.current.weather[0].description); // 天氣描述
console.log(weather.hourly.length); // 48（小時）
console.log(weather.daily.length); // 8（天）
```

**使用公制單位和繁體中文：**

```typescript
const weather = await getOneCallWeather({
  lat: 25.0338,
  lon: 121.5654,
  units: "metric", // 攝氏度、公尺/秒
  lang: "zh_tw", // 繁體中文
});

console.log(`溫度：${weather.current.temp}°C`);
console.log(`天氣：${weather.current.weather[0].description}`);
```

**排除不需要的資料：**

```typescript
// 只要每日預報，排除其他資料
const weather = await getOneCallWeather({
  lat: 25.0338,
  lon: 121.5654,
  exclude: ["current", "minutely", "hourly", "alerts"],
});

// 回傳的資料只包含 daily 陣列
console.log(weather.daily);
```

#### 單位系統對照表

| 類型   | Metric（公制） | Imperial（英制） |
| ------ | -------------- | ---------------- |
| 溫度   | 攝氏度（°C）   | 華氏度（°F）     |
| 風速   | 公尺/秒（m/s） | 英里/小時（mph） |
| 降水量 | 公釐（mm）     | 英寸（in）       |
| 氣壓   | 百帕（hPa）    | 百帕（hPa）      |
| 能見度 | 公尺（m）      | 公尺（m）        |

#### 支援的語言代碼

常用語言：

- `en` - English
- `zh_tw` - 繁體中文
- `zh_cn` - 简体中文
- `ja` - 日本語
- `ko` - 한국어
- `fr` - Français
- `de` - Deutsch
- `es` - Español

完整清單請參考 [OpenWeather 語言文件](https://openweathermap.org/api/one-call-3#multi)。

---

### getCurrentWeather

僅取得當前天氣資料，排除所有預報資訊，減少 API 回應大小。

#### 函數簽章

```typescript
getCurrentWeather(
  lat: number,
  lon: number,
  units?: "metric" | "imperial",
  lang?: string
): Promise<CurrentWeather>
```

#### 參數

| 參數    | 類型     | 必填 | 預設值     | 說明     |
| ------- | -------- | ---- | ---------- | -------- |
| `lat`   | `number` | ✅   | -          | 緯度     |
| `lon`   | `number` | ✅   | -          | 經度     |
| `units` | `string` | ❌   | `"metric"` | 單位系統 |
| `lang`  | `string` | ❌   | `"en"`     | 語言代碼 |

#### 回傳值

回傳 `CurrentWeather` 物件：

```typescript
interface CurrentWeather {
  dt: number; // 資料時間（Unix timestamp）
  sunrise: number; // 日出時間（Unix timestamp）
  sunset: number; // 日落時間（Unix timestamp）
  temp: number; // 溫度
  feels_like: number; // 體感溫度
  pressure: number; // 氣壓（hPa）
  humidity: number; // 濕度（%）
  dew_point: number; // 露點溫度
  uvi: number; // UV 指數
  clouds: number; // 雲量（%）
  visibility: number; // 能見度（m）
  wind_speed: number; // 風速
  wind_deg: number; // 風向（度）
  wind_gust: number; // 陣風風速
  weather: [WeatherCondition]; // 天氣狀況陣列
}
```

#### 使用範例

```typescript
// 取得台北當前天氣
const current = await getCurrentWeather(
  25.0338, // 緯度
  121.5654, // 經度
  "metric", // 公制單位
  "zh_tw", // 繁體中文
);

// 顯示當前天氣資訊
console.log(`溫度：${current.temp}°C`);
console.log(`體感溫度：${current.feels_like}°C`);
console.log(`濕度：${current.humidity}%`);
console.log(`風速：${current.wind_speed} m/s`);
console.log(`天氣：${current.weather[0].description}`);

// 日出日落時間（需轉換為 Date 物件）
const sunrise = new Date(current.sunrise * 1000);
const sunset = new Date(current.sunset * 1000);
console.log(`日出：${sunrise.toLocaleTimeString()}`);
console.log(`日落：${sunset.toLocaleTimeString()}`);
```

#### 注意事項

- 此函數內部會自動排除 `minutely`, `hourly`, `daily`, `alerts` 資料
- 適合只需要即時天氣資訊的場景（如首頁摘要）
- 資料更新頻率約為每 10 分鐘

---

### getHourlyForecast

取得未來 48 小時的小時級預報資料。

#### 函數簽章

```typescript
getHourlyForecast(
  lat: number,
  lon: number,
  units?: "metric" | "imperial",
  lang?: string
): Promise<OneCallWeatherRes>
```

#### 參數

與 `getCurrentWeather` 相同。

#### 回傳值

回傳 `OneCallWeatherRes` 物件，但只包含 `hourly` 陣列資料。

```typescript
interface HourlyForecast {
  dt: number; // 預報時間（Unix timestamp）
  temp: number; // 溫度
  feels_like: number; // 體感溫度
  pressure: number; // 氣壓
  humidity: number; // 濕度
  dew_point: number; // 露點溫度
  uvi: number; // UV 指數
  clouds: number; // 雲量
  visibility: number; // 能見度
  wind_speed: number; // 風速
  wind_deg: number; // 風向
  wind_gust: number; // 陣風
  pop: number; // 降水機率（0-1）
  rain?: {
    // 降雨資料（如有）
    "1h": number; // 過去 1 小時降雨量（mm）
  };
  snow?: {
    // 降雪資料（如有）
    "1h": number; // 過去 1 小時降雪量（mm）
  };
  weather: [WeatherCondition]; // 天氣狀況
}
```

#### 使用範例

```typescript
// 取得台北未來 48 小時預報
const forecast = await getHourlyForecast(25.0338, 121.5654, "metric", "zh_tw");

// 取得小時級預報陣列
const hourlyData = forecast.hourly;

console.log(`共 ${hourlyData.length} 小時的預報資料`); // 48

// 顯示未來 24 小時的溫度趨勢
hourlyData.slice(0, 24).forEach((hour) => {
  const time = new Date(hour.dt * 1000);
  console.log(
    `${time.getHours()}:00 - ${hour.temp}°C, ` +
      `${hour.weather[0].description}, ` +
      `降雨機率：${(hour.pop * 100).toFixed(0)}%`,
  );
});

// 找出未來 48 小時的最高/最低溫
const temps = hourlyData.map((h) => h.temp);
const maxTemp = Math.max(...temps);
const minTemp = Math.min(...temps);
console.log(`最高溫：${maxTemp}°C，最低溫：${minTemp}°C`);
```

#### 應用場景

- 製作 24 小時或 48 小時天氣圖表
- 顯示詳細的溫度、降雨機率曲線
- 計劃短期戶外活動

---

### getDailyForecast

取得未來 8 天的每日預報資料。

#### 函數簽章

```typescript
getDailyForecast(
  lat: number,
  lon: number,
  units?: "metric" | "imperial",
  lang?: string
): Promise<OneCallWeatherRes>
```

#### 參數

與 `getCurrentWeather` 相同。

#### 回傳值

回傳 `OneCallWeatherRes` 物件，但只包含 `daily` 陣列資料。

```typescript
interface DailyForecast {
  dt: number; // 預報日期時間（Unix timestamp，正午 12:00）
  sunrise: number; // 日出時間
  sunset: number; // 日落時間
  moonrise: number; // 月升時間
  moonset: number; // 月落時間
  moon_phase: number; // 月相（0-1，0/1=新月，0.5=滿月）
  summary: string; // 天氣摘要
  temp: {
    day: number; // 白天溫度
    min: number; // 最低溫度
    max: number; // 最高溫度
    night: number; // 夜間溫度
    eve: number; // 傍晚溫度
    morn: number; // 早晨溫度
  };
  feels_like: {
    day: number; // 白天體感溫度
    night: number; // 夜間體感溫度
    eve: number; // 傍晚體感溫度
    morn: number; // 早晨體感溫度
  };
  pressure: number; // 氣壓
  humidity: number; // 濕度
  dew_point: number; // 露點
  wind_speed: number; // 風速
  wind_deg: number; // 風向
  wind_gust: number; // 陣風
  weather: [WeatherCondition]; // 天氣狀況
}
```

#### 使用範例

```typescript
// 取得台北未來 8 天預報
const forecast = await getDailyForecast(25.0338, 121.5654, "metric", "zh_tw");

// 取得每日預報陣列
const dailyData = forecast.daily;

console.log(`共 ${dailyData.length} 天的預報資料`); // 8

// 顯示未來一週天氣
dailyData.forEach((day) => {
  const date = new Date(day.dt * 1000);
  const dateStr = date.toLocaleDateString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  console.log(
    `${dateStr}: ${day.weather[0].description}, ` +
      `${day.temp.min}°C ~ ${day.temp.max}°C`,
  );
});

// 顯示月相資訊
const moonPhases = [
  "🌑新月",
  "🌒娥眉月",
  "🌓上弦月",
  "🌔盈凸月",
  "🌕滿月",
  "🌖虧凸月",
  "🌗下弦月",
  "🌘殘月",
];
const phaseIndex = Math.round(dailyData[0].moon_phase * 8) % 8;
console.log(`今晚月相：${moonPhases[phaseIndex]}`);
```

#### 應用場景

- 製作天氣週曆
- 長期活動規劃
- 顯示日出日落時間
- 月相資訊

---

### getFullWeather

取得完整天氣資料，包含所有區塊（當前、分鐘、小時、每日、警報）。

#### 函數簽章

```typescript
getFullWeather(
  lat: number,
  lon: number,
  units?: "metric" | "imperial",
  lang?: string
): Promise<OneCallWeatherRes>
```

#### 參數

與 `getCurrentWeather` 相同。

#### 回傳值

回傳完整的 `OneCallWeatherRes` 物件，包含：

- `current` - 當前天氣
- `minutely` - 分鐘級降水預報（60 分鐘）
- `hourly` - 小時級預報（48 小時）
- `daily` - 每日預報（8 天）
- `alerts` - 天氣警報（如有）

#### 使用範例

```typescript
// 取得台北完整天氣資料
const weather = await getFullWeather(25.0338, 121.5654, "metric", "zh_tw");

// 當前天氣
console.log(`當前溫度：${weather.current.temp}°C`);

// 分鐘級降水預報（未來 1 小時）
if (weather.minutely) {
  console.log(`未來 1 小時降水預報：`);
  weather.minutely.slice(0, 10).forEach((minute, index) => {
    console.log(`${index} 分鐘後：${minute.precipitation} mm`);
  });
}

// 小時級預報
console.log(`未來 48 小時預報：${weather.hourly.length} 筆`);

// 每日預報
console.log(`未來 8 天預報：${weather.daily.length} 筆`);

// 天氣警報
if (weather.alerts && weather.alerts.length > 0) {
  console.log(`⚠️ 天氣警報：`);
  weather.alerts.forEach((alert) => {
    console.log(`- ${alert.event}`);
    console.log(`  ${alert.description}`);
    console.log(
      `  有效期間：${new Date(alert.start * 1000).toLocaleString()} ~ ${new Date(alert.end * 1000).toLocaleString()}`,
    );
  });
} else {
  console.log(`✅ 目前沒有天氣警報`);
}
```

#### 注意事項

- 此函數會回傳最完整的資料，因此 API 回應也最大
- 如果只需要特定資料，建議使用 `getCurrentWeather`, `getHourlyForecast`, `getDailyForecast`
- `minutely` 陣列僅在部分地區提供（主要為歐美地區）
- 天氣警報僅在發布地區有警報時才會出現

---

## <img src="../docIconImg/warning-duotone.svg" width="20" height="20" align="center" /> Error Handling 錯誤處理

所有 API 函數都包含錯誤處理機制，建議在呼叫時使用 `try-catch`：

```typescript
try {
  const weather = await getCurrentWeather(25.0338, 121.5654);
  // 處理成功回應
  console.log(weather);
} catch (error) {
  // 處理錯誤
  console.error("無法取得天氣資料：", error);

  if (axios.isAxiosError(error)) {
    // Axios 錯誤（網路、API 回應錯誤等）
    if (error.response) {
      // API 回應錯誤（401, 404, 429, 500 等）
      console.error(`API 錯誤 ${error.response.status}:`, error.response.data);

      switch (error.response.status) {
        case 401:
          console.error("API Key 無效或缺少");
          break;
        case 404:
          console.error("找不到資料（可能是座標錯誤）");
          break;
        case 429:
          console.error("API 呼叫次數超過限制");
          break;
        case 500:
        case 502:
        case 503:
          console.error("API 伺服器錯誤，請稍後再試");
          break;
      }
    } else if (error.request) {
      // 請求已發送但沒有收到回應（網路問題）
      console.error("網路連線錯誤，請檢查網路連線");
    } else {
      // 其他錯誤
      console.error("請求設定錯誤：", error.message);
    }
  } else {
    // 非 Axios 錯誤（如缺少 API Key）
    console.error("應用程式錯誤：", error);
  }
}
```

### 常見錯誤狀態碼

| 狀態碼              | 說明                   | 解決方式                                    |
| ------------------- | ---------------------- | ------------------------------------------- |
| `401`               | 未授權（API Key 無效） | 檢查 `.env` 中的 `VITE_OPENWEATHER_API_KEY` |
| `404`               | 找不到資料             | 確認經緯度座標是否正確                      |
| `429`               | API 呼叫次數超過限制   | 等待一段時間後再試，或升級 API 方案         |
| `500`, `502`, `503` | 伺服器錯誤             | OpenWeather 伺服器問題，稍後再試            |

---

## <img src="../docIconImg/lightbulb-duotone.svg" width="20" height="20" align="center" /> Best Practices 最佳實踐

> **💡 通用最佳實踐**：關於快取、防抖、載入狀態、統一單位顯示等通用技術，請參考 [API.md - 通用最佳實踐](../API.md#通用最佳實踐)。

### 根據場景選擇適當的函數

| 場景            | 建議函數            | 理由                        |
| --------------- | ------------------- | --------------------------- |
| 首頁天氣摘要    | `getCurrentWeather` | 只需當前資訊，回應快速      |
| 24 小時預報圖表 | `getHourlyForecast` | 只需小時資料，減少資料量    |
| 週曆天氣        | `getDailyForecast`  | 只需每日摘要                |
| 完整天氣頁面    | `getFullWeather`    | 需要所有資訊                |
| 降雨警報        | `getFullWeather`    | 需要 `minutely` 和 `alerts` |

---

## <img src="../docIconImg/link-duotone.svg" width="20" height="20" align="center" /> Related Documents 相關文件

- [API.md](../API.md) - API 服務層總覽
- [Config.md](../Config.md) - 設定檔說明
- [Unit.md](../Unit.md) - 單位系統說明
- [OpenWeather One Call API 3.0](https://openweathermap.org/api/one-call-3) - 官方文件
