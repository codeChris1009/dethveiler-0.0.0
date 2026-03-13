/**
 * API 服務層統一入口
 *
 * 本檔案負責統一匯出所有 API 服務模組的函數和類型
 * 使用者應該從此檔案匯入 API 函數，而不是直接從各個 API 模組匯入
 *
 * 目前包含的 API 服務：
 * - OpenWeatherMap API（天氣資料、地理編碼）
 *
 * 使用範例：
 * import { getGeocoding, getCurrentWeather } from "@/api";
 */

import axios from "axios";

// 從獨立檔案導入 apiClient 以避免循環依賴
export { apiClient } from "@/api/client";

/**
 * 統一的 API Key 取得函數
 * 適用於所有 API 提供商
 *
 * @param keyName - 環境變數名稱（如 'VITE_OPENWEATHER_API_KEY'）
 * @returns API Key 字串
 * @throws {Error} 當 API Key 不存在時拋出錯誤
 *
 * @example
 * ```typescript
 * const owmKey = getApiKey('VITE_OPENWEATHER_API_KEY');
 * const nasaKey = getApiKey('VITE_NASA_API_KEY');
 * ```
 */
export const getApiKey = (keyName: string): string => {
  const apiKey = import.meta.env[keyName];

  if (!apiKey) {
    throw new Error(`Missing API Key: ${keyName}`);
  }

  return apiKey;
};

/**
 * 統一的 API 錯誤處理函數
 * 適用於所有 API 模組，提供一致的錯誤記錄和處理
 *
 * @param error - 原始錯誤物件
 * @param context - 錯誤上下文（用於識別錯誤來源，如 API 名稱或函數名稱）
 * @throws 處理後的錯誤
 *
 * @example
 * ```typescript
 * try {
 *   const response = await axios.get(url);
 *   return response.data;
 * } catch (error) {
 *   return handleApiError(error, "getFunctionName");
 * }
 * ```
 */
export const handleApiError = (error: unknown, context: string): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const statusText = error.response?.statusText;

    // 根據 HTTP 狀態碼提供更具體的錯誤訊息
    switch (status) {
      case 401:
        console.error(`[${context}] 未授權：API Key 無效或缺失`);
        break;
      case 404:
        console.error(`[${context}] 找不到資源：${message}`);
        break;
      case 429:
        console.error(`[${context}] API 呼叫次數超過限制`);
        break;
      case 500:
      case 502:
      case 503:
        console.error(`[${context}] 伺服器錯誤 (${status})：請稍後再試`);
        break;
      default:
        console.error(
          `[${context}] API 錯誤 ${status || ""} ${statusText || ""}: ${message}`,
        );
    }
  } else if (error instanceof Error) {
    console.error(`[${context}] 錯誤: ${error.message}`);
  } else {
    console.error(`[${context}] 未知錯誤:`, error);
  }

  throw error;
};

// OpenWeatherMap API
export {
  demoOpenWeatherMap,
  // 函數
  getGeocoding,
  getReverseGeocoding,
  getOneCallWeather,
  getCurrentWeather,
  getHourlyForecast,
  getDailyForecast,
  getFullWeather,
} from "@/api/OpenWeatherMap";

// 從配置模組重新導出類型
export type { OneCallParams } from "@/config";
