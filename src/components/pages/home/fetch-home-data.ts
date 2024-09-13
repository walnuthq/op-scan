import {
  prisma,
  fromPrismaBlock,
  fromPrismaTransaction,
  fromPrismaTransactionEnqueued,
} from "@/lib/prisma";
import { range } from "lodash";
import { subDays, format, formatISO, getUnixTime } from "date-fns";
import { fetchSpotPrices } from "@/lib/fetch-data";

const SECONDS_IN_DAY = 24 * 60 * 60;

const fetchTransactionsHistory = () =>
  Promise.all(
    range(14, -1).map(async (i) => {
      const rawDate = subDays(new Date().setUTCHours(0, 0, 0, 0), i);
      const timestamp = getUnixTime(rawDate);
      const date = formatISO(rawDate, { representation: "date" });
      const [transactions, prices] = await Promise.all([
        prisma.transaction.count({
          where: {
            timestamp: { gte: timestamp, lt: timestamp + SECONDS_IN_DAY },
          },
        }),
        fetchSpotPrices(date),
      ]);
      return {
        name: format(rawDate, "MMM d"),
        date,
        price: prices.OP,
        transactions,
      };
    }),
  );

const fetchHomeData = async () => {
  const [
    pricesToday,
    pricesYesterday,
    blocks,
    transactions,
    transactionsCount,
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
      orderBy: [{ blockNumber: "desc" }, { transactionIndex: "desc" }],
      take: 6,
    }),
    prisma.transaction.count(),
    prisma.transactionEnqueued.findMany({
      orderBy: [{ l1BlockNumber: "desc" }, { l2TxHash: "asc" }],
      take: 10,
    }),
    fetchTransactionsHistory(),
  ]);
  const transactionsHistorySum = transactionsHistory.reduce(
    (previousValue, currentValue) => previousValue + currentValue.transactions,
    0,
  );
  return {
    pricesToday,
    pricesYesterday,
    blocks: blocks.map((block) => fromPrismaBlock(block)),
    transactions: transactions.map((transaction) =>
      fromPrismaTransaction(transaction),
    ),
    transactionsCount,
    tps: transactionsHistorySum / (transactionsHistory.length * SECONDS_IN_DAY),
    transactionsEnqueued: transactionsEnqueued.map(
      fromPrismaTransactionEnqueued,
    ),
    transactionsHistory,
  };
};

export default fetchHomeData;
