import { prisma } from "@/lib/prisma";
import { range } from "lodash";
import {
  fromPrismaBlock,
  fromPrismaTransaction,
  fromPrismaTransactionEnqueued,
} from "@/lib/types";
import { subDays, format, formatISO } from "date-fns";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import {
  fetchSpotPrices,
  fetchLatestTransactions,
  fetchLatestTransactionsEnqueued,
} from "@/lib/fetch-data";
import fetchBlocks from "@/components/pages/blocks/fetch-blocks";

const fetchTransactionsHistory = () =>
  Promise.all(
    range(14, -1).map(async (i) => {
      const rawDate = subDays(new Date(), i);
      const date = formatISO(rawDate, { representation: "date" });
      const prices = await fetchSpotPrices(date);
      return {
        name: format(rawDate, "MMM d"),
        date,
        price: prices.OP,
        transactions: Math.floor(Math.random() * 200) + 400,
      };
    }),
  );

const fetchHomeDataFromJsonRpc = async () => {
  const [latestL1BlockNumber, latestL2BlockNumber] = await Promise.all([
    l1PublicClient.getBlockNumber(),
    l2PublicClient.getBlockNumber(),
  ]);
  const [
    pricesToday,
    pricesYesterday,
    blocks,
    { transactions },
    { transactionsEnqueued },
    transactionsHistory,
  ] = await Promise.all([
    fetchSpotPrices(),
    fetchSpotPrices(
      formatISO(subDays(new Date(), 1), {
        representation: "date",
      }),
    ),
    fetchBlocks(latestL2BlockNumber),
    fetchLatestTransactions(latestL2BlockNumber, 0, latestL2BlockNumber),
    fetchLatestTransactionsEnqueued(
      latestL1BlockNumber,
      "0x",
      latestL1BlockNumber,
    ),
    fetchTransactionsHistory(),
  ]);
  return {
    pricesToday,
    pricesYesterday,
    blocks: blocks.slice(0, 6),
    transactions: transactions.slice(0, 6),
    transactionsEnqueued: transactionsEnqueued.slice(0, 10),
    transactionsHistory,
  };
};

const fetchHomeDataFromDatabase = async () => {
  const [
    pricesToday,
    pricesYesterday,
    blocks,
    transactions,
    transactionsEnqueued,
    transactionsHistory,
  ] = await Promise.all([
    fetchSpotPrices(),
    fetchSpotPrices(
      formatISO(subDays(new Date(), 1), {
        representation: "date",
      }),
    ),
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
    fetchTransactionsHistory(),
  ]);
  return {
    pricesToday,
    pricesYesterday,
    blocks: blocks.map((block) => fromPrismaBlock(block)),
    transactions: transactions.map((transaction) =>
      fromPrismaTransaction(transaction),
    ),
    transactionsEnqueued: transactionsEnqueued.map(
      fromPrismaTransactionEnqueued,
    ),
    transactionsHistory,
  };
};

const fetchHomeData = process.env.DATABASE_URL
  ? fetchHomeDataFromDatabase
  : fetchHomeDataFromJsonRpc;

export default fetchHomeData;
