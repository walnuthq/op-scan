import { Log, getAddress } from "viem";
import {
  extractTransactionDepositedLogs,
  getL2TransactionHash,
} from "viem/op-stack";
import {
  ViemBlockWithTransactions,
  ViemLog,
  ViemTransaction,
  ViemTransactionReceipt,
  ERC20Transfer,
  TransactionEnqueued,
} from "@/lib/types";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import { prisma } from "@/lib/prisma";
import { parseERC20Transfers } from "@/lib/utils";
import { getSignatureBySelector } from "@/lib/4byte-directory";
import portal from "@/lib/contracts/portal/contract";
import l1CrossDomainMessenger from "@/lib/contracts/l1-cross-domain-messenger/contract";

const toPrismaBlock = ({
  number,
  hash,
  timestamp,
  gasUsed,
  gasLimit,
  extraData,
  parentHash,
}: ViemBlockWithTransactions) => ({
  number,
  hash,
  timestamp,
  gasUsed: `0x${gasUsed.toString(16)}`,
  gasLimit: `0x${gasLimit.toString(16)}`,
  extraData,
  parentHash,
});

const toPrismaTransaction = (
  {
    hash,
    blockNumber,
    from,
    to,
    value,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    type,
    typeHex,
    nonce,
    transactionIndex,
    input,
  }: ViemTransaction,
  timestamp: bigint,
  signature: string,
) => ({
  hash,
  blockNumber,
  from: getAddress(from),
  to: to ? getAddress(to) : null,
  value: `0x${value.toString(16)}`,
  gas: `0x${gas.toString(16)}`,
  gasPrice: gasPrice ? `0x${gasPrice.toString(16)}` : null,
  maxFeePerGas: maxFeePerGas ? `0x${maxFeePerGas.toString(16)}` : null,
  maxPriorityFeePerGas: maxPriorityFeePerGas
    ? `0x${maxPriorityFeePerGas.toString(16)}`
    : null,
  type: type ?? "legacy",
  typeHex: typeHex ?? "0x1",
  nonce,
  transactionIndex,
  input,
  signature,
  timestamp,
});

const toPrismaTransactionReceipt = ({
  transactionHash,
  status,
  from,
  to,
  effectiveGasPrice,
  gasUsed,
  l1Fee,
  l1GasPrice,
  l1GasUsed,
  l1FeeScalar,
}: ViemTransactionReceipt) => ({
  transactionHash,
  status: status === "success",
  from: getAddress(from),
  to: to ? getAddress(to) : null,
  effectiveGasPrice: effectiveGasPrice
    ? `0x${effectiveGasPrice.toString(16)}`
    : null,
  gasUsed: `0x${gasUsed.toString(16)}`,
  l1Fee: l1Fee ? `0x${l1Fee.toString(16)}` : null,
  l1GasPrice: l1GasPrice ? `0x${l1GasPrice.toString(16)}` : null,
  l1GasUsed: l1GasUsed ? `0x${l1GasUsed.toString(16)}` : null,
  l1FeeScalar,
});

const toPrismaLog = ({
  address,
  blockNumber,
  blockHash,
  data,
  logIndex,
  transactionHash,
  transactionIndex,
  removed,
  topics,
}: ViemLog) => ({
  address: getAddress(address),
  blockNumber,
  blockHash,
  data,
  logIndex,
  transactionHash,
  transactionIndex,
  removed,
  topics: topics.join(","),
});

const toPrismaERC20Transfer = ({
  transactionHash,
  logIndex,
  from,
  to,
  address,
  amount,
  decimals,
}: ERC20Transfer) => ({
  transactionHash,
  logIndex,
  from,
  to,
  address,
  amount: `0x${amount.toString(16)}`,
  decimals,
});

const toPrismaTransactionEnqueued = ({
  l1BlockNumber,
  l2TxHash,
  timestamp,
  l1TxHash,
  l1TxOrigin,
  gasLimit,
}: TransactionEnqueued) => ({
  l1BlockNumber,
  l2TxHash,
  timestamp,
  l1TxHash,
  l1TxOrigin,
  gasLimit: `0x${gasLimit.toString(16)}`,
});

export const indexL2Block = async (blockNumber: bigint) => {
  const block = await l2PublicClient.getBlock({
    blockNumber,
    includeTransactions: true,
  });
  const prismaBlock = toPrismaBlock(block);
  await prisma.block.upsert({
    where: { number: prismaBlock.number },
    create: prismaBlock,
    update: prismaBlock,
  });
  const prismaTransactions = await Promise.all(
    block.transactions.map(async (transaction) => {
      const signature = await getSignatureBySelector(
        transaction.input.slice(0, 10),
      );
      return toPrismaTransaction(transaction, block.timestamp, signature);
    }),
  );
  const [receipts] = await Promise.all([
    Promise.all(
      block.transactions.map(({ hash }) =>
        l2PublicClient.getTransactionReceipt({ hash }),
      ),
    ),
    ...prismaTransactions.map((prismaTransaction) =>
      prisma.transaction.upsert({
        where: { hash: prismaTransaction.hash },
        create: prismaTransaction,
        update: prismaTransaction,
      }),
    ),
  ]);
  const prismaTransactionReceipts = receipts.map(toPrismaTransactionReceipt);
  await Promise.all(
    prismaTransactionReceipts.map((prismaTransactionReceipt) =>
      prisma.transactionReceipt.upsert({
        where: { transactionHash: prismaTransactionReceipt.transactionHash },
        create: prismaTransactionReceipt,
        update: prismaTransactionReceipt,
      }),
    ),
  );
  const logs = receipts.reduce<Log[]>(
    (logs, receipt) => [...logs, ...receipt.logs],
    [],
  );
  const prismaLogs = logs.map((log) => toPrismaLog(log as ViemLog));
  await Promise.all(
    prismaLogs.map((prismaLog) =>
      prisma.log.upsert({
        where: {
          transactionHash_logIndex: {
            transactionHash: prismaLog.transactionHash,
            logIndex: prismaLog.logIndex,
          },
        },
        create: prismaLog,
        update: prismaLog,
      }),
    ),
  );
  const erc20Transfers = await parseERC20Transfers(logs);
  const prismaERC20Transfers = erc20Transfers.map(toPrismaERC20Transfer);
  await Promise.all(
    prismaERC20Transfers.map((prismaERC20Transfer) =>
      prisma.erc20Transfer.upsert({
        where: {
          transactionHash_logIndex: {
            transactionHash: prismaERC20Transfer.transactionHash,
            logIndex: prismaERC20Transfer.logIndex,
          },
        },
        create: prismaERC20Transfer,
        update: prismaERC20Transfer,
      }),
    ),
  );
};

export const indexL1Block = async (blockNumber: bigint) => {
  const [{ timestamp }, transactionDepositedLogs, sentMessageLogs] =
    await Promise.all([
      l1PublicClient.getBlock({ blockNumber }),
      portal.getEvents.TransactionDeposited(undefined, {
        fromBlock: blockNumber,
        toBlock: blockNumber,
      }),
      l1CrossDomainMessenger.getEvents.SentMessage(undefined, {
        fromBlock: blockNumber,
        toBlock: blockNumber,
      }),
    ]);
  const transactionsEnqueued = extractTransactionDepositedLogs({
    logs: transactionDepositedLogs,
  })
    .map((transactionDepositedLog, index) => {
      const sentMessageLog = sentMessageLogs[index];
      if (!sentMessageLog || !sentMessageLog.args.gasLimit) {
        return null;
      }
      return {
        l1BlockNumber: transactionDepositedLog.blockNumber,
        l2TxHash: getL2TransactionHash({ log: transactionDepositedLog }),
        l1TxHash: transactionDepositedLog.transactionHash,
        timestamp,
        l1TxOrigin: transactionDepositedLog.args.from,
        gasLimit: sentMessageLog.args.gasLimit,
      };
    })
    .filter((transactionEnqueued) => transactionEnqueued !== null);
  const prismaTransactionsEnqueued = transactionsEnqueued.map(
    toPrismaTransactionEnqueued,
  );
  await Promise.all(
    prismaTransactionsEnqueued.map((prismaTransactionEnqueued) =>
      prisma.transactionEnqueued.upsert({
        where: {
          l1BlockNumber_l2TxHash: {
            l1BlockNumber: prismaTransactionEnqueued.l1BlockNumber,
            l2TxHash: prismaTransactionEnqueued.l2TxHash,
          },
        },
        create: prismaTransactionEnqueued,
        update: prismaTransactionEnqueued,
      }),
    ),
  );
};
