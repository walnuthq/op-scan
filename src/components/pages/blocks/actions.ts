"use server";
import { redirect } from "next/navigation";
import { fetchL2BlockNumber } from "@/lib/fetch-data";

export const refresh = async () => {
  const latestBlockNumber = await fetchL2BlockNumber();
  redirect(`/blocks?start=${latestBlockNumber}&latest=${latestBlockNumber}`);
};
