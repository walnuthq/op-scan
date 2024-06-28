import {
  Transaction,
  fromPrismaBlockWithTransactions,
  fromPrismaTransaction,
} from "@/lib/types";
import { subDays, formatISO } from "date-fns";
import { BlockWithTransactions, L1L2Transaction } from "@/lib/types";
import { l2PublicClient } from "@/lib/chains";
import l2OutputOracle from "@/lib/contracts/l2-output-oracle/contract";
import { prisma } from "@/lib/prisma";
import { fetchL1L2LatestTransactions } from "@/lib/utils"

const fetchL2LatestBlocks = async (): Promise<BlockWithTransactions[]> => {
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

const fetchTokensPrices = async () => {
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

const fetchLatestL1L2Transactions = async (): Promise<L1L2Transaction[]> => {
  try {
    const transactions = await fetchL1L2LatestTransactions();
    return transactions.slice(-10);
  } catch (error) {
    console.error("Error fetching latest L1L2 transactions:", error);
    throw error;
  }
};

export const fetchHomePageData = async () => {
  const [
    tokensPrices,
    latestBlocks,
    deployConfig,
    latestTransactions,
    latestL1L2Transactions,
  ] = await Promise.all([
    fetchTokensPrices(),
    prisma.block.findMany({
      include: { transactions: true },
      orderBy: { number: "desc" },
      take: 6,
    }),
    prisma.deployConfig.findFirst(),
    prisma.transaction.findMany({
      orderBy: { timestamp: "desc" },
      take: 6,
    }),
    fetchLatestL1L2Transactions(),
  ]);
  if (!deployConfig) {
    const [latestBlocksFromJsonRpc, l2BlockTime] = await Promise.all([
      fetchL2LatestBlocks(),
      l2OutputOracle.read.l2BlockTime(),
    ]);
    const latestTransactionsFromJsonRpc = latestBlocksFromJsonRpc
      .reduce<
        Transaction[]
      >((txns, block) => [...txns, ...block.transactions.reverse()], [])
      .slice(0, 6);
    return {
      tokensPrices,
      latestBlocks: latestBlocksFromJsonRpc,
      l2BlockTime,
      latestTransactions: latestTransactionsFromJsonRpc,
      latestL1L2Transactions,
    };
  }
  return {
    tokensPrices,
    latestBlocks: latestBlocks.map(fromPrismaBlockWithTransactions),
    l2BlockTime: deployConfig.l2BlockTime,
    latestTransactions: latestTransactions.map(fromPrismaTransaction),
    latestL1L2Transactions,
  };
};
