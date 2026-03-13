# Unit - 單位系統配置

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/book-open-duotone.svg" width="20" height="20" align="center" /> 功能概述

Unit 是一個集中管理所有測量單位的配置模組，支援公制 (metric) 和英制 (imperial) 兩種單位系統。它提供了單位符號、轉換函數和格式化工具，讓您可以輕鬆處理不同單位之間的轉換和顯示。

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/target-duotone.svg" width="20" height="20" align="center" /> 核心概念

### 1. 為什麼需要單位系統配置？

在天氣應用中，不同地區的使用者習慣不同的測量單位：

| 地區          | 溫度      | 風速 | 降雨量 | 氣壓 |
| ------------- | --------- | ---- | ------ | ---- |
| 🌏 亞洲、歐洲 | °C (攝氏) | m/s  | mm     | hPa  |
| 🌎 美國       | °F (華氏) | mph  | in     | inHg |

**集中管理的好處：**

- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 避免在程式碼中散落單位字串（如 "°C", "mph"）
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 統一轉換邏輯，避免重複計算
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 型別安全，IDE 自動提示可用的單位類型
- <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> 易於擴展新的單位類型

---

### 2. 支援的單位類型

| 單位類型          | 公制 (metric) | 英制 (imperial) | 用途                 |
| ----------------- | ------------- | --------------- | -------------------- |
| `TEMPERATURE`     | °C            | °F              | 溫度                 |
| `WIND_SPEED`      | m/s           | mph             | 風速                 |
| `PRESSURE`        | hPa           | inHg            | 氣壓                 |
| `PRECIPITATION`   | mm            | in              | 降雨量/降雪量        |
| `VISIBILITY`      | km            | mi              | 能見度               |
| `DISTANCE_SHORT`  | m             | ft              | 短距離               |
| `DISTANCE_LONG`   | km            | mi              | 長距離               |
| `SOLAR_RADIATION` | kWh/m²/day    | Wh/ft²/day      | 日照量/太陽輻射量    |
| `PERCENTAGE`      | %             | %               | 濕度、雲量、降雨機率 |
| `UV_INDEX`        | -             | -               | 紫外線指數           |
| `AQI`             | -             | -               | 空氣品質指數         |

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/wrench-duotone.svg" width="20" height="20" align="center" /> 基本使用方法

### 方法 1：直接讀取單位符號

```typescript
import { UNITS } from '@/config/Unit';

// 讀取溫度單位
const tempUnitMetric = UNITS.TEMPERATURE.metric;     // "°C"
const tempUnitImperial = UNITS.TEMPERATURE.imperial; // "°F"

// 讀取風速單位
const windUnit = UNITS.WIND_SPEED.metric;  // "m/s"

// 在 JSX 中使用
function WeatherCard({ temp, unit }: { temp: number, unit: 'metric' | 'imperial' }) {
  return (
    <div>
      {temp}{UNITS.TEMPERATURE[unit]}
    </div>
  );
}
```

---

### 方法 2：使用輔助函數獲取單位

```typescript
import { getUnit } from "@/config/Unit";

// 動態獲取單位符號
const tempUnit = getUnit("TEMPERATURE", "metric"); // "°C"
const windUnit = getUnit("WIND_SPEED", "imperial"); // "mph"

// 在函數中使用
function displayWeather(temp: number, system: "metric" | "imperial") {
  const unit = getUnit("TEMPERATURE", system);
  console.log(`Temperature: ${temp}${unit}`);
}
```

---

### 方法 3：格式化數值並附加單位

```typescript
import { formatWithUnit } from '@/config/Unit';

// 基本格式化（預設 1 位小數）
formatWithUnit(25.5, 'TEMPERATURE', 'metric');     // "25.5°C"
formatWithUnit(77.123, 'TEMPERATURE', 'imperial'); // "77.1°F"

// 自訂小數位數
formatWithUnit(10.12345, 'WIND_SPEED', 'metric', 2);  // "10.12 m/s"
formatWithUnit(75.6, 'PERCENTAGE', 'metric', 0);       // "76%"

// 在 React 元件中使用
function TemperatureDisplay({ value, system }: Props) {
  return (
    <span className="text-2xl font-bold">
      {formatWithUnit(value, 'TEMPERATURE', system)}
    </span>
  );
}
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/arrows-clockwise-duotone.svg" width="20" height="20" align="center" /> 單位轉換

### 轉換數值

```typescript
import { convertUnit } from "@/config/Unit";

// 溫度轉換
const celsius = 25;
const fahrenheit = convertUnit(celsius, "TEMPERATURE", "metric", "imperial");
console.log(fahrenheit); // 77

// 風速轉換
const mps = 10; // 10 m/s
const mph = convertUnit(mps, "WIND_SPEED", "metric", "imperial");
console.log(mph); // 22.37

// 氣壓轉換
const hpa = 1013;
const inHg = convertUnit(hpa, "PRESSURE", "metric", "imperial");
console.log(inHg); // 29.92

// 如果來源和目標系統相同，直接返回原值
const temp = convertUnit(25, "TEMPERATURE", "metric", "metric");
console.log(temp); // 25
```

---

### 轉換並格式化

```typescript
import { convertAndFormat } from '@/config/Unit';

// 一步完成轉換和格式化
const result1 = convertAndFormat(25, 'TEMPERATURE', 'metric', 'imperial');
console.log(result1);  // "77.0°F"

const result2 = convertAndFormat(10, 'WIND_SPEED', 'metric', 'imperial', 2);
console.log(result2);  // "22.37 mph"

// 在元件中使用
function WeatherConverter({ value, unitType, fromSystem, toSystem }: Props) {
  return (
    <div>
      <p>原始: {formatWithUnit(value, unitType, fromSystem)}</p>
      <p>轉換: {convertAndFormat(value, unitType, fromSystem, toSystem)}</p>
    </div>
  );
}
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/note-pencil-duotone.svg" width="20" height="20" align="center" /> 實戰範例

### 範例 1：天氣資料顯示元件

```typescript
import { formatWithUnit } from '@/config/Unit';
import type { UnitSystem } from '@/config/Unit';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  pressure: number;
  humidity: number;
  visibility: number;
  precipitation: number;
}

interface Props {
  data: WeatherData;
  system: UnitSystem;
}

function WeatherDetails({ data, system }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">溫度</p>
        <p className="text-xl font-bold">
          {formatWithUnit(data.temperature, 'TEMPERATURE', system)}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">風速</p>
        <p className="text-xl font-bold">
          {formatWithUnit(data.windSpeed, 'WIND_SPEED', system)}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">氣壓</p>
        <p className="text-xl font-bold">
          {formatWithUnit(data.pressure, 'PRESSURE', system)}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">濕度</p>
        <p className="text-xl font-bold">
          {formatWithUnit(data.humidity, 'PERCENTAGE', system, 0)}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">能見度</p>
        <p className="text-xl font-bold">
          {formatWithUnit(data.visibility, 'VISIBILITY', system)}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">降雨量</p>
        <p className="text-xl font-bold">
          {formatWithUnit(data.precipitation, 'PRECIPITATION', system, 2)}
        </p>
      </div>
    </div>
  );
}
```

---

### 範例 2：單位切換功能

```typescript
import { useState } from 'react';
import { convertUnit, formatWithUnit } from '@/config/Unit';
import type { UnitSystem } from '@/config/Unit';

function UnitToggle() {
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [temperature, setTemperature] = useState(25); // 原始數據（公制）

  // 切換單位系統時轉換數值
  const handleToggle = () => {
    const newSystem: UnitSystem = system === 'metric' ? 'imperial' : 'metric';

    // 轉換溫度數值
    const convertedTemp = convertUnit(
      temperature,
      'TEMPERATURE',
      system,
      newSystem
    );

    setSystem(newSystem);
    setTemperature(convertedTemp);
  };

  return (
    <div>
      <div className="text-4xl font-bold">
        {formatWithUnit(temperature, 'TEMPERATURE', system)}
      </div>

      <button
        onClick={handleToggle}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        切換到 {system === 'metric' ? '英制' : '公制'}
      </button>
    </div>
  );
}
```

---

### 範例 3：從 API 數據轉換

```typescript
import { convertAndFormat } from "@/config/Unit";
import type { UnitSystem } from "@/config/Unit";

// OpenWeatherMap API 返回的數據（公制）
interface ApiWeatherData {
  temp: number; // °C
  wind_speed: number; // m/s
  pressure: number; // hPa
  visibility: number; // meters
}

// 轉換為使用者偏好的單位系統
function processWeatherData(
  apiData: ApiWeatherData,
  userPreferredSystem: UnitSystem,
) {
  // API 數據是公制，需要轉換到使用者偏好的系統
  return {
    temperature: convertAndFormat(
      apiData.temp,
      "TEMPERATURE",
      "metric",
      userPreferredSystem,
    ),
    windSpeed: convertAndFormat(
      apiData.wind_speed,
      "WIND_SPEED",
      "metric",
      userPreferredSystem,
    ),
    pressure: convertAndFormat(
      apiData.pressure,
      "PRESSURE",
      "metric",
      userPreferredSystem,
    ),
    visibility: convertAndFormat(
      apiData.visibility / 1000, // 轉換 m 為 km
      "VISIBILITY",
      "metric",
      userPreferredSystem,
    ),
  };
}

// 使用範例
const apiResponse: ApiWeatherData = {
  temp: 25,
  wind_speed: 5.5,
  pressure: 1013,
  visibility: 10000,
};

const displayData = processWeatherData(apiResponse, "imperial");
console.log(displayData);
// {
//   temperature: "77.0°F",
//   windSpeed: "12.3 mph",
//   pressure: "29.9 inHg",
//   visibility: "6.2 mi"
// }
```

---

### 範例 4：整合 localStorage 偏好設定

```typescript
import { useEffect, useState } from 'react';
import { APP } from '@/config';
import { formatWithUnit } from '@/config/Unit';
import type { UnitSystem } from '@/config/Unit';

function useUnitPreference() {
  const [system, setSystem] = useState<UnitSystem>(() => {
    // 從 localStorage 讀取使用者偏好
    const saved = localStorage.getItem(APP.STORE_KEY.UNIT);
    return (saved as UnitSystem) || 'metric';
  });

  // 當單位系統改變時，儲存到 localStorage
  useEffect(() => {
    localStorage.setItem(APP.STORE_KEY.UNIT, system);
  }, [system]);

  return [system, setSystem] as const;
}

// 在元件中使用
function WeatherApp() {
  const [system, setSystem] = useUnitPreference();
  const temperature = 25;

  return (
    <div>
      <h1>{formatWithUnit(temperature, 'TEMPERATURE', system)}</h1>

      <select
        value={system}
        onChange={(e) => setSystem(e.target.value as UnitSystem)}
      >
        <option value="metric">公制 (°C, m/s, mm)</option>
        <option value="imperial">英制 (°F, mph, in)</option>
      </select>
    </div>
  );
}
```

---

### 範例 5：解析 NASA POWER API 日照量數據

```typescript
import { formatWithUnit } from '@/config/Unit';
import type { UnitSystem } from '@/config/Unit';

// NASA POWER API 回傳的日照量數據結構
interface NASAPowerResponse {
  properties: {
    parameter: {
      ALLSKY_SFC_SW_DWN: {
        [date: string]: number; // kWh/m²/day
      };
      ALLSKY_SFC_UV_INDEX: {
        [date: string]: number;
      };
    };
  };
  parameters: {
    ALLSKY_SFC_SW_DWN: {
      units: string;
      longname: string;
    };
  };
}

// 解析日照量數據並轉換為生活化描述
function getSolarRadiationLevel(value: number): {
  level: string;
  description: string;
  emoji: string;
} {
  if (value >= 6.0) {
    return {
      level: "烈日炎炎",
      description: "非常曬，適合曬被子或太陽能全力發電",
      emoji: "☀️",
    };
  } else if (value >= 4.0) {
    return {
      level: "晴朗和煦",
      description: "舒適的陽光，適合野餐",
      emoji: "🌤️",
    };
  } else if (value >= 2.0) {
    return {
      level: "多雲偶見光",
      description: "陽光被雲層遮擋",
      emoji: "⛅",
    };
  } else {
    return {
      level: "陰沉寒冷",
      description: "幾乎沒有陽光，體感偏冷",
      emoji: "☁️",
    };
  }
}

// 處理 NASA POWER API 回傳的數據
function processSolarData(
  apiResponse: NASAPowerResponse,
  system: UnitSystem
): Array<{
  date: string;
  solarRadiation: string;
  level: string;
  description: string;
  emoji: string;
}> {
  const solarData = apiResponse.properties.parameter.ALLSKY_SFC_SW_DWN;

  return Object.entries(solarData).map(([date, value]) => {
    const levelInfo = getSolarRadiationLevel(value);

    return {
      date,
      solarRadiation: formatWithUnit(value, 'SOLAR_RADIATION', system, 2),
      level: levelInfo.level,
      description: levelInfo.description,
      emoji: levelInfo.emoji,
    };
  });
}

// 在 React 元件中使用
function SolarRadiationChart({ data, system }: {
  data: NASAPowerResponse;
  system: UnitSystem;
}) {
  const processedData = processSolarData(data, system);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">日照量分析</h2>
      {processedData.map((item) => (
        <div
          key={item.date}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <p className="text-sm text-muted-foreground">
              {item.date.slice(0, 4)}/{item.date.slice(4, 6)}/{item.date.slice(6, 8)}
            </p>
            <p className="text-lg font-bold">
              {item.emoji} {item.level}
            </p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{item.solarRadiation}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// 實際使用範例數據（羅馬 2024 年 3 月）
const romeData: NASAPowerResponse = {
  properties: {
    parameter: {
      ALLSKY_SFC_SW_DWN: {
        "20240301": 2.2181,
        "20240302": 3.5064,
        "20240303": 3.1166,
        "20240304": 3.2671,
        "20240305": 4.2386,
        "20240306": 4.2722,
        "20240307": 4.8727,  // 這段期間日照最強
        "20240308": 3.6828,
        "20240309": 2.5111,
        "20240310": 1.229,   // 陰雨連綿
      },
      ALLSKY_SFC_UV_INDEX: {
        "20240301": 0.32,
        "20240302": 0.53,
        // ... 其他數據
      },
    },
  },
  parameters: {
    ALLSKY_SFC_SW_DWN: {
      units: "kW-hr/m^2/day",
      longname: "All Sky Surface Shortwave Downward Irradiance",
    },
  },
};

const processed = processSolarData(romeData, "metric");
console.log(processed[6]);
// {
//   date: "20240307",
//   solarRadiation: "4.87 kWh/m²/day",
//   level: "晴朗和煦",
//   description: "舒適的陽光，適合野餐",
//   emoji: "🌤️"
// }
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/calculator-duotone.svg" width="20" height="20" align="center" /> 轉換公式參考

### 溫度轉換

```typescript
// 攝氏轉華氏
°F = °C × 9/5 + 32

// 華氏轉攝氏
°C = (°F - 32) × 5/9

// 範例
25°C → 77°F
32°F → 0°C
```

### 風速轉換

```typescript
// m/s 轉 mph
mph = m/s × 2.237

// mph 轉 m/s
m/s = mph × 0.447

// 範例
10 m/s → 22.37 mph
20 mph → 8.94 m/s
```

### 氣壓轉換

```typescript
// hPa 轉 inHg
inHg = hPa × 0.02953

// inHg 轉 hPa
hPa = inHg × 33.8639

// 範例
1013 hPa → 29.92 inHg
30 inHg → 1015.92 hPa
```

### 降雨量轉換

```typescript
// mm 轉 in
in = mm × 0.03937

// in 轉 mm
mm = in × 25.4

// 範例
25.4 mm → 1 in
2 in → 50.8 mm
```

### 能見度/距離轉換

```typescript
// km 轉 mi
mi = km × 0.621371

// mi 轉 km
km = mi × 1.60934

// 範例
10 km → 6.21 mi
5 mi → 8.05 km
```

### 日照量/太陽輻射量轉換

```typescript
// kWh/m²/day 轉 Wh/ft²/day
Wh/ft²/day = kWh/m²/day × 92.903

// Wh/ft²/day 轉 kWh/m²/day
kWh/m²/day = Wh/ft²/day × 0.01076

// 換算說明
// 1 kWh = 1000 Wh
// 1 m² = 10.7639 ft²
// 因此：kWh/m²/day × 1000 ÷ 10.7639 = Wh/ft²/day

// 範例
4.87 kWh/m²/day → 452.54 Wh/ft²/day
200 Wh/ft²/day → 2.15 kWh/m²/day

// 數值參考（kWh/m²/day）
// < 2.0: 陰天/沒什麼陽光，體感偏涼
// 2.5 - 4.0: 多雲偶見光，陽光溫和
// 4.0 - 6.0: 晴朗和煦，舒適的陽光
// > 6.0: 烈日炎炎，非常曬
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/lightbulb-duotone.svg" width="20" height="20" align="center" /> 最佳實踐

### 1. 統一資料來源格式

<img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="16" height="16" align="center" /> **建議**：在應用程式內部統一使用一種單位系統（通常是公制），只在顯示時才轉換。

```typescript
// ✅ 好的做法
interface WeatherState {
  temperature: number; // 始終儲存為 °C
  windSpeed: number; // 始終儲存為 m/s
}

// 只在顯示時轉換
function display(state: WeatherState, system: UnitSystem) {
  return formatWithUnit(state.temperature, "TEMPERATURE", "metric", system);
}

// ❌ 不好的做法
interface WeatherState {
  temperature: number; // 不確定是 °C 還是 °F？
  system: UnitSystem; // 混亂！
}
```

---

### 2. 型別安全的單位參數

```typescript
// ✅ 使用型別定義
import type { UnitSystem } from "@/config/Unit";

function WeatherCard({ system }: { system: UnitSystem }) {
  // TypeScript 會檢查 system 只能是 'metric' 或 'imperial'
}

// ❌ 使用字串類型
function WeatherCard({ system }: { system: string }) {
  // 可能傳入任何字串，容易出錯
}
```

---

### 3. 避免重複轉換

```typescript
// ❌ 不好：每次渲染都轉換
function WeatherList({ temps, system }: Props) {
  return temps.map(temp => (
    <div key={temp.id}>
      {convertAndFormat(temp.value, 'TEMPERATURE', 'metric', system)}
    </div>
  ));
}

// ✅ 好：只轉換一次
function WeatherList({ temps, system }: Props) {
  const convertedTemps = temps.map(temp => ({
    ...temp,
    displayValue: convertAndFormat(temp.value, 'TEMPERATURE', 'metric', system)
  }));

  return convertedTemps.map(temp => (
    <div key={temp.id}>{temp.displayValue}</div>
  ));
}

// ✅ 更好：使用 useMemo
import { useMemo } from 'react';

function WeatherList({ temps, system }: Props) {
  const displayTemps = useMemo(() => {
    return temps.map(temp =>
      convertAndFormat(temp.value, 'TEMPERATURE', 'metric', system)
    );
  }, [temps, system]);

  return displayTemps.map((display, idx) => (
    <div key={temps[idx].id}>{display}</div>
  ));
}
```

---

### 4. 小數位數的選擇

不同測量類型適合不同的精確度：

```typescript
// 溫度：1 位小數
formatWithUnit(25.678, "TEMPERATURE", "metric", 1); // "25.7°C"

// 風速：1 位小數
formatWithUnit(5.432, "WIND_SPEED", "metric", 1); // "5.4 m/s"

// 氣壓：1 位小數
formatWithUnit(1013.25, "PRESSURE", "metric", 1); // "1013.3 hPa"

// 濕度/雲量：0 位小數（整數）
formatWithUnit(75.6, "PERCENTAGE", "metric", 0); // "76%"

// 降雨量：2 位小數（精確度重要）
formatWithUnit(2.567, "PRECIPITATION", "metric", 2); // "2.57 mm"
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/rocket-duotone.svg" width="20" height="20" align="center" /> 進階技巧

### 1. 自訂格式化函數

```typescript
import { convertUnit, getUnit } from "@/config/Unit";
import type { UnitSystem } from "@/config/Unit";

// 自訂溫度顯示（加上 "feels like"）
function formatFeelsLike(
  temp: number,
  feelsLike: number,
  system: UnitSystem,
): string {
  const unit = getUnit("TEMPERATURE", system);
  const convertedTemp = convertUnit(temp, "TEMPERATURE", "metric", system);
  const convertedFeels = convertUnit(
    feelsLike,
    "TEMPERATURE",
    "metric",
    system,
  );

  return `${convertedTemp.toFixed(1)}${unit} (體感 ${convertedFeels.toFixed(1)}${unit})`;
}

console.log(formatFeelsLike(25, 28, "metric")); // "25.0°C (體感 28.0°C)"
console.log(formatFeelsLike(25, 28, "imperial")); // "77.0°F (體感 82.4°F)"
```

---

### 2. 批量轉換

```typescript
import { convertUnit } from "@/config/Unit";
import type { UnitSystem } from "@/config/Unit";

// 轉換整個天氣物件
interface WeatherDataMetric {
  temp: number;
  windSpeed: number;
  pressure: number;
}

function convertWeatherData(
  data: WeatherDataMetric,
  toSystem: UnitSystem,
): WeatherDataMetric {
  if (toSystem === "metric") return data;

  return {
    temp: convertUnit(data.temp, "TEMPERATURE", "metric", toSystem),
    windSpeed: convertUnit(data.windSpeed, "WIND_SPEED", "metric", toSystem),
    pressure: convertUnit(data.pressure, "PRESSURE", "metric", toSystem),
  };
}
```

---

### 3. 動態單位選擇器元件

```typescript
import { UNITS } from '@/config/Unit';
import type { UnitSystem } from '@/config/Unit';

function UnitSelector({
  value,
  onChange
}: {
  value: UnitSystem;
  onChange: (system: UnitSystem) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange('metric')}
        className={value === 'metric' ? 'active' : ''}
      >
        公制
        <span className="text-xs text-muted-foreground">
          {UNITS.TEMPERATURE.metric} / {UNITS.WIND_SPEED.metric}
        </span>
      </button>

      <button
        onClick={() => onChange('imperial')}
        className={value === 'imperial' ? 'active' : ''}
      >
        英制
        <span className="text-xs text-muted-foreground">
          {UNITS.TEMPERATURE.imperial} / {UNITS.WIND_SPEED.imperial}
        </span>
      </button>
    </div>
  );
}
```

---

### 4. 擴展新的單位類型

如果需要新增單位類型，遵循相同的模式：

```typescript
// 在 Unit.ts 中擴展
export const UNITS = {
  // ... 現有單位

  // 新增：大氣壓力（另一種單位）
  PRESSURE_MB: {
    metric: "mb", // millibar
    imperial: "psi", // pounds per square inch
  },

  // 新增：速度（另一種單位）
  SPEED_KMH: {
    metric: "km/h",
    imperial: "mph",
  },
} as const;

// 新增對應的轉換函數
export const CONVERSION_FACTORS = {
  // ... 現有轉換

  SPEED_KMH: {
    kmhToMph: (kmh: number) => kmh * 0.621371,
    mphToKmh: (mph: number) => mph * 1.60934,
  },
} as const;
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/bug-duotone.svg" width="20" height="20" align="center" /> 常見問題

### Q1: 為什麼 API 返回的單位和我的設定不一致？

**A**: OpenWeatherMap API 的 `units` 參數決定返回的單位：

- `units=metric` → 溫度 °C，風速 m/s
- `units=imperial` → 溫度 °F，風速 mph

如果 API 返回公制，但使用者設定是英制，需要使用 `convertUnit()` 轉換。

---

### Q2: 轉換後的數值精度太高，如何處理？

**A**: 使用 `formatWithUnit()` 或 `convertAndFormat()` 時指定小數位數：

```typescript
// 預設 1 位小數
formatWithUnit(25.678, "TEMPERATURE", "metric"); // "25.7°C"

// 自訂 0 位小數
formatWithUnit(25.678, "TEMPERATURE", "metric", 0); // "26°C"

// 自訂 2 位小數
formatWithUnit(25.678, "TEMPERATURE", "metric", 2); // "25.68°C"
```

---

### Q3: 如何處理沒有單位的數值（如 UV 指數）？

**A**: 使用 `UV_INDEX` 或 `AQI` 類型，它們的單位是空字串：

```typescript
formatWithUnit(7, "UV_INDEX", "metric"); // "7"（沒有單位符號）
formatWithUnit(85, "AQI", "metric"); // "85"
```

---

### Q4: 百分比符號的位置？

**A**: `formatWithUnit()` 已自動處理，百分比符號緊貼數字：

```typescript
formatWithUnit(75, "PERCENTAGE", "metric"); // "75%"（不是 "75 %"）
```

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/books-duotone.svg" width="20" height="20" align="center" /> 相關資源

- [OpenWeatherMap API - 單位格式](https://openweathermap.org/api/one-call-3#data)
- [TypeScript Const Assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
- [MDN - toFixed()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)
- [React useMemo Hook](https://react.dev/reference/react/useMemo)

---

## <img src="https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.0/assets/duotone/check-duotone.svg" width="20" height="20" align="center" /> 檢查清單

- [ ] 理解為什麼需要集中管理單位配置
- [ ] 知道支援哪些單位類型
- [ ] 掌握 `getUnit()`, `formatWithUnit()`, `convertUnit()` 三個核心函數
- [ ] 了解如何在 React 元件中使用單位轉換
- [ ] 知道如何選擇適當的小數位數
- [ ] 理解應該在內部使用統一單位，只在顯示時轉換
- [ ] 能夠擴展新的單位類型
- [ ] 知道如何整合 localStorage 儲存使用者偏好

---

**最後更新**：2026年3月12日
