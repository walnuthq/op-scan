import { l2PublicClient } from "@/lib/chains";
import Txs from "@/components/pages/txs";

const TxsPage = async ({
  searchParams,
}: {
  searchParams: {
    start?: string;
    index?: string;
    page?: string;
    latest?: string;
  };
}) => {
  const latestBlockNumber = await l2PublicClient.getBlockNumber();
  return (
    <Txs
      start={
        searchParams.start ? BigInt(searchParams.start) : latestBlockNumber
      }
      index={searchParams.index ? Number(searchParams.index) : 0}
      page={searchParams.page ? Number(searchParams.page) : 1}
      latest={
        searchParams.latest ? BigInt(searchParams.latest) : latestBlockNumber
      }
    />
  );
};

export default TxsPage;
