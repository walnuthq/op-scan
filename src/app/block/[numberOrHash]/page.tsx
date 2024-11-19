import { notFound, permanentRedirect } from "next/navigation";
import { Hash } from "viem";
import { l2PublicClient } from "@/lib/chains";
import Block from "@/components/pages/block";

const BlockPage = async ({
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
    permanentRedirect(`/block/${block.number}`);
  }
  return <Block number={BigInt(numberOrHash)} />;
};

export const dynamic = "force-dynamic";

export default BlockPage;
