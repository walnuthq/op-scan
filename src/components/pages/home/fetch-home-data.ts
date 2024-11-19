import {
  prisma,
  fromPrismaBlock,
  fromPrismaTransaction,
  fromPrismaTransactionEnqueued,
} from "@/lib/prisma";
import { transactionsHistoryCount } from "@/lib/constants";
import {
  format,
  formatISO,
  getUnixTime,
  startOfDay,
  addDays,
  subDays,
} from "date-fns";
import { UTCDate } from "@date-fns/utc";
import { secondsInDay } from "date-fns/constants";
import { fetchSpotPrices } from "@/lib/fetch-data";

const fetchPrices = () =>
  Promise.all([
    fetchSpotPrices(
      formatISO(subDays(startOfDay(new UTCDate()), 1), {
        representation: "date",
      }),
    ),
    fetchSpotPrices(),
  ]);

const fetchTransactionsCount = async () => {
  const today = startOfDay(new UTCDate());
  const rawResult = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*) AS "transactionsCount",
    COUNT(CASE WHEN "timestamp" >= ${getUnixTime(today)} AND "timestamp" <
      ${getUnixTime(addDays(today, 1))} THEN 1 ELSE NULL END) AS "transactionsCountToday"
    FROM "Transaction";
  `);
  const result = rawResult as {
    transactionsCount: bigint;
    transactionsCountToday: bigint;
  }[];
  const firstResult = result[0];
  if (!firstResult) {
    return { transactionsCount: 0, transactionsCountToday: 0 };
  }
  return {
    transactionsCount: Number(firstResult.transactionsCount),
    transactionsCountToday: Number(firstResult.transactionsCountToday),
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
      take: transactionsHistoryCount,
    }),
  ]);
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
    tps: transactionsHistorySum / (transactionsHistory.length * secondsInDay),
    transactionsEnqueued: transactionsEnqueued.map(
      fromPrismaTransactionEnqueued,
    ),
    transactionsHistory: [
      ...transactionsHistory.reverse(),
      {
        date: startOfDay(new UTCDate()),
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
