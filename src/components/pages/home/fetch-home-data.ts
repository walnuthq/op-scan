import {
  prisma,
  fromPrismaBlock,
  fromPrismaTransaction,
  fromPrismaTransactionEnqueued,
} from "@/lib/prisma";
import { range } from "lodash";
import { subDays, format, formatISO } from "date-fns";
import { fetchSpotPrices } from "@/lib/fetch-data";

const SECONDS_IN_DAY = 24 * 60 * 60;

const getDates = () =>
  range(14, -1).map((i) => subDays(new Date().setUTCHours(0, 0, 0, 0), i));

const fetchPrices = () =>
  Promise.all([
    ...getDates()
      .slice(0, -1)
      .map((date) =>
        fetchSpotPrices(formatISO(date, { representation: "date" })),
      ),
    fetchSpotPrices(),
  ]);

const fetchTransactionsCount = async () => {
  const rawResult = await prisma.$queryRaw`
    SELECT COUNT(*) AS "total",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 14) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 13) THEN 1 ELSE NULL END) AS "total14DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 13) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 12) THEN 1 ELSE NULL END) AS "total13DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 12) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 11) THEN 1 ELSE NULL END) AS "total12DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 11) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 10) THEN 1 ELSE NULL END) AS "total11DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 10) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 9) THEN 1 ELSE NULL END) AS "total10DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 9) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 8) THEN 1 ELSE NULL END) AS "total9DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 8) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 7) THEN 1 ELSE NULL END) AS "total8DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 7) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 6) THEN 1 ELSE NULL END) AS "total7DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 6) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 5) THEN 1 ELSE NULL END) AS "total6DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 5) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 4) THEN 1 ELSE NULL END) AS "total5DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 4) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 3) THEN 1 ELSE NULL END) AS "total4DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 3) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 2) THEN 1 ELSE NULL END) AS "total3DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 2) AND
      EXTRACT(EPOCH FROM CURRENT_DATE - 1) THEN 1 ELSE NULL END) AS "total2DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 1) AND
      EXTRACT(EPOCH FROM CURRENT_DATE) THEN 1 ELSE NULL END) AS "totalYesterday",
    COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE) AND
      EXTRACT(EPOCH FROM CURRENT_DATE + 1) THEN 1 ELSE NULL END) AS "totalToday"
    FROM "Transaction";
  `;
  const result = rawResult as {
    total: bigint;
    total14DaysAgo: bigint;
    total13DaysAgo: bigint;
    total12DaysAgo: bigint;
    total11DaysAgo: bigint;
    total10DaysAgo: bigint;
    total9DaysAgo: bigint;
    total8DaysAgo: bigint;
    total7DaysAgo: bigint;
    total6DaysAgo: bigint;
    total5DaysAgo: bigint;
    total4DaysAgo: bigint;
    total3DaysAgo: bigint;
    total2DaysAgo: bigint;
    totalYesterday: bigint;
    totalToday: bigint;
  }[];
  const firstResult = result[0];
  if (!firstResult) {
    return { transactionsTotalCount: 0, transactionsHistoryCount: [] };
  }
  return {
    transactionsTotalCount: Number(firstResult.total),
    transactionsHistoryCount: [
      Number(firstResult.total14DaysAgo),
      Number(firstResult.total13DaysAgo),
      Number(firstResult.total12DaysAgo),
      Number(firstResult.total11DaysAgo),
      Number(firstResult.total10DaysAgo),
      Number(firstResult.total9DaysAgo),
      Number(firstResult.total8DaysAgo),
      Number(firstResult.total7DaysAgo),
      Number(firstResult.total6DaysAgo),
      Number(firstResult.total5DaysAgo),
      Number(firstResult.total4DaysAgo),
      Number(firstResult.total3DaysAgo),
      Number(firstResult.total2DaysAgo),
      Number(firstResult.totalYesterday),
      Number(firstResult.totalToday),
    ],
  };
};

const fetchHomeData = async () => {
  const [
    prices,
    blocks,
    transactions,
    { transactionsTotalCount, transactionsHistoryCount },
    transactionsEnqueued,
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
  ]);
  const transactionsHistory = getDates().map((date, i) => ({
    name: format(date, "MMM d"),
    date: formatISO(date, { representation: "date" }),
    price: prices[i]!.OP,
    transactions: transactionsHistoryCount[i]!,
  }));
  const transactionsHistorySum = transactionsHistoryCount.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0,
  );
  return {
    pricesToday: prices[14]!,
    pricesYesterday: prices[13]!,
    blocks: blocks.map((block) => fromPrismaBlock(block)),
    transactions: transactions.map((transaction) =>
      fromPrismaTransaction(transaction),
    ),
    transactionsCount: transactionsTotalCount,
    tps:
      transactionsHistorySum /
      (transactionsHistoryCount.length * SECONDS_IN_DAY),
    transactionsEnqueued: transactionsEnqueued.map(
      fromPrismaTransactionEnqueued,
    ),
    transactionsHistory,
  };
};

export default fetchHomeData;
