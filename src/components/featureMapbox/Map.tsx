// Node modules
import { createMap } from "@/api/Mapbox";

// Customer modules
import { MAPBOX } from "@/config";

// Hooks
import { useRef, useEffect, useState, useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useWeather } from "@/hooks/useWeather";

// Components
import { Marker } from "@/components/featureMapbox/Marker";

// Types
import type { LngLatLike, Map as MapType } from "mapbox-gl";

export const Map = () => {
  // Hooks
  const { theme } = useTheme();
  const { weather } = useWeather();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<MapType | null>(null);

  // Memos
  const center = useMemo<LngLatLike>(
    () =>
      weather
        ? [weather.location.lon, weather.location.lat]
        : MAPBOX.DEFAULTS.CENTER,
    [weather],
  );

  useEffect(() => {
    if (!weather || !weather.location) return;
    if (!mapContainerRef.current) return;

    const mapInstance = createMap(
      mapContainerRef.current,
      [weather.location.lon, weather.location.lat],
      theme,
      MAPBOX.DEFAULTS.ZOOM,
    );
    setMap(mapInstance);
    return () => mapInstance.remove();
  }, [theme, center]);

  // early return 僅在所有 Hook 之後，且只保留一次
  if (!weather || !weather.location) {
    return <div className="h-75 bg-card rounded-xl border shadow-sm" />;
  }

  return (
    <div
      ref={mapContainerRef}
      className="h-75 bg-card
      text-card-foreground rounded-xl border
      overflow-hidden shadow-sm"
    >
      {map && <Marker map={map} coordinates={center} />}
    </div>
  );
};
