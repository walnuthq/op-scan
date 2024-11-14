import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { range } from "lodash";
import { subDays, formatISO, getUnixTime } from "date-fns";
import { fetchSpotPrices } from "@/lib/fetch-data";

const SECONDS_IN_DAY = 24 * 60 * 60;

const getDates = () =>
  range(14, 0, -1).map((i) => subDays(new Date().setUTCHours(0, 0, 0, 0), i));

const fetchPrices = () =>
  Promise.all(
    getDates().map((date) =>
      fetchSpotPrices(formatISO(date, { representation: "date" })),
    ),
  );

const fetchTransactionsCount = async () => {
  const timestamp = getUnixTime(new Date().setUTCHours(0, 0, 0, 0));
  const rawResult = await prisma.$queryRawUnsafe(`
    SELECT COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 14 * SECONDS_IN_DAY} AND
      ${timestamp - 13 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total14DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 13 * SECONDS_IN_DAY} AND
      ${timestamp - 12 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total13DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 12 * SECONDS_IN_DAY} AND
      ${timestamp - 11 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total12DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 11 * SECONDS_IN_DAY} AND
      ${timestamp - 10 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total11DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 10 * SECONDS_IN_DAY} AND
      ${timestamp - 9 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total10DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 9 * SECONDS_IN_DAY} AND
      ${timestamp - 8 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total9DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 8 * SECONDS_IN_DAY} AND
      ${timestamp - 7 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total8DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 7 * SECONDS_IN_DAY} AND
      ${timestamp - 6 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total7DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 6 * SECONDS_IN_DAY} AND
      ${timestamp - 5 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total6DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 5 * SECONDS_IN_DAY} AND
      ${timestamp - 4 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total5DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 4 * SECONDS_IN_DAY} AND
      ${timestamp - 3 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total4DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 3 * SECONDS_IN_DAY} AND
      ${timestamp - 2 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total3DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 2 * SECONDS_IN_DAY} AND
      ${timestamp - 1 * SECONDS_IN_DAY} THEN 1 ELSE NULL END) AS "total2DaysAgo",
    COUNT(CASE WHEN "timestamp" BETWEEN ${timestamp - 1 * SECONDS_IN_DAY} AND
      ${timestamp} THEN 1 ELSE NULL END) AS "totalYesterday"
    FROM "Transaction";
  `);
  /* const rawResult = await prisma.$queryRaw`
      SELECT COUNT(CASE WHEN "timestamp" BETWEEN EXTRACT(EPOCH FROM CURRENT_DATE - 14) AND
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
        EXTRACT(EPOCH FROM CURRENT_DATE) THEN 1 ELSE NULL END) AS "totalYesterday"
      FROM "Transaction";
    `; */
  const result = rawResult as {
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
  }[];
  const firstResult = result[0];
  if (!firstResult) {
    return [];
  }
  return [
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
  ];
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
