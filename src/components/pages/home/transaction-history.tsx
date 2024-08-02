"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
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
  transactionsCount: number;
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const { date, price, transactionsCount } = payload[0].payload;
    return (
      <div className="rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md">
        <p className="text-xs">
          {format(parseISO(date), "EEEE, MMMM d, yyyy")}
        </p>
        <p>Price: {formatPrice(price)}</p>
        <p>Transactions: {transactionsCount}k</p>
      </div>
    );
  }
  return null;
};

const TransactionHistory = ({ history }: { history: DataPoint[] }) => {
  const [data, setData] = useState<DataPoint[]>(history);

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
                    ? [data[0].name, data[Math.floor(data.length / 2)].name, data[data.length - 1].name]
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
