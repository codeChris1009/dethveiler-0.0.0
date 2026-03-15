import mapboxgl from "mapbox-gl";

/**
 * 初始化 Mapbox GL 地圖
 * @param container - 地圖容器 HTMLElement
 * @param center - [經度, 緯度]
 * @param theme - "light" | "dark"
 * @param zoom - 縮放等級（預設 MAPBOX.DEFAULTS.ZOOM）
 * @returns Mapbox GL Map 實例
 */
export function createMap(
  container: HTMLElement,
  center: [number, number],
  theme: string,
  zoom: number = MAPBOX.DEFAULTS.ZOOM,
): mapboxgl.Map {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
  return new mapboxgl.Map({
    container,
    center,
    zoom,
    style:
      theme === "light"
        ? "mapbox://styles/mapbox/streets-v11"
        : "mapbox://styles/mapbox/dark-v11",
  });
}
/**
 * Mapbox API 服務層
 *
 * 本檔案專門負責與 Mapbox API 進行通訊，包含：
 * - 取得靜態地圖圖片
 * - 取得地理編碼（正向/反向）
 * - 取得路徑規劃（Directions）
 *
 * @see https://docs.mapbox.com/api/ - Mapbox API 官方文件
 * @see /docs/API.md - 詳細使用說明文件
 */

// Customer modules
import { MAPBOX } from "@/config";

// Types
import type { LngLatLike } from "mapbox-gl";

// Mapbox Geocoding API 回傳型別
export interface MapboxGeocodeFeature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: Record<string, unknown>;
  text: string;
  place_name: string;
  center: [number, number];
  geometry: { type: string; coordinates: [number, number] };
  address?: string;
  context?: Array<Record<string, unknown>>;
}
export interface MapboxGeocodeResponse {
  type: string;
  query: Array<string | number>;
  features: MapboxGeocodeFeature[];
  attribution: string;
}

// Mapbox Directions API 回傳型別
export interface MapboxDirectionsResponse {
  routes: Array<Record<string, unknown>>;
  waypoints: Array<Record<string, unknown>>;
  code: string;
  uuid?: string;
}

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
const MAPBOX_BASE_URL = "https://api.mapbox.com";

/**
 * 取得靜態地圖圖片 URL
 * @param center - 地圖中心點 [經度, 緯度]
 * @param zoom - 縮放等級
 * @param width - 圖片寬度（像素）
 * @param height - 圖片高度（像素）
 * @param options - 額外參數（如標記、樣式等）
 * @returns 靜態地圖圖片 URL
 */
export function getStaticMapUrl(
  center: LngLatLike,
  zoom: number = 12,
  width: number = 600,
  height: number = 400,
  options?: {
    marker?: string; // 標記樣式
    styleId?: string; // 地圖樣式 ID
    bearing?: number;
    pitch?: number;
  },
): string {
  let lng: number, lat: number;
  if (Array.isArray(center)) {
    [lng, lat] = center;
  } else if ("lng" in center && "lat" in center) {
    lng = center.lng;
    lat = center.lat;
  } else if ("lon" in center && "lat" in center) {
    lng = center.lon;
    lat = center.lat;
  } else {
    throw new Error("Invalid center format for getStaticMapUrl");
  }
  const style = options?.styleId || "mapbox/streets-v11";
  const marker = options?.marker
    ? `/pin-s+${options.marker}(${lng},${lat})`
    : "";
  const bearing = options?.bearing ? `,${options.bearing}` : "";
  const pitch = options?.pitch ? `,${options.pitch}` : "";
  return `${MAPBOX_BASE_URL}/styles/v1/${style}/static${marker}/${lng},${lat},${zoom}${bearing}${pitch}/${width}x${height}?access_token=${MAPBOX_API_KEY}`;
}

/**
 * Mapbox Geocoding API - 正向地理編碼
 * @param query - 關鍵字（地名、地址等）
 * @param limit - 回傳數量上限（預設 5）
 * @param language - 語言（預設 zh-TW）
 * @returns Promise<any> - 地理位置結果
 */
export async function geocode(
  query: string,
  limit: number = 5,
  language: string = "zh-TW",
): Promise<MapboxGeocodeResponse> {
  const url = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(
    query,
  )}.json?access_token=${MAPBOX_API_KEY}&limit=${limit}&language=${language}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Mapbox Geocoding API error");
  return res.json();
}

/**
 * Mapbox Geocoding API - 反向地理編碼
 * @param lng - 經度
 * @param lat - 緯度
 * @param limit - 回傳數量上限（預設 1）
 * @param language - 語言（預設 zh-TW）
 * @returns Promise<any> - 地理位置結果
 */
export async function reverseGeocode(
  lng: number,
  lat: number,
  limit: number = 1,
  language: string = "zh-TW",
): Promise<MapboxGeocodeResponse> {
  const url = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_API_KEY}&limit=${limit}&language=${language}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Mapbox Reverse Geocoding API error");
  return res.json();
}

/**
 * Mapbox Directions API - 路徑規劃
 * @param waypoints - 路徑點陣列 [[lng, lat], ...]
 * @param profile - 路徑模式（driving, walking, cycling）
 * @param overview - 路徑回傳型態（full, simplified, false）
 * @returns Promise<any> - 路徑結果
 */
export async function getDirections(
  waypoints: [number, number][],
  profile: "driving" | "walking" | "cycling" = "driving",
  overview: "full" | "simplified" | false = "full",
): Promise<MapboxDirectionsResponse> {
  const coords = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(";");
  const url = `${MAPBOX_BASE_URL}/directions/v5/mapbox/${profile}/${coords}?access_token=${MAPBOX_API_KEY}&overview=${overview}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Mapbox Directions API error");
  return res.json();
}
