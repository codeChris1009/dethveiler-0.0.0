// Node modules
import { createContext } from "react";

// Customer modules
import type { UnitSystem } from "@/config/Unit";

// Types
import type {
  CurrentWeather,
  MinutelyForecast,
  HourlyForecast,
  DailyForecast,
  Alert,
  Geocoding,
  WeatherTimezone,
} from "@/types/Index";

export type Weather = {
  current: CurrentWeather;
  minutely: MinutelyForecast[];
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts?: Alert[];
  location: Geocoding;
  timezone: WeatherTimezone;
};

export type WeatherStateParam = {
  lat?: number;
  lon?: number;
  unit?: UnitSystem;
};

export type WeatherProviderState = {
  weather: Weather | null;
  setWeather: (weather: WeatherStateParam) => void;
};

const initialState: WeatherProviderState = {
  weather: null,
  setWeather: () => {},
};

export const OpenWeatherMapContext =
  createContext<WeatherProviderState>(initialState);
