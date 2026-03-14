// Customer modules
import { APP } from "@/config";
import { getGeocoding } from "@/api/index";

// Hooks
import { useEffect, useCallback, useState } from "react";
import { useWeather } from "@/hooks/useWeather";

// Components
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  Item,
  ItemTitle,
  ItemContent,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from "@/components/ui/item";

import { Button } from "@/components/ui/button";

import { Kbd, KbdGroup } from "@/components/ui/kbd";

// Assets
import { MapPinAreaIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

// Types

import type { Geocoding } from "@/types";

export const SearchDialog = () => {
  // Hooks
  const { setWeather } = useWeather();
  // State
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Geocoding[]>([]);
  const [isOpenSearchDialog, setIsOpenSearchDialog] = useState<boolean>(false);

  // Request
  const geoCoding = useCallback(async (search: string) => {
    const normalizedSearch = search.trim();
    if (!normalizedSearch) {
      setResults([]);
      return;
    }

    try {
      const response = await getGeocoding(normalizedSearch);
      setResults(response);
      return response;
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  }, []);

  // Keyboard shortcut: Cmd + K to open search dialog
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpenSearchDialog(true);
      }
    };

    document.addEventListener("keydown", shortcut);

    // Remove listener when SearchDialog is removed from DOM
    return () => document.removeEventListener("keydown", shortcut);
  }, []);

  // Search API Caller
  useEffect(() => {
    if (!search) return;

    (async () => {
      const geoRes = await geoCoding(search);

      if (geoRes && geoRes.length > 0) {
        setResults(geoRes);
      }
    })();
  }, [search, geoCoding]);

  // Handlers

  // open / close dialog and clear search text when closing
  const handleDialogToggle = (isOpen: boolean) => {
    setIsOpenSearchDialog(isOpen);
    if (!isOpen) {
      clearSearchState();
    }
  };

  // Handle search input change
  const handleSearchInput = (searchTxt: string) => {
    setSearch(searchTxt);
    if (!searchTxt.trim()) {
      setResults([]);
    }
  };

  // Handle location selection from search results
  const handleLocationSelect = (lat: number, lon: number) => {
    setWeather({ lat, lon });
    localStorage.setItem(APP.STORE_KEY.LATITUDE, String(lat));
    localStorage.setItem(APP.STORE_KEY.LONGITUDE, String(lon));
    clearSearchState();
    setIsOpenSearchDialog(false);
  };

  // Private Functions
  const clearSearchState = () => {
    setSearch("");
    setResults([]);
  };

  return (
    <Dialog open={isOpenSearchDialog} onOpenChange={handleDialogToggle}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="
            me-auto max-lg:size-9 lg:bg-secondary
            dark:lg:bg-secondary/50"
            // onClick={() => setIsOpenSearchDialog((prev) => !prev)}
          >
            <MagnifyingGlassIcon className="lg:text-muted-foreground" />

            <div
              className="
              flex justify-between w-[250px]
              max-lg:hidden uppercase
              text-muted-foreground dark:text-muted-foreground/70 placeholder:opacity-100"
            >
              <span className="text-inherit opacity-70">search weather...</span>
              <kbd className="ml-2">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </kbd>
            </div>
          </Button>
        }
      />
      <DialogContent className="p-0 bg-card gap-0" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle className="uppercase">Search Weather</DialogTitle>
          <DialogDescription className="capitalize">
            search weather by city or country.
          </DialogDescription>
        </DialogHeader>

        <InputGroup
          className="
          p-4 ring-0! border-t-0! border-x-0!
          border-b border-border!
          rounded-b-none bg-transparent"
        >
          <InputGroupInput
            className="capitalize"
            placeholder="Search city or country..."
            value={search}
            onInput={(e) => handleSearchInput(e.currentTarget.value)}
          />
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
        </InputGroup>
        <ItemGroup className="min-h-96 p-2 overflow-y-auto">
          {!results.length && (
            <p className="text-center text-sm py-4">No results found.</p>
          )}
          {results.map(({ name, lat, lon, state, country }) => (
            <Item
              key={`${name}-${lat}-${lon}`}
              size="sm"
              className="
              relative p-2 cursor-pointer transition-all duration-150
              hover:bg-muted/80 active:scale-[0.99] active:bg-muted"
              role="button"
              tabIndex={0}
              onClick={() => handleLocationSelect(lat, lon)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleLocationSelect(lat, lon);
                }
              }}
            >
              <ItemContent>
                <ItemTitle className="capitalize">{name}</ItemTitle>
                <ItemDescription>
                  {state ? `${state}, ` : "UNK-STATE"}
                  {country ? `${country}` : "UNK-COUNTRY"}
                </ItemDescription>
              </ItemContent>

              <ItemActions>
                <DialogClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="after:absolute after:inset-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocationSelect(lat, lon);
                      }}
                    >
                      <MapPinAreaIcon />
                    </Button>
                  }
                ></DialogClose>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </DialogContent>
    </Dialog>
  );
};
