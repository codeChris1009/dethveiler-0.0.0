/**
 * OpenWeatherMap API 配置與類型定義
 *
 * 本檔案集中管理 OpenWeatherMap API 相關的：
 * - 類型定義（參數、回應等）
 * - API 端點配置
 * - 預設參數設定
 *
 * @see https://openweathermap.org/api - OpenWeather API 官方文件
 */

import type { UnitSystem } from "./Unit";

/**
 * One Call API 可排除的資料區塊類型
 * 用於減少 API 回應大小，只獲取需要的資料
 */
export type OneCallExclude =
  | "current"
  | "minutely"
  | "hourly"
  | "daily"
  | "alerts";

/**
 * 預定義的 exclude 組合
 * 提供常用的資料排除配置，減少重複代碼
 */
export const EXCLUDE_PRESETS = {
  /** 只獲取當前天氣（排除所有預報） */
  CURRENT_ONLY: ["minutely", "hourly", "daily", "alerts"] as OneCallExclude[],
  /** 只獲取小時級預報（排除當前天氣和其他預報） */
  HOURLY_ONLY: ["current", "minutely", "daily", "alerts"] as OneCallExclude[],
  /** 只獲取每日預報（排除當前天氣和其他預報） */
  DAILY_ONLY: ["current", "minutely", "hourly", "alerts"] as OneCallExclude[],
  /** 獲取當前天氣和小時級預報（排除其他） */
  CURRENT_AND_HOURLY: ["minutely", "daily", "alerts"] as OneCallExclude[],
  /** 獲取當前天氣和每日預報（排除其他） */
  CURRENT_AND_DAILY: ["minutely", "hourly", "alerts"] as OneCallExclude[],
} as const;

/**
 * One Call API 參數介面
 * 定義呼叫 One Call API 時可傳入的參數
 */
export interface OneCallParams {
  /** 緯度（必填，範圍：-90 ~ 90） */
  lat: number;
  /** 經度（必填，範圍：-180 ~ 180） */
  lon: number;
  /**
   * 排除的資料區塊（可選）
   * 可用於減少 API 回應大小，只獲取需要的資料
   *
   * @example
   * // 只獲取當前天氣
   * exclude: ["minutely", "hourly", "daily", "alerts"]
   *
   * // 只獲取每日預報
   * exclude: ["current", "minutely", "hourly", "alerts"]
   */
  exclude?: OneCallExclude[];
  /**
   * 單位系統（可選）
   * - "metric" - 公制（攝氏度、公尺/秒、公釐）
   * - "imperial" - 英制（華氏度、英里/小時、英寸）
   *
   * @default "metric"
   */
  units?: UnitSystem;
  /**
   * 語言代碼（可選）
   *
   * 常用語言：
   * - "en" - English
   * - "zh_tw" - 繁體中文
   * - "zh_cn" - 简体中文
   * - "ja" - 日本語
   * - "ko" - 한국어
   *
   * @default "en"
   * @see https://openweathermap.org/api/one-call-3#multi - 完整語言列表
   */
  lang?: string;
}

/**
 * OpenWeatherMap API 配置
 * 包含 API 端點、預設的地理位置和 API 參數
 */
export const OPENWEATHERMAP_API = {
  /**
   * API 端點配置
   */
  ENDPOINTS: {
    /** Geocoding API（地理編碼，用於地點搜尋） */
    GEOCODING: "http://api.openweathermap.org/geo/1.0/direct",
    /** One Call API 3.0（完整天氣資料） */
    ONECALL: "https://api.openweathermap.org/data/3.0/onecall",
  },
  /**
   * 預設參數配置
   */
  DEFAULTS: {
    /** 預設緯度（台灣台北） */
    LATITUDE: 25.0338,
    /** 預設經度（台灣台北） */
    LONGITUDE: 121.5654,
    /** 預設單位系統：公制（metric）或英制（imperial） */
    UNIT: "metric" as UnitSystem,
    /** 預設語言：英文 */
    LANG: "en",
    /** 搜尋結果最大數量：5 筆 */
    SEARCH_RESULT_LIMIT: 5,
  },
} as const;
