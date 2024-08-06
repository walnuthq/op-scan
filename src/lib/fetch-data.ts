import { range } from "lodash";
import { subDays, formatISO } from "date-fns";
import { Address, Hash } from "viem";
import {
  extractTransactionDepositedLogs,
  getL2TransactionHash,
} from "viem/op-stack";
import {
  Block,
  TransactionWithReceipt,
  fromViemBlock,
  fromViemTransactionWithReceipt,
} from "@/lib/types";
import { TransactionEnqueued } from "@/lib/types";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import portal from "@/lib/contracts/portal/contract";
import l1CrossDomainMessenger from "@/lib/contracts/l1-cross-domain-messenger/contract";
import { loadFunctions } from "@/lib/signatures";

export const fetchLatestBlocks = async (start: bigint): Promise<Block[]> => {
  const blocksPerPage = BigInt(process.env.NEXT_PUBLIC_BLOCKS_PER_PAGE);
  const blocks = await Promise.all(
    range(Number(start), Math.max(Number(start - blocksPerPage), -1)).map((i) =>
      l2PublicClient.getBlock({ blockNumber: BigInt(i) }),
    ),
  );
  return blocks.map(fromViemBlock);
};

export const fetchLatestTransactions = async (
  start: bigint,
  index: number,
  latest: bigint,
): Promise<{
  transactions: TransactionWithReceipt[];
  previousStart?: bigint;
  previousIndex?: number;
  nextStart?: bigint;
  nextIndex?: number;
}> => {
  const txsPerPage = BigInt(process.env.NEXT_PUBLIC_TXS_PER_PAGE);
  const blocks = await Promise.all(
    range(
      Math.min(Number(start + txsPerPage), Number(latest)),
      Math.max(Number(start - BigInt(2) * txsPerPage), -1),
    ).map((i) => l2PublicClient.getBlock({ blockNumber: BigInt(i) })),
  );
  type TransactionPaginationItem = {
    hash: Hash;
    transactionIndex: number;
    blockNumber: bigint;
    timestamp: bigint;
  };
  const transactionPaginationItems = blocks.reduce<TransactionPaginationItem[]>(
    (previousValue, block) => {
      const items = block.transactions.map((hash, i) => ({
        hash,
        transactionIndex: i,
        blockNumber: block.number,
        timestamp: block.timestamp,
      }));
      return [...previousValue, ...items];
    },
    [],
  );
  const startItemIndex = transactionPaginationItems.findIndex(
    ({ blockNumber, transactionIndex }) =>
      blockNumber === start && transactionIndex === index,
  );
  const previousItem =
    transactionPaginationItems[startItemIndex - Number(txsPerPage)];
  const nextItem =
    transactionPaginationItems[startItemIndex + Number(txsPerPage)];
  const currentItems = transactionPaginationItems.slice(
    startItemIndex,
    startItemIndex + Number(txsPerPage),
  );
  const [transactionsWithTimestamp, receipts] = await Promise.all([
    Promise.all(
      currentItems.map(async ({ hash, timestamp }) => {
        const transaction = await l2PublicClient.getTransaction({ hash });
        return { ...transaction, timestamp };
      }),
    ),
    Promise.all(
      currentItems.map(({ hash }) =>
        l2PublicClient.getTransactionReceipt({ hash }),
      ),
    ),
  ]);
  const signatures = await Promise.all(
    transactionsWithTimestamp.map(({ input }) =>
      loadFunctions(input.slice(0, 10)),
    ),
  );
  const transactions = transactionsWithTimestamp.map((transaction, i) => {
    return fromViemTransactionWithReceipt(
      transaction,
      receipts[i],
      transaction.timestamp,
      signatures[i],
    );
  });
  return {
    transactions,
    previousStart: previousItem?.blockNumber,
    previousIndex: previousItem?.transactionIndex,
    nextStart: nextItem?.blockNumber,
    nextIndex: nextItem?.transactionIndex,
  };
};

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
  type GetSpotPriceResponse = {
    data: { amount: string; base: string; currency: string };
  };
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
