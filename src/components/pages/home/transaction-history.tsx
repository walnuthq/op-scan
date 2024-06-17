"use client";
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
import { formatPrice } from "@/lib/utils";
import { subDays, format, parseISO } from "date-fns";

const data = Array.from({ length: 15 }, (_, i) => i).map((i) => {
  const date = subDays(new Date(), 15 - i);
  return {
    name: format(date, "MMM d"),
    date: format(date, "yyyy-MM-dd"),
    transactionsCount: Math.floor(Math.random() * 200) + 400,
    price: 2,
  };
});

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md">
        <p className="test-xs">
          {format(parseISO(payload[0].payload.date), "EEEE, MMMM d, yyyy")}
        </p>
        <p>Transactions: {payload[0].value}k</p>
        <p>Price: {formatPrice(payload[0].payload.price)}</p>
      </div>
    );
  }
  return null;
};

const TransactionHistory = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        Transaction history in 14 days
      </CardTitle>
    </CardHeader>
    <CardContent className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={300} height={100} data={data}>
          <XAxis
            dataKey="name"
            ticks={[data[0].name, data[7].name, data[14].name]}
          />
          <YAxis
            tickFormatter={(value) => `${value}k`}
            domain={["dataMin", "dataMax"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="transactionsCount"
            style={{ stroke: "hsl(var(--primary))" }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default TransactionHistory;
