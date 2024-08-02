import { l2PublicClient } from "@/lib/chains";
import { Block, fromViemBlock, fromPrismaBlock } from "@/lib/types";
import { prisma } from "@/lib/prisma";

type FetchBlockDetailsReturnType = {
  block: Block | null;
};

const fetchBlockDetailsFromDatabase = async (
  number: bigint,
): Promise<FetchBlockDetailsReturnType> => {
  console.log(`Attempting to fetch block ${number} from database`);
  const block = await prisma.block.findUnique({
    where: { number: BigInt(number) },
    include: { transactions: true },
  });

  if (!block) {
    console.log(`Block ${number} not found in database, falling back to JSON-RPC`);
    return fetchBlockDetailsFromJsonRpc(number);
  }

  console.log(`Block ${number} successfully fetched from database`);
  return {
    block: fromPrismaBlock(block, block.transactions),
  };
};

const fetchBlockDetailsFromJsonRpc = async (
  number: bigint,
): Promise<FetchBlockDetailsReturnType> => {
  console.log(`Fetching block ${number} from JSON-RPC`);
  const block = await l2PublicClient.getBlock({ blockNumber: number });

  if (!block) {
    console.log(`Block ${number} not found via JSON-RPC`);
    return { block: null };
  }

  console.log(`Block ${number} successfully fetched from JSON-RPC`);
  return {
    block: fromViemBlock(block),
  };
};

const fetchBlockDetails = process.env.DATABASE_URL
  ? fetchBlockDetailsFromDatabase
  : fetchBlockDetailsFromJsonRpc;

console.log(`Block fetching strategy: ${process.env.DATABASE_URL ? 'Database with JSON-RPC fallback' : 'JSON-RPC only'}`);

export default fetchBlockDetails;