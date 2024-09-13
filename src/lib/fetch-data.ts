import { prisma } from "@/lib/prisma";
import { l2PublicClient } from "@/lib/chains";

const fetchL2BlockNumberFromJsonRpc = () => l2PublicClient.getBlockNumber();

const fetchL2BlockNumberFromDatabase = async () => {
  const {
    _max: { number: latestBlockNumber },
  } = await prisma.block.aggregate({
    _max: { number: true },
  });
  return latestBlockNumber ?? fetchL2BlockNumberFromJsonRpc();
};

export const fetchL2BlockNumber = process.env.DATABASE_URL
  ? fetchL2BlockNumberFromDatabase
  : fetchL2BlockNumberFromJsonRpc;

type GetSpotPriceResult = Record<string, number>;

export const fetchSpotPrices = async (date?: string) => {
  const url = date
    ? `https://api.coinbase.com/v2/prices/USD/spot?date=${date}`
    : "https://api.coinbase.com/v2/prices/USD/spot";
  const response = await fetch(url, {
    cache: date ? "force-cache" : "no-store",
  });
  const json = await response.json();
  const { data } = json as {
    data: {
      amount: string;
      base: string;
      currency: "USD";
    }[];
  };
  return data.reduce<GetSpotPriceResult>(
    (previousValue, currentValue) => ({
      ...previousValue,
      [currentValue.base]: Number(currentValue.amount),
    }),
    {},
  );
};
