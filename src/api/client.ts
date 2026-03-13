/**
 * API 客戶端配置
 *
 * 統一的 Axios 實例，供所有 API 模組使用
 * 獨立檔案以避免循環依賴問題
 */

import axios from "axios";

/**
 * 統一的 Axios 實例
 * 所有 API 模組都應該使用此實例發送請求
 *
 * 優勢：
 * - 統一配置 timeout、headers 等
 * - 可以在此添加統一的請求/響應攔截器
 * - 便於單元測試 mock
 * - 更好的錯誤處理和日誌記錄
 *
 * @example
 * ```typescript
 * import { apiClient } from "@/api/client";
 *
 * const response = await apiClient.get(url, { params });
 * ```
 */
export const apiClient = axios.create({
  timeout: 10000, // 10 秒超時
  headers: {
    "Content-Type": "application/json",
  },
});

// 可選：添加請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在此添加統一的請求處理邏輯
    // 例如：添加 token、記錄請求日誌等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 可選：添加響應攔截器
apiClient.interceptors.response.use(
  (response) => {
    // 可以在此添加統一的響應處理邏輯
    return response;
  },
  (error) => {
    // 統一的錯誤處理
    return Promise.reject(error);
  },
);
