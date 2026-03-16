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

// Config
import { getUnit } from "@/config/index";

// Types
import type { ChartConfig } from "@/components/ui/chart";

// Chart config
const chartConfig: ChartConfig = {
  temperature: {
    label: "Temperature",
    color: "oklch(0.855 0.138 181.071)", // index.css --chart-1
  },
  feels: {
    label: "Feels Like",
    color: "oklch(0.552 0.016 285.938)", // index.css --muted-foreground
  },
} satisfies ChartConfig;

export const OverviewChart = () => {
  // Hooks
  const { weather } = useWeather();

  // Memos
  const chartData = useMemo(() => {
    return weather?.hourly.map((item) => ({
      dt: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      temperature: item.temp,
      feels: item.feels_like,
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
          dataKey="temperature"
          tickLine={false}
          axisLine={false}
          tickCount={5}
          tickMargin={16}
          tickFormatter={(value) => `${value}${getUnit("DEGREE", "metric")}`}
        />

        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <defs>
          <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.9} />
            <stop offset="60%" stopColor="var(--chart-2)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <Area
          dataKey="temperature"
          type="natural"
          fill="url(#fillTemperature)" // index.css 漸層
          fillOpacity={1}
          stroke="var(--chart-1)"
          strokeOpacity={1}
        />

        <Area
          dataKey="feels"
          type="natural"
          fillOpacity={0}
          stroke="oklch(0.60276 0.17218 303.962)" // 指定的紫色
          strokeWidth={2}
          activeDot={false}
        />

        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
};
