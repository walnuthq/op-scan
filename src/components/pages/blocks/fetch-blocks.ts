import { l2PublicClient } from "@/lib/chains";
import { prisma } from "@/lib/prisma";
import { fromViemBlock, Block } from "@/lib/types";
import { range } from "lodash";

type Hash = `0x${string}`;

const fetchLatestBlocksFromJsonRpc = async (
  start: bigint,
): Promise<Block[]> => {
  const blocksPerPage = BigInt(process.env.NEXT_PUBLIC_BLOCKS_PER_PAGE);
  const blocks = await Promise.all(
    range(Number(start), Math.max(Number(start - blocksPerPage), -1)).map((i) =>
      l2PublicClient.getBlock({ blockNumber: BigInt(i) }),
    ),
  );
  return blocks.map(fromViemBlock);
};

const fetchLatestBlocksFromDatabase = async (
  start: bigint,
): Promise<Block[]> => {
  const blocksPerPage = BigInt(process.env.NEXT_PUBLIC_BLOCKS_PER_PAGE);
  const blocks = await prisma.block.findMany({
    where: {
      number: {
        lte: start,
        gt: start - blocksPerPage,
      },
    },
    orderBy: {
      number: "desc",
    },
    take: Number(blocksPerPage),
    include: {
      transactions: {
        select: {
          hash: true,
        },
      },
    },
  });

  if (blocks.length === 0) {
    return fetchLatestBlocksFromJsonRpc(start);
  }

  return blocks.map((block) => ({
    number: BigInt(block.number),
    hash: block.hash as `0x${string}`,
    parentHash: block.parentHash as `0x${string}`,
    timestamp: BigInt(block.timestamp),
    gasLimit: BigInt(block.gasLimit),
    gasUsed: BigInt(block.gasUsed),
    extraData: block.extraData as `0x${string}`,
    transactions: block.transactions.map((tx) => tx.hash as `0x${string}`),
  }));
};
const fetchLatestBlocks = process.env.DATABASE_URL
  ? fetchLatestBlocksFromDatabase
  : fetchLatestBlocksFromJsonRpc;

export default fetchLatestBlocks;
