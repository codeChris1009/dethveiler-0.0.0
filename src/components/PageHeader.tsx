// Customer modules
import { APP } from "@/config";
import { getUserLocation } from "@/lib/utils";

// Hooks
import { useWeather } from "@/hooks/useWeather";

// Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "./ui/skeleton";

// Assets
import { MapPinAreaIcon } from "@phosphor-icons/react";

export const PageHeader = () => {
  const { weather, setWeather } = useWeather();
  if (!weather) return <Skeleton className="w-40 h-4 mt-2 mb-6" />;
  return (
    <div className="flex items-center gap-4 mb-4">
      <h2>
        {weather.location.name},
        {weather.location.state ? ` ${weather.location.state},` : ""}
        {weather.location.country}
      </h2>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={async () => {
          try {
            const { latitude, longitude } = await getUserLocation();
            setWeather({ lat: latitude, lon: longitude });
            localStorage.setItem(APP.STORE_KEY.LATITUDE, String(latitude));
            localStorage.setItem(APP.STORE_KEY.LONGITUDE, String(longitude));
          } catch (error) {
            alert(`Error getting user location: ${error}`);
          }
        }}
      >
        <MapPinAreaIcon />
      </Button>
    </div>
  );
};
