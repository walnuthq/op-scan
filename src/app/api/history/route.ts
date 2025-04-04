import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  addDays,
  subDays,
  formatISO,
  getUnixTime,
  eachDayOfInterval,
} from "date-fns";
import { UTCDate } from "@date-fns/utc";
import { fetchSpotPrices } from "@/lib/fetch-data";
import { transactionsHistoryCount } from "@/lib/constants";
import { l2Chain } from "@/lib/chains";

const getDates = () =>
  eachDayOfInterval({
    start: subDays(new UTCDate(), transactionsHistoryCount),
    end: new UTCDate(),
  });

const fetchPrices = () =>
  Promise.all(
    getDates().map((date) =>
      fetchSpotPrices(formatISO(date, { representation: "date" })),
    ),
  );

const fetchTransactionsHistoryCount = async () => {
  const queryCounts = getDates()
    .map(
      (date, index) =>
        `COUNT(CASE WHEN "timestamp" >= ${getUnixTime(date)} AND "timestamp" <
          ${getUnixTime(addDays(date, 1))} THEN 1 ELSE NULL END) AS "${index}"`,
    )
    .join(",");
  const rawResult = await prisma.$queryRawUnsafe(
    `SELECT ${queryCounts} FROM "Transaction" WHERE "chainId" = ${l2Chain.id};`,
  );
  const result = rawResult as Record<number, bigint>[];
  const firstResult = result[0];
  if (!firstResult) {
    return [];
  }
  return Array.from({
    ...firstResult,
    length: transactionsHistoryCount + 1,
  }).map(Number);
};

export const GET = async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  try {
    const [prices, transactionsHistoryCount, transactionsCount] =
      await Promise.all([
        fetchPrices(),
        fetchTransactionsHistoryCount(),
        prisma.transaction.count({ where: { chainId: l2Chain.id } }),
      ]);
    const transactionsHistory = [
      { date: new UTCDate(0), price: 0, transactions: transactionsCount },
      ...getDates().map((date, i) => ({
        date,
        price: prices[i]!.OP,
        transactions: transactionsHistoryCount[i]!,
      })),
    ];
    await prisma.$transaction(
      transactionsHistory.map((transactionsHistoryItem) =>
        prisma.transactionsHistory.upsert({
          where: {
            date_chainId: { date: transactionsHistoryItem.date, chainId: 1 },
          },
          create: { ...transactionsHistoryItem, chainId: l2Chain.id },
          update: { ...transactionsHistoryItem, chainId: l2Chain.id },
        }),
      ),
    );
    return Response.json({ ok: true, transactionsHistory });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false }, { status: 500 });
  }
};
