// Components
import { ThemeProvider } from "@/components/themeFunc/ThemeProvider";
import { OpenWeatherMapProvider } from "@/components/featureOpenWeatherMap/OpenWeatherMapProvider";
import { TopAppBar } from "@/components/TopAppBar";

export const App = () => {
  return (
    <div>
      <ThemeProvider>
        <OpenWeatherMapProvider>
          <TopAppBar />
        </OpenWeatherMapProvider>
      </ThemeProvider>
      <h1>Padi's Weatherforecast</h1>
    </div>
  );
};
