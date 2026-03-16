// Node modules
import { createMap } from "@/api/Mapbox";

// Customer modules
import { MAPBOX } from "@/config";

// Hooks
import { useRef, useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useWeather } from "@/hooks/useWeather";

// Components

// Types
import type { Map as MapType } from "mapbox-gl";

export const Map = () => {
  // Hooks
  const { theme } = useTheme();
  const { weather } = useWeather();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [, setMap] = useState<MapType | null>(null);

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
  }, [theme, weather]);

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
    ></div>
  );
};
