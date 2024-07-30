import { Hash } from "viem";
import { l1PublicClient } from "@/lib/chains";
import TxsEnqueued from "@/components/pages/txs-enqueued";

const TxsEnqueuedPage = async ({
  searchParams,
}: {
  searchParams: {
    start?: string;
    hash?: string;
    page?: string;
    latest?: string;
  };
}) => {
  const latestBlockNumber = await l1PublicClient.getBlockNumber();
  return (
    <TxsEnqueued
      start={
        searchParams.start ? BigInt(searchParams.start) : latestBlockNumber
      }
      hash={searchParams.hash ? (searchParams.hash as Hash) : "0x"}
      page={searchParams.page ? Number(searchParams.page) : 1}
      latest={
        searchParams.latest ? BigInt(searchParams.latest) : latestBlockNumber
      }
    />
  );
};

export default TxsEnqueuedPage;
