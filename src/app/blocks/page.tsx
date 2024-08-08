import { fetchL2BlockNumber } from "@/lib/fetch-data";
import Blocks from "@/components/pages/blocks";

const BlocksPage = async ({
  searchParams,
}: {
  searchParams: { start?: string; latest?: string };
}) => {
  const latestBlockNumber = await fetchL2BlockNumber();
  return (
    <Blocks
      start={
        searchParams.start ? BigInt(searchParams.start) : latestBlockNumber
      }
      latest={
        searchParams.latest ? BigInt(searchParams.latest) : latestBlockNumber
      }
    />
  );
};

export default BlocksPage;
