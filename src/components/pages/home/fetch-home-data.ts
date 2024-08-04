import { prisma } from "@/lib/prisma";
import {
  fromPrismaBlock,
  fromPrismaTransaction,
  fromPrismaTransactionEnqueued,
} from "@/lib/types";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import {
  fetchTokensPrices,
  fetchLatestBlocks,
  fetchLatestTransactionsEnqueued,
} from "@/lib/fetch-data";
import fetchLatestTransactions from "../txs/fetch-transactions";

const fetchHomeDataFromJsonRpc = async () => {
  const [latestL1BlockNumber, latestL2BlockNumber] = await Promise.all([
    l1PublicClient.getBlockNumber(),
    l2PublicClient.getBlockNumber(),
  ]);
  const [
    tokensPrices,
    latestBlocks,
    { transactions: latestTransactions },
    { transactionsEnqueued: latestTransactionsEnqueued },
  ] = await Promise.all([
    fetchTokensPrices(),
    fetchLatestBlocks(latestL2BlockNumber),
    fetchLatestTransactions(latestL2BlockNumber, 0, latestL2BlockNumber),
    fetchLatestTransactionsEnqueued(
      latestL1BlockNumber,
      "0x",
      latestL1BlockNumber,
    ),
  ]);
  return {
    tokensPrices,
    latestBlocks: latestBlocks.slice(0, 6),
    latestTransactions: latestTransactions.slice(0, 6),
    latestTransactionsEnqueued: latestTransactionsEnqueued.slice(0, 10),
  };
};

const fetchHomeDataFromDatabase = async () => {
  const [
    tokensPrices,
    latestBlocks,
    latestTransactions,
    latestTransactionsEnqueued,
  ] = await Promise.all([
    fetchTokensPrices(),
    prisma.block.findMany({
      include: { transactions: true },
      orderBy: { number: "desc" },
      take: 6,
    }),
    prisma.transaction.findMany({
      orderBy: { timestamp: "desc" },
      take: 6,
    }),
    prisma.transactionEnqueued.findMany({
      orderBy: { timestamp: "desc" },
      take: 10,
    }),
  ]);
  return {
    tokensPrices,
    latestBlocks: latestBlocks.map((block) =>
      fromPrismaBlock(block, block.transactions),
    ),
    latestTransactions: latestTransactions.map((transaction) =>
      fromPrismaTransaction(transaction),
    ),
    latestTransactionsEnqueued: latestTransactionsEnqueued.map(
      fromPrismaTransactionEnqueued,
    ),
  };
};

export const fetchHomeData = process.env.DATABASE_URL
  ? fetchHomeDataFromDatabase
  : fetchHomeDataFromJsonRpc;
