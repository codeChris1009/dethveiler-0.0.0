/**
 * 單位系統配置
 * 集中管理應用程式中所有測量單位的顯示格式
 * 支援公制 (metric) 和英制 (imperial) 兩種單位系統
 */

/**
 * 單位系統類型定義
 */
export const UNIT_SYSTEM = {
  METRIC: "metric",
  IMPERIAL: "imperial",
} as const;

export type UnitSystem = (typeof UNIT_SYSTEM)[keyof typeof UNIT_SYSTEM];

/**
 * 單位配置物件類型
 */
export type UnitConfig = {
  metric: string;
  imperial: string;
};

/**
 * 完整的單位配置
 * 使用 as const 確保所有單位字串為唯讀常數
 */
const UNITS = {
  // Degree symbol for temperature
  DEGREE: "°" as const,

  /**
   * 溫度單位
   * - metric: 攝氏度 (Celsius)
   * - imperial: 華氏度 (Fahrenheit)
   */
  TEMPERATURE: {
    metric: "°C",
    imperial: "°F",
  } as const,

  /**
   * 風速單位
   * - metric: 公尺/秒 (meters per second)
   * - imperial: 英里/小時 (miles per hour)
   */
  WIND_SPEED: {
    metric: "m/s",
    imperial: "mph",
  } as const,

  /**
   * 氣壓單位
   * - metric: 百帕 / 毫巴 (hectopascal / millibar)
   * - imperial: 英寸汞柱 (inches of mercury)
   */
  PRESSURE: {
    metric: "hPa",
    imperial: "inHg",
  } as const,

  /**
   * 降雨量/降雪量單位
   * - metric: 毫米 (millimeters)
   * - imperial: 英寸 (inches)
   */
  PRECIPITATION: {
    metric: "mm",
    imperial: "in",
  } as const,

  /**
   * 能見度單位
   * - metric: 公里 (kilometers)
   * - imperial: 英里 (miles)
   */
  VISIBILITY: {
    metric: "km",
    imperial: "mi",
  } as const,

  /**
   * 距離單位（短距離）
   * - metric: 公尺 (meters)
   * - imperial: 英尺 (feet)
   */
  DISTANCE_SHORT: {
    metric: "m",
    imperial: "ft",
  } as const,

  /**
   * 距離單位（長距離）
   * - metric: 公里 (kilometers)
   * - imperial: 英里 (miles)
   */
  DISTANCE_LONG: {
    metric: "km",
    imperial: "mi",
  } as const,

  /**
   * 百分比單位
   * 用於濕度、雲量、降雨機率等
   * 公制和英制都使用 %
   */
  PERCENTAGE: {
    metric: "%",
    imperial: "%",
  } as const,

  /**
   * 紫外線指數
   * 無單位，但提供統一格式
   * 公制和英制都使用相同數值
   */
  UV_INDEX: {
    metric: "",
    imperial: "",
  } as const,

  /**
   * 空氣品質指數 (AQI)
   * 無單位，但提供統一格式
   * 公制和英制都使用相同數值
   */
  AQI: {
    metric: "",
    imperial: "",
  } as const,

  /**
   * 日照量/太陽輻射量單位
   * 用於衡量太陽能資源的核心指標
   * - metric: 千瓦小時每平方公尺每天 (kilowatt-hour per square meter per day)
   * - imperial: 瓦小時每平方英尺每天 (watt-hour per square foot per day)
   *
   * 數值參考（kWh/m²/day）：
   * - < 2.0: 陰天/沒什麼陽光
   * - 2.5 - 4.0: 多雲偶見光
   * - 4.0 - 6.0: 晴朗和煦
   * - > 6.0: 烈日炎炎
   */
  SOLAR_RADIATION: {
    metric: "kWh/m²/day",
    imperial: "Wh/ft²/day",
  },
} as const;

/**
 * 轉換係數
 * 用於在不同單位系統之間轉換數值
 */
export const CONVERSION_FACTORS = {
  /**
   * 溫度轉換
   * 攝氏轉華氏：°F = °C × 9/5 + 32
   * 華氏轉攝氏：°C = (°F - 32) × 5/9
   */
  TEMPERATURE: {
    celsiusToFahrenheit: (celsius: number) => (celsius * 9) / 5 + 32,
    fahrenheitToCelsius: (fahrenheit: number) => ((fahrenheit - 32) * 5) / 9,
  },

  /**
   * 風速轉換
   * m/s 轉 mph：mph = m/s × 2.237
   * mph 轉 m/s：m/s = mph × 0.447
   */
  WIND_SPEED: {
    metersPerSecondToMph: (mps: number) => mps * 2.23694,
    mphToMetersPerSecond: (mph: number) => mph * 0.44704,
  },

  /**
   * 氣壓轉換
   * hPa 轉 inHg：inHg = hPa × 0.02953
   * inHg 轉 hPa：hPa = inHg × 33.8639
   */
  PRESSURE: {
    hectopascalToInchesOfMercury: (hpa: number) => hpa * 0.02953,
    inchesOfMercuryToHectopascal: (inHg: number) => inHg * 33.8639,
  },

  /**
   * 降雨量轉換
   * mm 轉 in：in = mm × 0.03937
   * in 轉 mm：mm = in × 25.4
   */
  PRECIPITATION: {
    millimetersToInches: (mm: number) => mm * 0.03937,
    inchesToMillimeters: (inches: number) => inches * 25.4,
  },

  /**
   * 能見度轉換
   * km 轉 mi：mi = km × 0.621371
   * mi 轉 km：km = mi × 1.60934
   */
  VISIBILITY: {
    kilometersToMiles: (km: number) => km * 0.621371,
    milesToKilometers: (mi: number) => mi * 1.60934,
  },

  /**
   * 距離轉換（短距離）
   * m 轉 ft：ft = m × 3.28084
   * ft 轉 m：m = ft × 0.3048
   */
  DISTANCE_SHORT: {
    metersToFeet: (m: number) => m * 3.28084,
    feetToMeters: (ft: number) => ft * 0.3048,
  },

  /**
   * 距離轉換（長距離）
   * km 轉 mi：mi = km × 0.621371
   * mi 轉 km：km = mi × 1.60934
   */
  DISTANCE_LONG: {
    kilometersToMiles: (km: number) => km * 0.621371,
    milesToKilometers: (mi: number) => mi * 1.60934,
  },

  /**
   * 日照量/太陽輻射量轉換
   * kWh/m²/day 轉 Wh/ft²/day：Wh/ft²/day = kWh/m²/day × 92.903
   * Wh/ft²/day 轉 kWh/m²/day：kWh/m²/day = Wh/ft²/day × 0.01076
   *
   * 換算邏輯：
   * 1 kWh = 1000 Wh
   * 1 m² = 10.7639 ft²
   * 因此：kWh/m²/day × 1000 ÷ 10.7639 = Wh/ft²/day
   */
  SOLAR_RADIATION: {
    kwhPerM2ToWhPerFt2: (kwhPerM2: number) => kwhPerM2 * 92.90304,
    whPerFt2ToKwhPerM2: (whPerFt2: number) => whPerFt2 * 0.01076391,
  },
} as const;

/**
 * 輔助函數：根據單位系統獲取單位符號
 * @param unitType - 單位類型（如 'TEMPERATURE', 'WIND_SPEED' 等）
 * @param system - 單位系統（'metric' 或 'imperial'）
 * @returns 對應的單位符號字串
 *
 * @example
 * getUnit('TEMPERATURE', 'metric')  // "°C"
 * getUnit('WIND_SPEED', 'imperial') // "mph"
 */
export function getUnit(
  unitType: keyof typeof UNITS,
  system: UnitSystem,
): string {
  const unit = UNITS[unitType];
  if (
    typeof unit === "object" &&
    unit !== null &&
    "metric" in unit &&
    "imperial" in unit
  ) {
    return unit[system];
  }
  // 若該單位型態不是物件（如 DEGREE），直接回傳
  return unit as string;
}

/**
 * 輔助函數：格式化數值並附加單位
 * @param value - 要格式化的數值
 * @param unitType - 單位類型
 * @param system - 單位系統
 * @param decimals - 小數位數（預設值：1）
 * @returns 格式化後的字串（數值 + 單位）
 *
 * @example
 * formatWithUnit(25.5, 'TEMPERATURE', 'metric')     // "25.5°C"
 * formatWithUnit(10.123, 'WIND_SPEED', 'metric', 2) // "10.12m/s"
 * formatWithUnit(75, 'PERCENTAGE', 'metric', 0)     // "75%"
 */
export function formatWithUnit(
  value: number,
  unitType: keyof typeof UNITS,
  system: UnitSystem,
  decimals: number = 1,
): string {
  const unit = getUnit(unitType, system);
  const roundedValue = value.toFixed(decimals);

  // 如果單位是空字串（如 UV_INDEX），只返回數值
  if (unit === "") {
    return roundedValue;
  }

  // 百分比符號不需要空格
  if (unit === "%") {
    return `${roundedValue}${unit}`;
  }

  // 其他單位（溫度符號也不需要空格）
  if (unit.startsWith("°")) {
    return `${roundedValue}${unit}`;
  }

  // 其他單位加上空格
  return `${roundedValue} ${unit}`;
}

/**
 * 輔助函數：轉換數值到指定單位系統
 * @param value - 要轉換的數值
 * @param unitType - 單位類型
 * @param fromSystem - 來源單位系統
 * @param toSystem - 目標單位系統
 * @returns 轉換後的數值
 *
 * @example
 * convertUnit(25, 'TEMPERATURE', 'metric', 'imperial')  // 77
 * convertUnit(10, 'WIND_SPEED', 'metric', 'imperial')   // 22.37
 */
export function convertUnit(
  value: number,
  unitType: keyof typeof UNITS,
  fromSystem: UnitSystem,
  toSystem: UnitSystem,
): number {
  // 如果來源和目標系統相同，直接返回原值
  if (fromSystem === toSystem) {
    return value;
  }

  // 根據單位類型選擇對應的轉換函數
  switch (unitType) {
    case "TEMPERATURE":
      return fromSystem === "metric"
        ? CONVERSION_FACTORS.TEMPERATURE.celsiusToFahrenheit(value)
        : CONVERSION_FACTORS.TEMPERATURE.fahrenheitToCelsius(value);

    case "WIND_SPEED":
      return fromSystem === "metric"
        ? CONVERSION_FACTORS.WIND_SPEED.metersPerSecondToMph(value)
        : CONVERSION_FACTORS.WIND_SPEED.mphToMetersPerSecond(value);

    case "PRESSURE":
      return fromSystem === "metric"
        ? CONVERSION_FACTORS.PRESSURE.hectopascalToInchesOfMercury(value)
        : CONVERSION_FACTORS.PRESSURE.inchesOfMercuryToHectopascal(value);

    case "PRECIPITATION":
      return fromSystem === "metric"
        ? CONVERSION_FACTORS.PRECIPITATION.millimetersToInches(value)
        : CONVERSION_FACTORS.PRECIPITATION.inchesToMillimeters(value);

    case "VISIBILITY":
    case "DISTANCE_LONG":
      return fromSystem === "metric"
        ? CONVERSION_FACTORS.VISIBILITY.kilometersToMiles(value)
        : CONVERSION_FACTORS.VISIBILITY.milesToKilometers(value);

    case "DISTANCE_SHORT":
      return fromSystem === "metric"
        ? CONVERSION_FACTORS.DISTANCE_SHORT.metersToFeet(value)
        : CONVERSION_FACTORS.DISTANCE_SHORT.feetToMeters(value);

    case "SOLAR_RADIATION":
      return fromSystem === "metric"
        ? CONVERSION_FACTORS.SOLAR_RADIATION.kwhPerM2ToWhPerFt2(value)
        : CONVERSION_FACTORS.SOLAR_RADIATION.whPerFt2ToKwhPerM2(value);

    // 百分比、UV 指數、AQI 等不需要轉換
    case "PERCENTAGE":
    case "UV_INDEX":
    case "AQI":
      return value;

    default:
      return value;
  }
}

/**
 * 輔助函數：格式化並轉換數值到指定單位系統
 * @param value - 要轉換的數值
 * @param unitType - 單位類型
 * @param fromSystem - 來源單位系統
 * @param toSystem - 目標單位系統
 * @param decimals - 小數位數（預設值：1）
 * @returns 轉換並格式化後的字串
 *
 * @example
 * convertAndFormat(25, 'TEMPERATURE', 'metric', 'imperial')     // "77.0°F"
 * convertAndFormat(10, 'WIND_SPEED', 'metric', 'imperial', 2)   // "22.37 mph"
 */
export function convertAndFormat(
  value: number,
  unitType: keyof typeof UNITS,
  fromSystem: UnitSystem,
  toSystem: UnitSystem,
  decimals: number = 1,
): string {
  const convertedValue = convertUnit(value, unitType, fromSystem, toSystem);
  return formatWithUnit(convertedValue, unitType, toSystem, decimals);
}
