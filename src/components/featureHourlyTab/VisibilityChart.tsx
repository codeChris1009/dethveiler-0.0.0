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
  visibility: {
    label: "Visibility",
    color: "oklch(0.855 0.138 120)", // index.css --chart-7
  },
} satisfies ChartConfig;

export const VisibilityChart = () => {
  // Hooks
  const { weather } = useWeather();

  // Memos
  const chartData = useMemo(() => {
    return weather?.hourly.map((item) => ({
      dt: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      visibility: item.visibility / 1000, // convert to km
    }));
  }, [weather]);

  if (!chartData) return <Skeleton className="h-90" />;

  return (
    <ChartContainer config={chartConfig} className="*h-[360px] w-full">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray={4} />
        <XAxis
          dataKey="dt"
          tickLine={false}
          axisLine={false}
          tickCount={12}
          tickMargin={16}
        />
        <YAxis
          dataKey="visibility"
          tickLine={false}
          axisLine={false}
          tickCount={5}
          tickMargin={16}
          unit={getUnit("VISIBILITY", "metric")}
        />

        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <defs>
          <linearGradient id="fillVisibility" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.9} />
            <stop offset="50%" stopColor="var(--chart-2)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <Area
          dataKey="visibility"
          type="natural"
          fill="url(#fillVisibility)" // index.css 漸層
          fillOpacity={1}
          stroke="var(--chart-1)"
          strokeOpacity={1}
        />

        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
};
