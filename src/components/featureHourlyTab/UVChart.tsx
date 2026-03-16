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

// Types
import type { ChartConfig } from "@/components/ui/chart";

// Chart config
const chartConfig: ChartConfig = {
  uv: {
    label: "UV Index",
    color: "oklch(0.855 0.138 60)", // index.css --chart-4
  },
} satisfies ChartConfig;

export const UVChart = () => {
  // Hooks
  const { weather } = useWeather();

  // Memos
  const chartData = useMemo(() => {
    return weather?.hourly.map((item) => ({
      dt: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      uv: item.uvi,
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
          dataKey="uv"
          tickLine={false}
          axisLine={false}
          tickCount={5}
          tickMargin={16}
        />

        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <defs>
          <linearGradient id="fillUV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.9} />
            <stop offset="50%" stopColor="var(--chart-5)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--chart-6)" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <Area
          dataKey="uv"
          type="natural"
          fill="url(#fillUV)" // index.css 漸層
          fillOpacity={1}
          stroke="var(--chart-4)"
          strokeOpacity={1}
        />

        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
};
