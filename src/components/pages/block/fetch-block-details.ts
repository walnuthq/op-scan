import { l2PublicClient } from "@/lib/chains";
import { Block, fromViemBlock, fromPrismaBlock } from "@/lib/types";
import { prisma } from "@/lib/prisma";

const fetchBlockDetailsFromDatabase = async (
  number: bigint,
): Promise<Block | null> => {
  const block = await prisma.block.findUnique({
    where: { number },
    include: { transactions: { select: { hash: true } } },
  });
  if (!block) {
    return fetchBlockDetailsFromJsonRpc(number);
  }
  return fromPrismaBlock(block);
};

const fetchBlockDetailsFromJsonRpc = async (
  number: bigint,
): Promise<Block | null> => {
  const block = await l2PublicClient.getBlock({ blockNumber: number });
  return block ? fromViemBlock(block) : null;
};
const fetchBlockDetails = process.env.DATABASE_URL
  ? fetchBlockDetailsFromDatabase
  : fetchBlockDetailsFromJsonRpc;

export default fetchBlockDetails;
