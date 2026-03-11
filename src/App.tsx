// Components
import { ThemeProvider } from "@/components/themeProvider/ThemeProvider";
import { TopAppBar } from "@/components/TopAppBar";

export const App = () => {
  return (
    <div>
      <h1>Padi's Weatherforecast</h1>
      <ThemeProvider>
        <TopAppBar />
      </ThemeProvider>
    </div>
  );
};
