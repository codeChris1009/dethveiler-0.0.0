// Components
import { ThemeProvider } from "@/components/themeFunc/ThemeProvider";
import { OpenWeatherMapProvider } from "@/components/featureOpenWeatherMap/OpenWeatherMapProvider";
import { TopAppBar } from "@/components/TopAppBar";
import { PageHeader } from "@/components/PageHeader";
import { CurrentWeatherCard } from "@/components/featureOpenWeatherMap/CurrentWeatherCard";
import { Map } from "@/components/featureMapbox/Map";
import { HourlyWeatherTabs } from "./components/featureHourlyTab/HourlyWeatherTabs";

export const App = () => {
  return (
    <div>
      <ThemeProvider>
        <OpenWeatherMapProvider>
          <TopAppBar />
          <h1>Padi's Weatherforecast</h1>

          <main className="py-4">
            <div className="container">
              {/* Page Header */}
              <PageHeader />
              {/* Current Weather Card */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <CurrentWeatherCard />
                <Map />
              </div>
              {/* Hourly Weather Tabs */}
              <HourlyWeatherTabs />
            </div>
          </main>
        </OpenWeatherMapProvider>
      </ThemeProvider>
    </div>
  );
};
