// Node modules
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";

// Customer modules
import { APP, OPENWEATHERMAP_API, getUnit } from "@/config/index";
import type { UnitSystem } from "@/config/index";

// Hooks
import { useEffect, useMemo, useRef } from "react";
import { useWeather } from "@/hooks/useWeather";

// Assets
import { ThermometerIcon } from "@phosphor-icons/react";

// Types
import type { Map, LngLatLike, Marker as MarkerType } from "mapbox-gl";

type Props = {
  map: Map;
  coordinates: LngLatLike;
};

export const Marker = ({ map, coordinates }: Props) => {
  const { weather } = useWeather();
  const markerRef = useRef<MarkerType | null>(null);

  // 1. 穩定建立 DOM 容器，不要用 Ref 在 render 時判斷
  const markerElement = useMemo(() => {
    const el = document.createElement("div");
    el.className = "mapbox-marker-portal"; // 方便除錯
    return el;
  }, []);

  const weatherUnit =
    (localStorage.getItem(APP.STORE_KEY.UNIT) as UnitSystem | null) ||
    OPENWEATHERMAP_API.DEFAULTS.UNIT;

  // 2. 生命週期管理：建立與清理
  useEffect(() => {
    if (!map) return;

    // 初始化 Marker
    const marker = new mapboxgl.Marker({
      element: markerElement,
    })
      .setLngLat(coordinates)
      .addTo(map);

    markerRef.current = marker;

    // Clean up: 組件卸載時移除 Marker，防止閃退與記憶體洩漏
    return () => {
      marker.remove();
      markerRef.current = null;
    };
    // 注意：這裡不應該依賴 coordinates，否則會導致 Marker 重複建立與閃爍
    // bug: 加入 coordinates 後，會導致 ERROR
  }, [map, markerElement]);

  // 3. 座標更新邏輯：單獨處理座標，不要重新建立 Marker
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat(coordinates);
    }
  }, [coordinates]);

  // 如果還沒資料，不渲染 Portal 內容
  if (!weather) return null;

  return createPortal(
    <div
      className="relative flex items-center gap-2
            bg-foreground text-background w-fit rounded-md px-3 py-1.5
            text-sm font-semibold text-balance drop-shadow-lg isolate"
    >
      <ThermometerIcon size={16} fill="currentColor" />
      <span>
        {weather.current.temp.toFixed()}
        {getUnit("TEMPERATURE", weatherUnit)}
      </span>

      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2
        rotate-45 size-3 rounded-[3px] bg-foreground -z-10"
      ></div>
    </div>,
    markerElement,
  );
};
