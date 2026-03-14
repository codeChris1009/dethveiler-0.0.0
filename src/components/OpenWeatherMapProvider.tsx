// Node modules
import { useCallback, useEffect, useState } from "react";

// Customer modules
import { OPENWEATHERMAP_API } from "@/config/WeatherMapAPI";
import { getOneCallWeather, getReverseGeocoding } from "@/api/index";
import {
  OpenWeatherMapContext,
  type Weather,
  type WeatherStateParam,
} from "@/components/featureOpenWeatherMap/OpenWeatherMapContext";

// Types
import type { Geocoding, OneCallWeatherRes } from "@/types";

// Provider
export const OpenWeatherMapProvider = ({
  children,
}: React.PropsWithChildren) => {
  // State
  const [weather, setWeatherState] = useState<Weather | null>(null);

  // Callback
  const getWeatherOneCall = useCallback(
    async (params: WeatherStateParam): Promise<OneCallWeatherRes | null> => {
      const lat = params.lat ?? OPENWEATHERMAP_API.DEFAULTS.LATITUDE;
      const lon = params.lon ?? OPENWEATHERMAP_API.DEFAULTS.LONGITUDE;
      const unit = params.unit ?? OPENWEATHERMAP_API.DEFAULTS.UNIT;

      console.table({ lat, lon, unit });

      const response = await getOneCallWeather({
        lat,
        lon,
        units: unit,
      });
      console.table({ response });
      return response;
    },
    [],
  );

  const getReverseGeo = useCallback(
    async (lat: number, lon: number, limit = 1): Promise<Geocoding | null> => {
      try {
        const response = await getReverseGeocoding(lat, lon, limit);
        console.table({ reverseGeocodingResponse: response });
        return response[0] ?? null;
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
      }
    },
    [],
  );

  const getWeather = useCallback(
    async (params: WeatherStateParam) => {
      try {
        const weatherData = await getWeatherOneCall(params);
        const reverseGeoData = await getReverseGeo(
          params.lat ?? OPENWEATHERMAP_API.DEFAULTS.LATITUDE,
          params.lon ?? OPENWEATHERMAP_API.DEFAULTS.LONGITUDE,
        );

        if (!weatherData) {
          console.error("Failed to fetch weather data");
          return;
        }
        if (!reverseGeoData) {
          console.error("Failed to fetch reverse geocoding data");
          return;
        }

        setWeatherState({
          current: weatherData.current,
          minutely: weatherData.minutely,
          hourly: weatherData.hourly,
          daily: weatherData.daily,
          alerts: weatherData.alerts,
          location: reverseGeoData,
          timezone: {
            timezone: weatherData.timezone,
            offset: weatherData.timezone_offset,
          },
        });
      } catch (error) {
        console.error(
          "Error fetching weather or reverse geocoding data:",
          error,
        );
      }
    },
    [getWeatherOneCall, getReverseGeo],
  );

  // Initial weather call.
  useEffect(() => {
    (async () => await getWeather({}))();
  }, [getWeather]);

  return (
    <OpenWeatherMapContext.Provider value={{ weather, setWeather: getWeather }}>
      {children}
    </OpenWeatherMapContext.Provider>
  );
};
