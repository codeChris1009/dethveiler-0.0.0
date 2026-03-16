/**
 * Types
 */
export type Tab =
  | "overview"
  | "precipitation"
  | "wind"
  | "humidity"
  | "cloudCover"
  | "pressure"
  | "uv"
  | "visibility"
  | "feelsLike";

/**
 * Constants
 */
export const TABS_LIST = [
  {
    title: "Overview",
    value: "overview",
  },
  {
    title: "Precipitation",
    value: "precipitation",
  },
  {
    title: "Wind",
    value: "wind",
  },
  {
    title: "Humidity",
    value: "humidity",
  },
  {
    title: "Cloud cover",
    value: "cloudCover",
  },
  {
    title: "Pressure",
    value: "pressure",
  },
  {
    title: "UV",
    value: "uv",
  },
  {
    title: "Visibility",
    value: "visibility",
  },
  {
    title: "Feels like",
    value: "feelsLike",
  },
];
