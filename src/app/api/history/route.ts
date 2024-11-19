import { NextRequest } from "next/server";
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

const getDates = () =>
  eachDayOfInterval({
    start: subDays(new UTCDate(), transactionsHistoryCount),
    end: subDays(new UTCDate(), 1),
  });

const fetchPrices = () =>
  Promise.all(
    getDates().map((date) =>
      fetchSpotPrices(formatISO(date, { representation: "date" })),
    ),
  );

const fetchTransactionsCount = async () => {
  const queryCounts = getDates()
    .map(
      (date, index) =>
        `COUNT(CASE WHEN "timestamp" >= ${getUnixTime(date)} AND "timestamp" <
          ${getUnixTime(addDays(date, 1))} THEN 1 ELSE NULL END) AS "${index}"`,
    )
    .join(",");
  const rawResult = await prisma.$queryRawUnsafe(
    `SELECT ${queryCounts} FROM "Transaction";`,
  );
  const result = rawResult as Record<number, bigint>[];
  const firstResult = result[0];
  if (!firstResult) {
    return [];
  }
  return Array.from({ ...firstResult, length: transactionsHistoryCount }).map(
    Number,
  );
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
    const [prices, transactionsHistoryCount] = await Promise.all([
      fetchPrices(),
      fetchTransactionsCount(),
    ]);
    const transactionsHistory = getDates().map((date, i) => ({
      date,
      price: prices[i]!.OP,
      transactions: transactionsHistoryCount[i]!,
    }));
    await prisma.$transaction(
      transactionsHistory.map((transactionsHistoryItem) =>
        prisma.transactionsHistory.upsert({
          where: { date: transactionsHistoryItem.date },
          create: transactionsHistoryItem,
          update: transactionsHistoryItem,
        }),
      ),
    );
    return Response.json({ ok: true, transactionsHistory });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false }, { status: 500 });
  }
};
