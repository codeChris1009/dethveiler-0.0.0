// Customer modules
import { APP, OPENWEATHERMAP_API, UNIT_SYSTEM, getUnit } from "@/config";
import type { UnitSystem } from "@/config";

// Hooks
import { useState } from "react";
import { useWeather } from "@/hooks/useWeather";

// Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

export const UnitDropdown = () => {
  // Hooks
  const { setWeather } = useWeather();

  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unit, setUnit] = useState<UnitSystem>(
    (localStorage.getItem(APP.STORE_KEY.UNIT) as UnitSystem) ||
      OPENWEATHERMAP_API.DEFAULTS.UNIT,
  );

  const handleUnitChange = (value: string) => {
    const newUnit = value as UnitSystem;
    setUnit(newUnit);
    localStorage.setItem(APP.STORE_KEY.UNIT, newUnit);
    setWeather({ unit: newUnit });
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={
          <Button variant="secondary" size="icon">
            {getUnit("TEMPERATURE", unit)}
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200x]">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground uppercase">
            weather settings
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={unit} onValueChange={handleUnitChange}>
            <DropdownMenuRadioItem
              className="uppercase"
              value={UNIT_SYSTEM.METRIC}
            >
              {`${UNIT_SYSTEM.METRIC} (${getUnit("TEMPERATURE", UNIT_SYSTEM.METRIC)})`}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              className="uppercase"
              value={UNIT_SYSTEM.IMPERIAL}
            >
              {`${UNIT_SYSTEM.IMPERIAL} (${getUnit("TEMPERATURE", UNIT_SYSTEM.IMPERIAL)})`}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
