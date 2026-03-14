/**
 * 配置模組統一入口
 * 集中管理和重新導出所有配置模組
 */

// 匯入 Mapbox GL 的經緯度類型
import type { LngLatLike } from "mapbox-gl";
// 匯入 OpenWeatherMap API 配置
import { OPENWEATHERMAP_API } from "@/config/WeatherMapAPI";

// 重新導出 OpenWeatherMap API 配置、類型和常量
export { OPENWEATHERMAP_API, EXCLUDE_PRESETS } from "@/config/WeatherMapAPI";
export type { OneCallExclude, OneCallParams } from "@/config/WeatherMapAPI";

/**
 * Mapbox 地圖配置
 * 包含地圖的初始位置和縮放等級
 */
export const MAPBOX = {
  DEFAULTS: {
    // 地圖中心點：[經度, 緯度] 格式（注意：經度在前，緯度在後）
    CENTER: [
      OPENWEATHERMAP_API.DEFAULTS.LONGITUDE,
      OPENWEATHERMAP_API.DEFAULTS.LATITUDE,
    ] as LngLatLike,
    // 地圖初始縮放等級（數字越大越靠近，通常範圍 0-22）
    ZOOM: 12.5,
  },
} as const;

/**
 * 應用程式全域配置
 * 包含 localStorage 儲存鍵名
 * 注意：單位顯示格式已移至 Unit.ts 的 UNITS 配置中
 */
export const APP = {
  // localStorage 儲存鍵名（用於持久化使用者設定）
  STORE_KEY: {
    LATITUDE: "dethveiler-latitude", // 儲存緯度的鍵名
    LONGITUDE: "dethveiler-longitude", // 儲存經度的鍵名
    UNIT: "dethveiler-unit", // 儲存單位系統的鍵名
  },
} as const;

// 重新匯出 UNITS 和相關類型供其他模組使用
export { UNITS } from "@/config/Unit";
export type { UnitSystem, UnitConfig } from "@/config/Unit";

// 從 Unit.ts 匯出所有格式化工具函數
export * from "@/config/Unit";
