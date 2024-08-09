import { subDays, formatISO } from "date-fns";
import { Address, formatUnits, Hash } from "viem";
import { formatDistanceToNow } from 'date-fns';
import { formatEther } from "viem";
import {
  extractTransactionDepositedLogs,
  getL2TransactionHash,
} from "viem/op-stack";
import { TransactionEnqueued } from "@/lib/types";
import { l1PublicClient } from "@/lib/chains";
import portal from "@/lib/contracts/portal/contract";
import l1CrossDomainMessenger from "@/lib/contracts/l1-cross-domain-messenger/contract";
import { loadFunctions } from "@/lib/signatures";
import { prisma } from "./prisma";
import { formatTimestamp } from "./utils";

// export const fetchLatestBlocks = async (start: bigint): Promise<Block[]> => {
//   const blocksPerPage = BigInt(process.env.NEXT_PUBLIC_BLOCKS_PER_PAGE);
//   const blocks = await Promise.all(
//     range(Number(start), Math.max(Number(start - blocksPerPage), -1)).map((i) =>
//       l2PublicClient.getBlock({ blockNumber: BigInt(i) }),
//     ),
//   );
//   return blocks.map(fromViemBlock);
// };

export const fetchLatestTransactionsEnqueued = async (
  start: bigint,
  hash: Hash,
  latest: bigint,
): Promise<{
  transactionsEnqueued: TransactionEnqueued[];
  previousStart?: bigint;
  previousHash?: Hash;
  nextStart?: bigint;
  nextHash?: Hash;
}> => {
  const l1BlocksPerTxsEnqueued = BigInt(250);
  const txsEnqueuedPerPage = BigInt(
    process.env.NEXT_PUBLIC_TXS_ENQUEUED_PER_PAGE,
  );
  const l1FromBlock = start - l1BlocksPerTxsEnqueued * txsEnqueuedPerPage;
  const [transactionDepositedLogs, sentMessageLogs] = await Promise.all([
    portal.getEvents.TransactionDeposited(undefined, {
      fromBlock: l1FromBlock,
    }),
    l1CrossDomainMessenger.getEvents.SentMessage(undefined, {
      fromBlock: l1FromBlock,
    }),
  ]);
  const transactionsEnqueued = await Promise.all(
    extractTransactionDepositedLogs({ logs: transactionDepositedLogs }).map(
      async (transactionDepositedLog, index) => {
        const sentMessageLog = sentMessageLogs[index];
        if (!sentMessageLog || !sentMessageLog.args.gasLimit) {
          return null;
        }
        const { timestamp } = await l1PublicClient.getBlock({
          blockNumber: transactionDepositedLog.blockNumber,
        });
        return {
          l1BlockNumber: transactionDepositedLog.blockNumber,
          l2TxHash: getL2TransactionHash({ log: transactionDepositedLog }),
          l1TxHash: transactionDepositedLog.transactionHash,
          timestamp,
          l1TxOrigin: transactionDepositedLog.args.from,
          gasLimit: sentMessageLog.args.gasLimit,
        };
      },
    ),
  );
  return {
    transactionsEnqueued: transactionsEnqueued
      .filter((transactionEnqueud) => transactionEnqueud !== null)
      .reverse()
      .slice(0, Number(txsEnqueuedPerPage)),
    previousStart: BigInt(0),
    previousHash: "0x",
    nextStart: BigInt(0),
    nextHash: "0x",
  };
};

export const fetchTokenPrice = async (symbol: string): Promise<number> => {
  try {
    const response = await fetch(
      `https://api.coinbase.com/v2/prices/${symbol}-USD/spot`,
    );

    if (!response.ok) {
      return 0; // Return 0 if we can't get the price
    }

    const json = await response.json();
    const { data } = json as GetSpotPriceResponse;
    return Number(data.amount);
  } catch (error) {
    return 0; // Return 0 if there's an error
  }
};

export type GetSpotPriceResponse = {
  data: { amount: string; base: string; currency: string };
};

export const fetchTokensPrices = async () => {
  const date = formatISO(subDays(new Date(), 1), {
    representation: "date",
  });
  const [
    ethResponseToday,
    ethResponseYesterday,
    opResponseToday,
    opResponseYesterday,
  ] = await Promise.all([
    fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot"),
    fetch(`https://api.coinbase.com/v2/prices/ETH-USD/spot?date=${date}`),
    fetch("https://api.coinbase.com/v2/prices/OP-USD/spot"),
    fetch(`https://api.coinbase.com/v2/prices/OP-USD/spot?date=${date}`),
  ]);
  const [ethJsonToday, ethJsonYesterday, opJsonToday, opJsonYesterday] =
    await Promise.all([
      ethResponseToday.json(),
      ethResponseYesterday.json(),
      opResponseToday.json(),
      opResponseYesterday.json(),
    ]);

  const {
    data: { amount: ethPriceToday },
  } = ethJsonToday as GetSpotPriceResponse;
  const {
    data: { amount: ethPriceYesterday },
  } = ethJsonYesterday as GetSpotPriceResponse;
  const {
    data: { amount: opPriceToday },
  } = opJsonToday as GetSpotPriceResponse;
  const {
    data: { amount: opPriceYesterday },
  } = opJsonYesterday as GetSpotPriceResponse;
  return {
    eth: { today: Number(ethPriceToday), yesterday: Number(ethPriceYesterday) },
    op: { today: Number(opPriceToday), yesterday: Number(opPriceYesterday) },
  };
};


export async function getLatestTransferEvents(
  contractAddress: Address,
  page: number = 1,
  limit: number = 100
) {
  console.log(contractAddress);
  const skip = (page - 1) * limit;

  try {
    const erc20Transfers = await prisma.erc20Transfer.findMany({
      where: {
        OR: [
          { from: contractAddress },
          { to: contractAddress }
        ]
      },
      orderBy: { transactionHash: 'desc' },
      take: limit,
      skip: skip,
      include: {
        receipt: {
          include: {
            transaction: {
              include: {
                block: true,
              },
            },
          },
        },
      },
    });

    const allTransfers = await Promise.all(erc20Transfers.map(async t => {
      return {
        transactionHash: t.transactionHash,
        method: t.receipt.transaction.input.slice(0, 10),
        block: Number(t.receipt.transaction.blockNumber),
        age: formatTimestamp(t.receipt.transaction.block.timestamp).distance,
        from: t.from,
        to: t.to,
        amount: formatUnits(BigInt(t.value), t.decimals),
        token: {
          address: t.address,
          decimals: t.decimals,
        },
        type: 'ERC20' as const,
      };
    }));

    return {
      transfers: allTransfers,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching token transfers:", error);
    throw error;
  }
}