import { l2PublicClient } from "@/lib/chains";
import Blocks from "@/components/pages/blocks";

const BlocksPage = async ({
  searchParams,
}: {
  searchParams: { page?: string; latest?: string };
}) => (
  <Blocks
    page={searchParams.page ? BigInt(searchParams.page) : BigInt(1)}
    latest={
      searchParams.latest
        ? BigInt(searchParams.latest)
        : await l2PublicClient.getBlockNumber()
    }
  />
);

export default BlocksPage;
