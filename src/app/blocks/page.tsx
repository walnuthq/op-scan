import { l2PublicClient } from "@/lib/chains";
import Blocks from "@/components/pages/blocks";

const BlocksPage = async ({
  searchParams,
}: {
  searchParams: { start?: string; latest?: string };
}) => {
  const latestBlockNumber = await l2PublicClient.getBlockNumber();
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
