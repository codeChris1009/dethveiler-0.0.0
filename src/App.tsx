// Components
import { ThemeProvider } from "@/components/themeFunc/ThemeProvider";
import { TopAppBar } from "@/components/TopAppBar";

export const App = () => {
  return (
    <div>
      <ThemeProvider>
        <TopAppBar />
      </ThemeProvider>
      <h1>Padi's Weatherforecast</h1>
    </div>
  );
};
