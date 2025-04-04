import { prisma } from "@/lib/prisma";
import { l1PublicClient, l2PublicClient, l2Chain } from "@/lib/chains";

export const fetchL2BlockNumberFromJsonRpc = () =>
  l2PublicClient.getBlockNumber();

export const fetchL2BlockNumberFromDatabase = async () => {
  const {
    _max: { number: latestBlockNumber },
  } = await prisma.block.aggregate({
    where: { chainId: l2Chain.id },
    _max: { number: true },
  });
  return latestBlockNumber ?? fetchL2BlockNumberFromJsonRpc();
};

export const fetchL2BlockNumber = process.env.DATABASE_URL
  ? fetchL2BlockNumberFromDatabase
  : fetchL2BlockNumberFromJsonRpc;

export const fetchL1BlockNumberFromJsonRpc = () =>
  l1PublicClient.getBlockNumber();

export const fetchL1BlockNumberFromDatabase = async () => {
  const {
    _max: { number: latestBlockNumber },
  } = await prisma.l1Block.aggregate({
    where: { chainId: l2Chain.id },
    _max: { number: true },
  });
  return latestBlockNumber ?? fetchL1BlockNumberFromJsonRpc();
};

export const fetchL1BlockNumber = process.env.DATABASE_URL
  ? fetchL1BlockNumberFromDatabase
  : fetchL1BlockNumberFromJsonRpc;

type GetSpotPriceResult = Record<string, number> & { ETH: number; OP: number };

export const fetchSpotPrices = async (date?: string) => {
  const url = date
    ? `https://api.coinbase.com/v2/prices/USD/spot?date=${date}`
    : "https://api.coinbase.com/v2/prices/USD/spot";
  const response = await fetch(url, {
    cache: date ? "force-cache" : "no-store",
  });
  try {
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
      { ETH: 0, OP: 0 },
    );
  } catch (error) {
    console.error(error);
    return { ETH: 0, OP: 0 };
  }
};
