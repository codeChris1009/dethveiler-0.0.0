// Hooks
import { useTheme } from "@/components/themeFunc/ThemeProvider";

// UI Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Assets
import { SunIcon, MoonIcon, LaptopIcon } from "@phosphor-icons/react";

export const ThemeDropdown = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="secondary" size="icon">
            <SunIcon
              className="
               h-[1.2rem] w-[1.2rem]
               scale-100 rotate-0 transition-all
               dark:scale-0 dark:-rotate-90"
            />
            <MoonIcon
              className="
               absolute h-[1.2rem] w-[1.2rem]
               scale-0 rotate-90 transition-all
               dark:scale-100 dark:rotate-0"
            />
            <span className="sr-only uppercase">Toggle theme</span>
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <SunIcon className="me-2 uppercase" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <MoonIcon className="me-2 uppercase" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <LaptopIcon className="me-2 uppercase" />
          system
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
