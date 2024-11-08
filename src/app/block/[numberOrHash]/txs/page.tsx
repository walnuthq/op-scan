import { notFound, permanentRedirect } from "next/navigation";
import { Hash } from "viem";
import { l2PublicClient } from "@/lib/chains";
import BlockTxs from "@/components/pages/block-txs";

const BlockTxsPage = async ({
  params,
}: {
  params: Promise<{ numberOrHash: string }>;
}) => {
  const { numberOrHash } = await params;
  if (numberOrHash.startsWith("0x")) {
    const block = await l2PublicClient.getBlock({
      blockHash: numberOrHash as Hash,
    });
    if (!block) {
      notFound();
    }
    permanentRedirect(`/block/${block.number}/txs`);
  }
  return <BlockTxs number={BigInt(numberOrHash)} />;
};

export default BlockTxsPage;
