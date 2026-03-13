# Unit - 單位系統與切換功能

> 單位常數、型別工具與 UnitDropdown 的實際行為

---

## <img src="./docIconImg/book-open-duotone.svg" width="20" height="20" align="center" /> Overview 功能概述

這份文件涵蓋兩個部分：

- `src/config/Unit.ts`：單位系統常數、型別、格式化工具
- `src/components/UnitDropdown.tsx`：單位切換 UI

目前專案支援公制 `metric` 與英制 `imperial`，並透過 `UNIT_SYSTEM` 常數統一管理，避免硬編碼字串散落在元件裡。

---

## <img src="./docIconImg/target-duotone.svg" width="20" height="20" align="center" /> Core Concepts 核心概念

### 1. `UNIT_SYSTEM` 常數

```typescript
export const UNIT_SYSTEM = {
  METRIC: "metric",
  IMPERIAL: "imperial",
} as const;

export type UnitSystem = (typeof UNIT_SYSTEM)[keyof typeof UNIT_SYSTEM];
```

這樣做的目的：

- 避免在多個檔案重複寫 `"metric"` / `"imperial"`
- 讓 TypeScript 自動推導正確聯集型別
- 讓 dropdown、config、provider 都共用同一組來源

### 2. `UNITS` 與 `getUnit`

```typescript
const unit = getUnit("TEMPERATURE", UNIT_SYSTEM.METRIC); // °C
```

UI 顯示單位時，不需要自己判斷字串，直接透過 `getUnit()` 或 `UNITS.TEMPERATURE[unit]` 取得。

### 3. UnitDropdown 只在使用者選值時重查資料

`UnitDropdown` 現在不再用 `useEffect` 監聽 `unit` 來打 API。重查動作只會發生在使用者真的改變單位時：

```typescript
const handleUnitChange = (value: string) => {
  const newUnit = value as UnitSystem;
  setUnit(newUnit);
  localStorage.setItem(APP.STORE_KEY.UNIT, newUnit);
  setWeather({ unit: newUnit });
  setIsOpen(false);
};
```

這個修改是為了避免 mount 時多打 API。

### 4. 選值後主動關閉 dropdown

```typescript
const [isOpen, setIsOpen] = useState<boolean>(false);

<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
```

選到值後會 `setIsOpen(false)`，因此選單會立即關閉。

---

## <img src="./docIconImg/note-pencil-duotone.svg" width="20" height="20" align="center" /> Usage 使用方式

### 讀取單位符號

```typescript
import { UNITS, UNIT_SYSTEM, getUnit } from "@/config";

const celsius = UNITS.TEMPERATURE.metric;
const fahrenheit = UNITS.TEMPERATURE.imperial;
const currentUnit = getUnit("TEMPERATURE", UNIT_SYSTEM.METRIC);
```

### UnitDropdown 按鈕顯示

```typescript
<Button variant="secondary" size="icon">
  {getUnit("TEMPERATURE", unit)}
</Button>
```

按鈕目前只顯示溫度單位符號，例如 `°C` 或 `°F`。

### RadioItem 值來源

```typescript
<DropdownMenuRadioItem value={UNIT_SYSTEM.METRIC}>
  {`${UNIT_SYSTEM.METRIC} (${UNITS.TEMPERATURE.metric})`}
</DropdownMenuRadioItem>
```

這樣 UI 顯示文字與內部值會完全一致。

---

## <img src="./docIconImg/lightbulb-duotone.svg" width="20" height="20" align="center" /> Key Points 重點總結

- `UNIT_SYSTEM` 是目前單位值的唯一來源
- `UnitDropdown` 選值後會同時更新 state、localStorage、天氣資料，並關閉選單
- 不再透過 mount effect 觸發 `setWeather`，避免多餘 API 請求
