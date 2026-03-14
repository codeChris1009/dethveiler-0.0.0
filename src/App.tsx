// Components
import { ThemeProvider } from "@/components/themeFunc/ThemeProvider";
import { OpenWeatherMapProvider } from "@/components/featureOpenWeatherMap/OpenWeatherMapProvider";
import { TopAppBar } from "@/components/TopAppBar";
import { PageHeader } from "@/components/PageHeader";

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
            </div>
          </main>
        </OpenWeatherMapProvider>
      </ThemeProvider>
    </div>
  );
};
