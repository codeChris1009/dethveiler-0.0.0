// Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OverviewChart } from "@/components/featureHourlyTab/OverviewChart";
import { PrecipitationChart } from "@/components/featureHourlyTab/PrecipitationChart";

// Config
import { TABS_LIST } from "@/config/index";

// Types
import type { Tab } from "@/config/index";
import { useState } from "react";

export const HourlyWeatherTabs = () => {
  // State
  const [tab, setTab] = useState<Tab>("overview");
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as Tab)}
      className="py-4 gap-4"
    >
      <div className="flex items-center gap-4">
        <h2 className="uppercase text-lg font-semibold">hourly</h2>

        <TabsList
          className="bg-background gap-2
        overflow-x-auto overflow-y-hidden justify-start"
          style={{ scrollbarWidth: "none" }}
        >
          {TABS_LIST.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="border-none h-9 px-4 rounded-full
                bg-secondary text-secondary-foreground
                hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm
                data-active:bg-primary! data-active:text-primary-foreground! data-active:shadow-lg font-semibold"
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {/* Overview tab */}
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <OverviewChart />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Precipitation tab */}
      <TabsContent value="precipitation">
        <Card>
          <CardHeader>
            <CardTitle>Precipitation</CardTitle>
          </CardHeader>
          <CardContent>
            <PrecipitationChart />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
