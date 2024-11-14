import {
  prisma,
  fromPrismaBlock,
  fromPrismaTransaction,
  fromPrismaTransactionEnqueued,
} from "@/lib/prisma";
import { subDays, format, formatISO, getUnixTime } from "date-fns";
import { fetchSpotPrices } from "@/lib/fetch-data";

const SECONDS_IN_DAY = 24 * 60 * 60;

const fetchPrices = () =>
  Promise.all([
    fetchSpotPrices(
      formatISO(subDays(new Date().setUTCHours(0, 0, 0, 0), 1), {
        representation: "date",
      }),
    ),
    fetchSpotPrices(),
  ]);

const fetchTransactionsCount = async () => {
  const timestamp = getUnixTime(new Date().setUTCHours(0, 0, 0, 0));
  const rawResult = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*) AS "total",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp} AND
      ${timestamp + SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "totalToday"
    FROM "Transaction";
  `);
  const result = rawResult as {
    total: bigint;
    totalToday: bigint;
  }[];
  const firstResult = result[0];
  if (!firstResult) {
    return { transactionsCount: 0, transactionsCountToday: 0 };
  }
  return {
    transactionsCount: Number(firstResult.total),
    transactionsCountToday: Number(firstResult.totalToday),
  };
};

const fetchHomeData = async () => {
  const [
    prices,
    blocks,
    transactions,
    { transactionsCount, transactionsCountToday },
    transactionsEnqueued,
    transactionsHistory,
  ] = await Promise.all([
    fetchPrices(),
    prisma.block.findMany({
      include: { transactions: true },
      orderBy: { number: "desc" },
      take: 6,
    }),
    prisma.transaction.findMany({
      orderBy: [{ blockNumber: "desc" }, { transactionIndex: "desc" }],
      take: 6,
    }),
    fetchTransactionsCount(),
    prisma.transactionEnqueued.findMany({
      orderBy: [{ l1BlockNumber: "desc" }, { l2TxHash: "asc" }],
      take: 10,
    }),
    prisma.transactionsHistory.findMany({
      orderBy: { date: "desc" },
      take: 14,
    }),
  ]);
  if (transactionsHistory.length === 0) {
    transactionsHistory.push(
      {
        date: subDays(new Date().setUTCHours(0, 0, 0, 0), 1),
        price: prices[0].OP,
        transactions: Math.random() * 100000,
      },
      {
        date: subDays(new Date().setUTCHours(0, 0, 0, 0), 2),
        price: prices[0].OP,
        transactions: Math.random() * 100000,
      },
    );
  }
  const transactionsHistorySum = transactionsHistory.reduce(
    (previousValue, currentValue) => previousValue + currentValue.transactions,
    0,
  );
  return {
    pricesYesterday: prices[0]!,
    pricesToday: prices[1]!,
    blocks: blocks.map((block) => fromPrismaBlock(block)),
    transactions: transactions.map((transaction) =>
      fromPrismaTransaction(transaction),
    ),
    transactionsCount,
    tps: transactionsHistorySum / (transactionsHistory.length * SECONDS_IN_DAY),
    transactionsEnqueued: transactionsEnqueued.map(
      fromPrismaTransactionEnqueued,
    ),
    transactionsHistory: [
      ...transactionsHistory.reverse(),
      {
        date: new Date(),
        price: prices[1].OP,
        transactions: transactionsCountToday,
      },
    ].map((transactionsHistoryItem) => ({
      ...transactionsHistoryItem,
      name: format(transactionsHistoryItem.date, "MMM d"),
      date: formatISO(transactionsHistoryItem.date, {
        representation: "date",
      }),
    })),
  };
};

export default fetchHomeData;
