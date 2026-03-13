// Customer modules
import { OpenWeatherMapContext } from "@/components/featureOpenWeatherMap/OpenWeatherMapContext";

// Hooks
import { useContext } from "react";

export const useWeather = () => {
  const context = useContext(OpenWeatherMapContext);
  if (!context) {
    throw new Error("useWeather must be used within an OpenWeatherMapProvider");
  }
  return context;
};
