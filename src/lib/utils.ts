import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { subDays, formatISO, fromUnixTime, formatDistance } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  formatEther as viemFormatEther,
  decodeEventLog,
  parseAbiItem,
} from "viem";
import { BlockWithTransactions, L1L2Transaction } from "@/lib/types";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import abiL1CrossDomainMessenger from "@/lib/contracts/l1-cross-domain-messenger/abi";
import abiL2CrossDomainMessenger from "@/lib/contracts/l2-cross-domain-messenger/abi";
import l1CrossDomainMessenger from "./contracts/l1-cross-domain-messenger/contract";
import l2CrossDomainMessenger from "./contracts/l2-cross-domain-messenger/contract";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const fetchL2LatestLogs = async (): Promise<any[]> => {
  try {
    const latestBlock = await l2PublicClient.getBlockNumber();

    const startBlock = latestBlock - BigInt(1000);
    const endBlock = latestBlock;

    const logs = await l2PublicClient.getLogs({
      fromBlock: startBlock,
      toBlock: endBlock,
      address: l2CrossDomainMessenger.address,
      event: parseAbiItem("event RelayedMessage(bytes32 msgHash)"),
    });

    const decodedLogs = logs.map((log) =>
      decodeEventLog({
        abi: abiL2CrossDomainMessenger,
        data: log.data,
        topics: log.topics,
      }),
    );

    return decodedLogs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};

export const fetchL1LatestLogs = async (): Promise<any[]> => {
  try {
    const latestBlock = await l1PublicClient.getBlockNumber();

    const startBlock = latestBlock - BigInt(1000);
    const endBlock = latestBlock;

    const SentMessageLogs = await l1PublicClient.getLogs({
      fromBlock: startBlock,
      toBlock: endBlock,
      address: l1CrossDomainMessenger.address,
      event: parseAbiItem(
        "event SentMessage(address indexed target, address indexed sender, bytes message, uint256 messageNonce, uint256 minGasLimit)",
      ),
    });

    const sentMessageExtension1Logs = await l1PublicClient.getLogs({
      fromBlock: startBlock,
      toBlock: endBlock,
      address: l1CrossDomainMessenger.address,
      event: parseAbiItem(
        "event SentMessageExtension1(address indexed sender, uint256 value)",
      ),
    });

    const decodedSentMessageLogs = SentMessageLogs.map((log) =>
      decodeEventLog({
        abi: abiL1CrossDomainMessenger,
        data: log.data,
        topics: log.topics,
      }),
    );

    const decodedSentMessageExtension1Logs = sentMessageExtension1Logs.map(
      (log) =>
        decodeEventLog({
          abi: abiL1CrossDomainMessenger,
          data: log.data,
          topics: log.topics,
        }),
    );

    return [...decodedSentMessageLogs, ...decodedSentMessageExtension1Logs];
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};

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
