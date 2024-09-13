"use server";
import { redirect } from "next/navigation";
import { fetchL2BlockNumber } from "@/lib/fetch-data";

export const refresh = async () => {
  const latestBlockNumber = await fetchL2BlockNumber();
  redirect(`/txs?start=${latestBlockNumber}`);
};
