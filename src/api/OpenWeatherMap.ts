/**
 * OpenWeatherMap API 服務層
 *
 * 本檔案專門負責與 OpenWeatherMap API 進行通訊，包含：
 * - Geocoding API（地理編碼，根據地點名稱搜尋經緯度）
 * - One Call API 3.0（完整天氣資料：當前天氣、預報、警報）
 *
 * @see https://openweathermap.org/api - OpenWeather API 官方文件
 * @see /docs/API.md - 詳細使用說明文件
 */

// Customer modules
import { OPENWEATHERMAP_API, EXCLUDE_PRESETS } from "@/config/WeatherMapAPI";
import type { OneCallParams } from "@/config/WeatherMapAPI";
import { apiClient } from "./client";
import { getApiKey, handleApiError } from "./index";

// Types
import type { Geocoding, OneCallWeatherRes, CurrentWeather } from "@/types";

/**
 * OpenWeatherMap API Key 環境變數名稱
 */
const OWM_API_KEY = "VITE_OPENWEATHERMAP_API_KEY";

/**
 * OpenWeatherMap API 使用統一的 apiClient
 * 從父層引入，確保所有 API 使用相同的配置和攔截器
 */
const owmAxios = apiClient;

/**
 * One Call API 3.0 - 取得完整天氣資料
 * 包含當前天氣、分鐘級預報、小時級預報、每日預報和天氣警報
 *
 * @param params - API 參數物件
 * @returns Promise<OneCallWeatherRes> - 完整天氣資料
 *
 * API 回應包含：
 * - current: 當前天氣（溫度、濕度、風速等）
 * - minutely: 未來 1 小時的分鐘級降水預報（60 筆資料）
 * - hourly: 未來 48 小時的小時級預報
 * - daily: 未來 8 天的每日預報
 * - alerts: 天氣警報（如有）
 *
 * 範例：
 * const weather = await getOneCallWeather({
 *   lat: 25.0338,
 *   lon: 121.5654,
 *   units: "metric",
 *   lang: "zh_tw"
 * });
 */
export const getOneCallWeather = async (
  params: OneCallParams,
): Promise<OneCallWeatherRes> => {
  try {
    // 1. 預處理參數. 確保 exclude 只有在有值時才加入
    const { lat, lon, exclude, units, lang } = params;

    const queryParams = {
      lat,
      lon,
      appid: getApiKey(OWM_API_KEY),

      // 使用提供的單位系統，或使用預設值
      units: units ?? OPENWEATHERMAP_API.DEFAULTS.UNIT,

      // 使用提供的語言，或使用預設值
      lang: lang ?? OPENWEATHERMAP_API.DEFAULTS.LANG,

      // 如果有指定排除的資料區塊，轉為逗號分隔的字串
      ...(exclude?.length ? { exclude: exclude.join(",") } : {}),
    };

    const response = await owmAxios.get<OneCallWeatherRes>(
      OPENWEATHERMAP_API.ENDPOINTS.ONECALL,
      {
        params: queryParams,
      },
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getOneCallWeather");
  }
};

// demo

export const demoOpenWeatherMap = async () => {
  // 示例：取得台北的完整天氣資料
  const weather = await getOneCallWeather({
    lat: 25.0338,
    lon: 121.5654,
    units: "metric",
    lang: "zh_tw",
    exclude: EXCLUDE_PRESETS.CURRENT_ONLY,
  });
  console.log("完整天氣資料:", weather);
};

/**
 * 僅取得當前天氣資料
 * 排除其他預報資料，減少 API 回應大小
 *
 * @param lat - 緯度（-90 ~ 90）
 * @param lon - 經度（-180 ~ 180）
 * @param units - 單位系統（可選，預設：metric）
 * @param lang - 語言代碼（可選，預設：en）
 * @returns Promise<CurrentWeather> - 當前天氣資料
 *
 * @example
 * ```typescript
 * const current = await getCurrentWeather(25.0338, 121.5654, "metric", "zh_tw");
 * console.log(`溫度：${current.temp}°C`);
 * console.log(`濕度：${current.humidity}%`);
 * ```
 */
export const getCurrentWeather = async (
  lat: number,
  lon: number,
  units?: OneCallParams["units"],
  lang?: string,
): Promise<CurrentWeather> => {
  const data = await getOneCallWeather({
    lat,
    lon,
    units,
    lang,
    exclude: EXCLUDE_PRESETS.CURRENT_ONLY,
  });
  return data.current;
};

/**
 * 取得未來 48 小時的小時級預報
 * 排除當前天氣和其他資料
 *
 * @param lat - 緯度（-90 ~ 90）
 * @param lon - 經度（-180 ~ 180）
 * @param units - 單位系統（可選，預設：metric）
 * @param lang - 語言代碼（可選，預設：en）
 * @returns Promise<OneCallWeatherRes> - 包含小時級預報的天氣資料
 *
 * @example
 * ```typescript
 * const forecast = await getHourlyForecast(25.0338, 121.5654);
 * console.log(`共 ${forecast.hourly.length} 小時預報`);
 * forecast.hourly.slice(0, 24).forEach(hour => {
 *   console.log(`${new Date(hour.dt * 1000).getHours()}:00 - ${hour.temp}°C`);
 * });
 * ```
 */
export const getHourlyForecast = async (
  lat: number,
  lon: number,
  units?: OneCallParams["units"],
  lang?: string,
): Promise<OneCallWeatherRes> => {
  return getOneCallWeather({
    lat,
    lon,
    units,
    lang,
    exclude: EXCLUDE_PRESETS.HOURLY_ONLY,
  });
};

/**
 * 取得未來 8 天的每日預報
 * 排除當前天氣和小時級預報
 *
 * @param lat - 緯度（-90 ~ 90）
 * @param lon - 經度（-180 ~ 180）
 * @param units - 單位系統（可選，預設：metric）
 * @param lang - 語言代碼（可選，預設：en）
 * @returns Promise<OneCallWeatherRes> - 包含每日預報的天氣資料
 *
 * @example
 * ```typescript
 * const forecast = await getDailyForecast(25.0338, 121.5654, "metric", "zh_tw");
 * forecast.daily.forEach(day => {
 *   const date = new Date(day.dt * 1000).toLocaleDateString();
 *   console.log(`${date}: ${day.temp.min}°C ~ ${day.temp.max}°C`);
 * });
 * ```
 */
export const getDailyForecast = async (
  lat: number,
  lon: number,
  units?: OneCallParams["units"],
  lang?: string,
): Promise<OneCallWeatherRes> => {
  return getOneCallWeather({
    lat,
    lon,
    units,
    lang,
    exclude: EXCLUDE_PRESETS.DAILY_ONLY,
  });
};

/**
 * 取得完整天氣資料（包含所有區塊）
 * 不排除任何資料，適合需要完整資訊的場景
 *
 * @param lat - 緯度（-90 ~ 90）
 * @param lon - 經度（-180 ~ 180）
 * @param units - 單位系統（可選，預設：metric）
 * @param lang - 語言代碼（可選，預設：en）
 * @returns Promise<OneCallWeatherRes> - 完整天氣資料
 *
 * @example
 * ```typescript
 * const weather = await getFullWeather(25.0338, 121.5654, "metric", "zh_tw");
 * console.log("當前溫度:", weather.current.temp);
 * console.log("48小時預報:", weather.hourly.length);
 * console.log("8天預報:", weather.daily.length);
 * if (weather.alerts) {
 *   console.log("天氣警報:", weather.alerts.length);
 * }
 * ```
 */
export const getFullWeather = async (
  lat: number,
  lon: number,
  units?: OneCallParams["units"],
  lang?: string,
): Promise<OneCallWeatherRes> => {
  return getOneCallWeather({
    lat,
    lon,
    units,
    lang,
    // 不排除任何資料
    exclude: undefined,
  });
};

/**
 * 地理編碼 API - 根據地點名稱搜尋地理位置
 *
 * @param query - 搜尋關鍵字（城市名稱、地點等）
 * @returns Promise<Geocoding[]> - 地理位置資料陣列（最多 5 筆）
 *
 * @example
 * ```typescript
 * // 搜尋台北
 * const locations = await getGeocoding("Taipei");
 * if (locations.length > 0) {
 *   const { name, lat, lon, country } = locations[0];
 *   console.log(`${name}, ${country}: ${lat}, ${lon}`);
 * }
 *
 * // 使用國家代碼精確搜尋
 * const tokyo = await getGeocoding("Tokyo,JP");
 * const newYork = await getGeocoding("New York,NY,US");
 * ```
 *
 * @throws {Error} 當 API 呼叫失敗時拋出錯誤
 */
export const getGeocoding = async (query: string): Promise<Geocoding[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const response = await owmAxios.get<Geocoding[]>(
      OPENWEATHERMAP_API.ENDPOINTS.GEOCODING,
      {
        params: {
          q: query.trim(),
          limit: OPENWEATHERMAP_API.DEFAULTS.SEARCH_RESULT_LIMIT,
          appid: getApiKey(OWM_API_KEY),
        },
      },
    );
    return response.data as Geocoding[];
  } catch (error) {
    return handleApiError(error, "getGeocoding");
  }
};

/**
 * 反向地理編碼 API - 根據經緯度取得位置名稱
 *
 * @param lat - 緯度（-90 ~ 90）
 * @param lon - 經度（-180 ~ 180）
 * @param limit - 回傳結果數量上限（可選，預設使用 SEARCH_RESULT_LIMIT）
 * @returns Promise<Geocoding[]> - 地理位置資料陣列
 *
 * @example
 * ```typescript
 * const locations = await getReverseGeocoding(25.0338, 121.5654);
 * if (locations.length > 0) {
 *   console.log(`${locations[0].name}, ${locations[0].country}`);
 * }
 * ```
 *
 * @throws {Error} 當 API 呼叫失敗時拋出錯誤
 */
export const getReverseGeocoding = async (
  lat: number,
  lon: number,
  limit: number = OPENWEATHERMAP_API.DEFAULTS.SEARCH_RESULT_LIMIT,
): Promise<Geocoding[]> => {
  try {
    const response = await owmAxios.get<Geocoding[]>(
      OPENWEATHERMAP_API.ENDPOINTS.REVERSE_GEOCODING,
      {
        params: {
          lat,
          lon,
          limit,
          appid: getApiKey(OWM_API_KEY),
        },
      },
    );
    return response.data as Geocoding[];
  } catch (error) {
    return handleApiError(error, "getReverseGeocoding");
  }
};
