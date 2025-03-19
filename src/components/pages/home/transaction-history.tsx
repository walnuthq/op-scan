"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import { uniq } from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { formatPrice, formatNumber } from "@/lib/utils";
import { format, parseISO } from "date-fns";

type DataItem = {
  name: string;
  date: string;
  price: number;
  transactions: number;
};

const getTicks = (data: DataItem[]) => {
  const firstItem = data.at(0);
  const middleItem = data[Math.floor(data.length / 2)];
  const lastItem = data.at(-1);
  return data.length > 0
    ? [
        firstItem ? firstItem.name : "",
        middleItem ? middleItem.name : "",
        lastItem ? lastItem.name : "",
      ]
    : [];
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const [firstPayload] = payload;
    if (!firstPayload) {
      return null;
    }
    const { date, price, transactions } = firstPayload.payload;
    return (
      <div className="bg-popover text-popover-foreground rounded-md border px-3 py-1.5 text-sm shadow-md">
        <p className="text-xs">
          {format(parseISO(date), "EEEE, MMMM d, yyyy")}
        </p>
        <p>
          Transactions: {formatNumber(transactions, { notation: "compact" })}
        </p>
        <p>Price: {formatPrice(price)}</p>
      </div>
    );
  }
  return null;
};

const TransactionHistory = ({ data }: { data: DataItem[] }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">
        Transaction history in {data.length - 1} days
      </CardTitle>
    </CardHeader>
    <CardContent className="h-40">
      <ChartContainer
        className="h-full w-full"
        config={{
          transactions: {
            label: "Transactions:",
            theme: {
              light: "var(--primary)",
              dark: "var(--primary)",
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
            ticks={getTicks(data)}
          />
          <YAxis
            tickFormatter={(value) =>
              formatNumber(value, { notation: "compact" })
            }
            tickLine={false}
            axisLine={false}
            domain={["dataMin", "dataMax"]}
            ticks={uniq([
              Math.min(...data.map(({ transactions }) => transactions)),
              Math.max(...data.map(({ transactions }) => transactions)),
            ])}
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
