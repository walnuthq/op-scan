import { l2PublicClient } from "@/lib/chains";
import { Block } from "@/lib/types";
import { fromViemBlock } from "@/lib/viem";
import { prisma, fromPrismaBlock } from "@/lib/prisma";

const fetchBlockDetailsFromDatabase = async (
  number: bigint,
): Promise<Block | null> => {
  const block = await prisma.block.findUnique({
    where: { number },
    include: { transactions: { select: { hash: true } } },
  });
  return block ? fromPrismaBlock(block) : fetchBlockDetailsFromJsonRpc(number);
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
