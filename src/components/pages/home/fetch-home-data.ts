import { prisma } from "@/lib/prisma";
import {
  fromPrismaBlock,
  fromPrismaTransaction,
  fromPrismaTransactionEnqueued,
} from "@/lib/types";
import { subDays, format } from "date-fns";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import {
  fetchTokensPrices,
  fetchLatestBlocks,
  fetchLatestTransactions,
  fetchLatestTransactionsEnqueued,
} from "@/lib/fetch-data";

const fetchTransactionHistory = async () => {
  const dates = Array.from({ length: 15 }, (_, i) => {
    const date = subDays(new Date(), 14 - i);
    return {
      name: format(date, "MMM d"),
      formattedDate: format(date, "yyyy-MM-dd"),
    };
  });

  const responses = await Promise.all(
    dates.map(async (dateObj) => {
      const response = await fetch(
        `https://api.coinbase.com/v2/prices/OP-USD/spot?date=${dateObj.formattedDate}`,
      );
      const res = await response.json();
      return {
        name: dateObj.name,
        date: dateObj.formattedDate,
        price: parseFloat(res.data.amount),
        transactionsCount: Math.floor(Math.random() * 200) + 400,
      };
    }),
  );

  return responses;
};

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
    transactionHistory,
  ] = await Promise.all([
    fetchTokensPrices(),
    fetchLatestBlocks(latestL2BlockNumber),
    fetchLatestTransactions(latestL2BlockNumber, 0, latestL2BlockNumber),
    fetchLatestTransactionsEnqueued(
      latestL1BlockNumber,
      "0x",
      latestL1BlockNumber,
    ),
    fetchTransactionHistory(),
  ]);
  return {
    tokensPrices,
    latestBlocks: latestBlocks.slice(0, 6),
    latestTransactions: latestTransactions.slice(0, 6),
    latestTransactionsEnqueued: latestTransactionsEnqueued.slice(0, 10),
    transactionHistory,
  };
};

const fetchHomeDataFromDatabase = async () => {
  const [
    tokensPrices,
    latestBlocks,
    latestTransactions,
    latestTransactionsEnqueued,
    transactionHistory,
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
    fetchTransactionHistory(),
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
    transactionHistory,
  };
};

export  const fetchHomeData = process.env.DATABASE_URL
  ? fetchHomeDataFromDatabase
  : fetchHomeDataFromJsonRpc;
