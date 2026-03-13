// Component
import { SearchDialog } from "@/components/SearchDialog";
import { ThemeDropdown } from "@/components/themeFunc/ThemeDropdown";
import { UnitDropdown } from "@/components/UnitDropdown";

// Assets
import { Logo } from "@/assets/Logo";

export const TopAppBar = () => {
  return (
    <div className="h-16 lg:my-4">
      <header
        className="h-16 px-4 flex items-center justify-between fixed gap-5
        top-0 left-0 w-full bg-background/50 backdrop-blur-lg border-b z-50
        lg:border lg:rounded-lg-2x1 lg:w-auto lg:max-w-384 lg:mx-auto
        lg:top-4 lg:left-4 lg:right-4"
      >
        <Logo />

        <SearchDialog />
        <div className="flex gap-2">
          <ThemeDropdown />
          <UnitDropdown />
        </div>
      </header>
    </div>
  );
};
