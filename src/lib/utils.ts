import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { subDays, formatISO, fromUnixTime, formatDistance } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { formatEther as viemFormatEther, Log, formatUnits } from "viem";
import { BlockWithTransactions, L1L2Transaction } from "@/lib/types";
import { l2PublicClient } from "@/lib/chains";
import { getERC20Contract } from "./contracts/erc-20/contract";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const fetchL2LatestBlocks = async (): Promise<
  BlockWithTransactions[]
> => {
  const latestBlock = await l2PublicClient.getBlock({
    includeTransactions: true,
  });
  const latestBlocks = await Promise.all(
    [1, 2, 3, 4, 5].map((index) =>
      l2PublicClient.getBlock({
        blockNumber: latestBlock.number - BigInt(index),
        includeTransactions: true,
      }),
    ),
  );
  const blocks = [latestBlock, ...latestBlocks];
  return blocks.map(({ number, hash, timestamp, transactions }) => ({
    number,
    hash,
    timestamp,
    transactions: transactions.map(
      ({ hash, blockNumber, from, to, value }) => ({
        hash,
        blockNumber,
        from,
        to,
        value,
        timestamp,
      }),
    ),
  }));
};

export const fetchTokensPrices = async () => {
  const date = formatISO(subDays(new Date(), 1), {
    representation: "date",
  });
  const [
    ethResponseToday,
    ethResponseYesterday,
    opResponseToday,
    opResponseYesterday,
  ] = await Promise.all([
    fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot"),
    fetch(`https://api.coinbase.com/v2/prices/ETH-USD/spot?date=${date}`),
    fetch("https://api.coinbase.com/v2/prices/OP-USD/spot"),
    fetch(`https://api.coinbase.com/v2/prices/OP-USD/spot?date=${date}`),
  ]);
  const [ethJsonToday, ethJsonYesterday, opJsonToday, opJsonYesterday] =
    await Promise.all([
      ethResponseToday.json(),
      ethResponseYesterday.json(),
      opResponseToday.json(),
      opResponseYesterday.json(),
    ]);
  type GetSpotPriceResponse = {
    data: { amount: string; base: string; currency: string };
  };
  const {
    data: { amount: ethPriceToday },
  } = ethJsonToday as GetSpotPriceResponse;
  const {
    data: { amount: ethPriceYesterday },
  } = ethJsonYesterday as GetSpotPriceResponse;
  const {
    data: { amount: opPriceToday },
  } = opJsonToday as GetSpotPriceResponse;
  const {
    data: { amount: opPriceYesterday },
  } = opJsonYesterday as GetSpotPriceResponse;
  return {
    eth: { today: Number(ethPriceToday), yesterday: Number(ethPriceYesterday) },
    op: { today: Number(opPriceToday), yesterday: Number(opPriceYesterday) },
  };
};

export const fetchLatestL1L2Transactions = async (): Promise<
  L1L2Transaction[]
> =>
  Array.from({ length: 6 }, (_, i) => i).map((i) => ({
    l1BlockNumber: BigInt(20105119 - i),
    l1Hash:
      "0xc9f6566bfc6ff30a4d97dde51d011c47259268c8b7051f5ef0d23f407aece9a4",
    l2Hash:
      "0x8d721b30143b799d4b207bbea88cbf187862654357e7ddc318d6616f409045ae",
  }));

export const formatEther = (ether: bigint, precision = 5) =>
  new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(Number(viemFormatEther(ether)));

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    price,
  );

export const formatPercent = (percent: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumSignificantDigits: 3,
    signDisplay: "always",
  }).format(percent);

export const formatTimestamp = (timestamp: bigint, withDate = true) => {
  const timestampDate = fromUnixTime(Number(timestamp));
  const timestampDistance = formatDistance(timestampDate, new Date(), {
    includeSeconds: true,
    addSuffix: true,
  });
  const timestampDateFormatted = formatInTimeZone(
    timestampDate,
    "UTC",
    "MMM-dd-yyyy hh:mm:ss aa +z",
  );
  return withDate
    ? `${timestampDistance} (${timestampDateFormatted})`
    : timestampDistance;
};


const ERC20_TRANSFER_EVENT_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

export interface TokenTransfer {
  from: string;
  to: string;
  tokenAddress: string;
  amount: string;  
  decimals: number;
}

export async function parseTokenTransfers(logs: Log[]): Promise<TokenTransfer[]> {
  const transfers = logs
    .filter(log => log.topics[0] === ERC20_TRANSFER_EVENT_TOPIC)
    .map(log => {
      const [, fromTopic, toTopic] = log.topics;
      const from = `0x${fromTopic?.slice(26)}`;
      const to = `0x${toTopic?.slice(26)}`;
      const amount = BigInt(log.data);
      
      return {
        from,
        to,
        tokenAddress: log.address,
        amount
      };
    });

  const transfersWithDecimals = await Promise.all(
    transfers.map(async (transfer) => {
      try {
        const contract = getERC20Contract(transfer.tokenAddress);
        const decimals = await contract.read.decimals();
        const formattedAmount = formatUnits(transfer.amount, decimals);
        return { 
          ...transfer, 
          amount: formattedAmount,  
          decimals 
        };
      } catch (error) {
        console.error(`Error processing transfer for ${transfer.tokenAddress}:`, error);
        const defaultDecimals = 18;
        return { 
          ...transfer, 
          amount: formatUnits(transfer.amount, defaultDecimals),
          decimals: defaultDecimals 
        };
      }
    })
  );
  return transfersWithDecimals;
}