import { parseArgs } from "node:util";
import { PrismaClient } from "@/prisma/generated/client";
import {
  createPublicClient,
  webSocket,
  Address,
  Hash,
  zeroHash,
  Hex,
} from "viem";
import { mainnet, optimism } from "viem/chains";
import { l1Chain, l2Chain, l2PublicClient } from "@/lib/chains";
import l2OutputOracle from "@/lib/contracts/l2-output-oracle/contract";

const prisma = new PrismaClient();

const l1PublicClientWs = createPublicClient({
  chain: mainnet,
  transport: webSocket(process.env.L1_RPC_WSS),
});

const l2PublicClientWs = createPublicClient({
  chain: optimism,
  transport: webSocket(process.env.L2_RPC_WSS),
});

const trimBlock = ({
  number,
  hash,
  timestamp,
  gasUsed,
  gasLimit,
  extraData,
  parentHash,
}: {
  number: bigint | null;
  hash: Hash | null;
  timestamp: bigint;
  gasUsed: bigint;
  gasLimit: bigint;
  extraData: Hex;
  parentHash: Hash;
}) => ({
  number: number ?? BigInt(0),
  hash: hash ?? zeroHash,
  timestamp,
  gasUsed: `0x${gasUsed.toString(16)}`,
  gasLimit: `0x${gasLimit.toString(16)}`,
  extraData,
  parentHash,
});

const trimTransactions = (
  transactions: {
    hash: Hash;
    blockNumber: bigint | null;
    from: Address;
    to: Address | null;
    value: bigint;
    gas: bigint;
    gasPrice?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce: number;
    transactionIndex: number;
    input: Hex;
  }[],
  timestamp: bigint,
) =>
  transactions.map(
    ({
      hash,
      blockNumber,
      from,
      to,
      value,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      transactionIndex,
      input,
    }) => ({
      hash,
      blockNumber: blockNumber ?? BigInt(0),
      from,
      to,
      value: `0x${value.toString(16)}`,
      gas: `0x${gas.toString(16)}`,
      gasPrice: gasPrice ? `0x${gasPrice.toString(16)}` : null,
      maxFeePerGas: maxFeePerGas ? `0x${maxFeePerGas.toString(16)}` : null,
      maxPriorityFeePerGas: maxPriorityFeePerGas
        ? `0x${maxPriorityFeePerGas.toString(16)}`
        : null,
      nonce,
      transactionIndex,
      input,
      timestamp,
    }),
  );

const indexBlock = async (blockNumber: bigint) => {
  const block = await l2PublicClient.getBlock({
    blockNumber,
    includeTransactions: true,
  });
  const trimmedBlock = trimBlock(block);
  const trimmedTransactions = trimTransactions(
    block.transactions,
    block.timestamp,
  );
  await Promise.all([
    await prisma.block.upsert({
      where: { number: trimmedBlock.number },
      create: trimmedBlock,
      update: trimmedBlock,
    }),
    ...trimmedTransactions.map((trimmedTransaction) =>
      prisma.transaction.upsert({
        where: { hash: trimmedTransaction.hash },
        create: trimmedTransaction,
        update: trimmedTransaction,
      }),
    ),
  ]);
  console.log(blockNumber, "indexed");
};

// create the OP Stack deploy config
await prisma.deployConfig.create({
  data: {
    l1ChainId: l1Chain.id,
    l2ChainId: l2Chain.id,
    l2BlockTime: await l2OutputOracle.read.l2BlockTime(),
  },
});

// listen to new head and index block
l2PublicClientWs.watchBlockNumber({ onBlockNumber: indexBlock });

const { values } = parseArgs({
  args: process.argv,
  options: {
    "starting-block": {
      type: "string",
      short: "b",
    },
  },
  strict: true,
  allowPositionals: true,
});

const latestBlockNumber = await l2PublicClient.getBlockNumber();
const defaultStartingBlockNumber = latestBlockNumber - BigInt(64);
const startingBlock = values["starting-block"]
  ? BigInt(values["starting-block"])
  : defaultStartingBlockNumber;

// index blocks from starting-block to head
for (
  let blockNumber = startingBlock;
  blockNumber <= latestBlockNumber;
  blockNumber++
) {
  await indexBlock(blockNumber);
}
