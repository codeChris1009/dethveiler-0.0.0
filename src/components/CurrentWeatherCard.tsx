// Customer modules
import { APP, getUnit, OPENWEATHERMAP_API } from "@/config/index";

// Hooks
import { useWeather } from "@/hooks/useWeather";

// Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";

// Assets
import { WindIcon } from "@phosphor-icons/react";

// Types
import type { UnitSystem } from "@/config/index";
import { Skeleton } from "./ui/skeleton";

export const CurrentWeatherCard = () => {
  const { weather } = useWeather();
  if (!weather) return <Skeleton className="min-h-75 rounded-xl" />;

  const currentWeather = {
    dt: new Date(weather.current.dt * 1000).toLocaleTimeString("en-US", {
      timeStyle: "short",
    }),
    iconCode: weather.current.weather[0].icon,
    temp: weather.current.temp.toFixed(),
    description: weather.current.weather[0].description,
    feelsLike: weather.current.feels_like.toFixed(),
    windSpeed: weather.current.wind_speed.toFixed(),
    windDeg: weather.current.wind_deg,
    humidity: weather.current.humidity,
    visibility: (weather.current.visibility / 1000).toFixed(),
    pressure: weather.current.pressure,
    dewPoint: weather.current.dew_point.toFixed(),
  };

  const localStorageUnit =
    (localStorage.getItem(APP.STORE_KEY.UNIT) as UnitSystem) ||
    OPENWEATHERMAP_API.DEFAULTS.UNIT;

  return (
    <Card className="@container min-h-75">
      <CardHeader>
        <CardTitle className="uppercase">Current Weather</CardTitle>
        <CardDescription>{currentWeather.dt}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-wrap items-center gap-x-6">
        <figure>
          <img
            src={`https://openweathermap.org/img/wn/${currentWeather.iconCode}@4x.png`}
            alt={currentWeather.description}
            width={70}
            height={70}
            className="object-contain"
          />
        </figure>
        <p className="text-5xl font-medium flex item-start sm:text-7xl">
          {currentWeather.temp}
          <span className="text-3xl">
            {getUnit("TEMPERATURE", localStorageUnit)}
          </span>
        </p>
        <div>
          <p className="font-medium capitalize sm:text-lg">
            {currentWeather.description}
          </p>

          <div className="flex text-sm items-center gap-2">
            <span className="text-muted-foreground">Feels like</span>
            <span>
              {currentWeather.feelsLike}
              {getUnit("TEMPERATURE", localStorageUnit)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-wrap gap-x-8 gap-y-2 @lg-justify-between">
        <div>
          <p className="text-sm text-muted-foreground uppercase">Wind</p>
          <div className="flex items-center gap-1">
            {currentWeather.windSpeed} {getUnit("WIND_SPEED", localStorageUnit)}
            <WindIcon
              size={14}
              fill="currentColor"
              style={{ rotate: `${currentWeather.windDeg}deg` }}
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground uppercase">Humidity</p>
          <div className="flex items-center gap-1">
            <p>
              {currentWeather.humidity}
              {getUnit("PERCENTAGE", localStorageUnit)}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground uppercase">Visibility</p>
          <div className="flex items-center gap-1">
            <p>
              {currentWeather.visibility}
              {getUnit("VISIBILITY", localStorageUnit)}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground uppercase">Pressure</p>
          <div className="flex items-center gap-1">
            <p>
              {currentWeather.pressure}
              {getUnit("PRESSURE", localStorageUnit)}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
