"use server";
import { redirect } from "next/navigation";
import { fetchL2BlockNumberFromJsonRpc } from "@/lib/fetch-data";

export const refresh = async () => {
  const latestBlockNumber = await fetchL2BlockNumberFromJsonRpc();
  redirect(`/blocks?start=${latestBlockNumber}&latest=${latestBlockNumber}`);
};
