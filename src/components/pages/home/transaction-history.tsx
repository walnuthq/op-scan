"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { formatPrice } from "@/lib/utils";
import { format, parseISO } from "date-fns";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const { date, price, transactions } = payload[0].payload;
    return (
      <div className="rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md">
        <p className="text-xs">
          {format(parseISO(date), "EEEE, MMMM d, yyyy")}
        </p>
        <p>Transactions: {transactions}k</p>
        <p>Price: {formatPrice(price)}</p>
      </div>
    );
  }
  return null;
};

const TransactionHistory = ({
  data,
}: {
  data: {
    name: string;
    date: string;
    price: number;
    transactions: number;
  }[];
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        Transaction history in 14 days
      </CardTitle>
    </CardHeader>
    <CardContent className="h-40">
      <ChartContainer
        className="h-full w-full"
        config={{
          transactions: {
            label: "Transactions:",
            theme: {
              light: "hsl(var(--primary))",
              dark: "hsl(var(--primary))",
            },
          },
        }}
      >
        <LineChart data={data} accessibilityLayer>
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            ticks={
              data.length > 0
                ? [
                    data[0].name,
                    data[Math.floor(data.length / 2)].name,
                    data[data.length - 1].name,
                  ]
                : []
            }
          />
          <YAxis
            tickFormatter={(value) => `${value}k`}
            tickLine={false}
            axisLine={false}
            domain={["dataMin", "dataMax"]}
            ticks={[
              Math.min(...data.map(({ transactions }) => transactions)),
              Math.max(...data.map(({ transactions }) => transactions)),
            ]}
          />
          <Line
            type="monotone"
            dataKey="transactions"
            stroke="var(--color-transactions)"
            strokeWidth={2}
          />
          {<Tooltip content={<CustomTooltip />} />}
        </LineChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

export default TransactionHistory;
