import {
  prisma,
  fromPrismaBlock,
  fromPrismaTransactionWithAccounts,
  fromPrismaTransactionEnqueued,
} from "@/lib/prisma";
import { transactionsHistoryCount } from "@/lib/constants";
import {
  format,
  formatISO,
  startOfDay,
  subDays,
  differenceInSeconds,
} from "date-fns";
import { UTCDate } from "@date-fns/utc";
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

const fetchHomeData = async () => {
  const [
    prices,
    blocks,
    transactions,
    transactionsEnqueued,
    transactionHistory,
    transactionsHistory,
  ] = await Promise.all([
    fetchPrices(),
    prisma.block.findMany({
      orderBy: { number: "desc" },
      take: 6,
    }),
    prisma.transaction.findMany({
      orderBy: [{ blockNumber: "desc" }, { transactionIndex: "desc" }],
      include: { accounts: true },
      take: 6,
    }),
    prisma.transactionEnqueued.findMany({
      orderBy: [{ l1BlockNumber: "desc" }, { l2TxHash: "asc" }],
      take: 10,
    }),
    prisma.transactionsHistory.findUnique({
      where: { date: new UTCDate(0) },
    }),
    prisma.transactionsHistory.findMany({
      orderBy: { date: "desc" },
      take: transactionsHistoryCount + 1,
    }),
  ]);
  const transactionsHistorySum = transactionsHistory.reduce(
    (previousValue, currentValue) => previousValue + currentValue.transactions,
    0,
  );
  return {
    pricesYesterday: prices[0],
    pricesToday: prices[1],
    blocks: blocks.map((block) => fromPrismaBlock(block)),
    transactions: transactions.map((transaction) =>
      fromPrismaTransactionWithAccounts(transaction),
    ),
    transactionsCount: transactionHistory ? transactionHistory.transactions : 0,
    tps:
      transactionsHistorySum /
      differenceInSeconds(
        new UTCDate(),
        subDays(startOfDay(new UTCDate()), transactionsHistoryCount),
      ),
    transactionsEnqueued: transactionsEnqueued.map(
      fromPrismaTransactionEnqueued,
    ),
    transactionsHistory: transactionsHistory
      .reverse()
      .map((transactionsHistoryItem) => ({
        ...transactionsHistoryItem,
        name: format(transactionsHistoryItem.date, "MMM d"),
        date: formatISO(transactionsHistoryItem.date, {
          representation: "date",
        }),
      })),
  };
};

export default fetchHomeData;
