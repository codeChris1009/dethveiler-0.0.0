import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Customer Types
import type { GeoLocationRes } from "@/types/index";

// Utils Helper functions
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom Utils
export const getUserLocation = (): Promise<GeoLocationRes> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Failed to get geolocation: ${error.message}`));
        },
      );
    }
  });
};
