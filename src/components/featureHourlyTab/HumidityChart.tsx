// Hooks
import { useMemo } from "react";
import { useWeather } from "@/hooks/useWeather";

// Components
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

// // Config
// import { getUnit } from "@/config/index";

// Types
import type { ChartConfig } from "@/components/ui/chart";

// Chart config
const chartConfig: ChartConfig = {
  humidity: {
    label: "Humidity",
    color: "oklch(0.855 0.138 181.071)", // index.css --chart-1
  },
  dew_point: {
    label: "Dew Point",
    color: "oklch(0.552 0.016 285.938)", // index.css --muted-foreground
  },
} satisfies ChartConfig;

export const HumidityChart = () => {
  // Hooks
  const { weather } = useWeather();

  // Memos
  const chartData = useMemo(() => {
    return weather?.hourly.map((item) => ({
      dt: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      humidity: item.humidity,
      dew_point: item.dew_point,
    }));
  }, [weather]);

  if (!chartData) return <Skeleton className="h-90" />;

  return (
    <ChartContainer config={chartConfig} className="*h-[360px] w-full">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray={4} />
        <XAxis
          dataKey="hour"
          tickLine={false}
          axisLine={false}
          tickCount={12}
          tickMargin={16}
        />
        <YAxis
          dataKey="humidity"
          tickLine={false}
          axisLine={false}
          tickCount={5}
          tickMargin={16}
        />

        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <defs>
          <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <Area
          dataKey="humidity"
          type="natural"
          fill="url(#fillHumidity)" // index.css 漸層
          fillOpacity={1}
          stroke="var(--chart-1)"
          strokeOpacity={1}
        />

        <Area
          dataKey="dew_point"
          type="natural"
          fill="oklch(0.60276 0.17218 303.962)"
          fillOpacity={0}
          stroke="oklch(0.60276 0.17218 303.962)"
          strokeWidth={2}
          activeDot={false}
        />

        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
};
