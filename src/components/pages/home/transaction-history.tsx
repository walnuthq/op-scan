"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { formatPrice } from "@/lib/utils";
import { subDays, format, parseISO } from "date-fns";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

type DataPoint = {
  name: string;
  date: string;
  price: number;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md">
        <p className="text-xs">
          {format(parseISO(payload[0].payload.date), "EEEE, MMMM d, yyyy")}
        </p>
        <p>Price: {formatPrice(payload[0].payload.price)}</p>
      </div>
    );
  }
  return null;
};

const TransactionHistory = () => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const dates = Array.from({ length: 15 }, (_, i) => {
        const date = subDays(new Date(), 14 - i);
        return {
          name: format(date, "MMM d"),
          formattedDate: format(date, "yyyy-MM-dd"),
        };
      });

      const responses = await Promise.all(
        dates.map(async (dateObj) => {
          const response = await fetch(
            `https://api.coinbase.com/v2/prices/OP-USD/spot?date=${dateObj.formattedDate}`,
          );
          const json = await response.json();
          return {
            name: dateObj.name,
            date: dateObj.formattedDate,
            price: parseFloat(json.data.amount),
          };
        }),
      );

      setData(responses);
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Transaction history in 14 days
        </CardTitle>
      </CardHeader>
      <CardContent className="h-40">
        <ChartContainer className="h-full w-full" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                ticks={
                  data.length > 0
                    ? [data[0].name, data[7].name, data[14].name]
                    : []
                }
              />
              <YAxis
                tickFormatter={(value) => `$ ${String(value).slice(0, 4)}`}
                domain={["dataMin", "dataMax"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                // stroke="var(--chart-1)"
                style={{ stroke: "hsl(var(--primary))" }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
