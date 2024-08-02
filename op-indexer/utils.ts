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
  ERC721Transfer,
  ERC1155Transfer,
  TransactionEnqueued,
} from "@/lib/types";
import {
  Block as PrismaBlock,
  Transaction as PrismaTransaction,
  TransactionReceipt as PrismaTransactionReceipt,
  Log as PrismaLog,
  erc20Transfer as PrismaERC20Transfer,
  erc721Transfer as PrismaERC721Transfer,
  erc1155Transfer as PrismaERC1155Transfer,
  TransactionEnqueued as PrismaTransactionEnqueued,
} from "@/prisma/generated/client";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import { prisma } from "@/lib/prisma";
import {
  parseERC20Transfers,
  parseERC721Transfers,
  parseERC1155Transfers,
} from "@/lib/utils";
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
}: ViemBlockWithTransactions): PrismaBlock => ({
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
): PrismaTransaction => ({
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
}: ViemTransactionReceipt): PrismaTransactionReceipt => ({
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
}: ViemLog): PrismaLog => ({
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
  address,
  from,
  to,
  value,
  decimals,
}: ERC20Transfer): PrismaERC20Transfer => ({
  transactionHash,
  logIndex,
  address,
  from,
  to,
  value: `0x${value.toString(16)}`,
  decimals,
});

const toPrismaERC721Transfer = ({
  transactionHash,
  logIndex,
  address,
  from,
  to,
  tokenId,
}: ERC721Transfer): PrismaERC721Transfer => ({
  transactionHash,
  logIndex,
  address,
  from,
  to,
  tokenId: `0x${tokenId.toString(16)}`,
});

const toPrismaERC1155Transfer = ({
  transactionHash,
  logIndex,
  address,
  operator,
  from,
  to,
  id,
  value,
}: ERC1155Transfer): PrismaERC1155Transfer => ({
  transactionHash,
  logIndex,
  address,
  operator,
  from,
  to,
  id: `0x${id.toString(16)}`,
  value: `0x${value.toString(16)}`,
});

const toPrismaTransactionEnqueued = ({
  l1BlockNumber,
  l2TxHash,
  timestamp,
  l1TxHash,
  l1TxOrigin,
  gasLimit,
}: TransactionEnqueued): PrismaTransactionEnqueued => ({
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
  const [receipts] = await Promise.all([
    Promise.all(
      block.transactions.map(({ hash }) =>
        l2PublicClient.getTransactionReceipt({ hash }),
      ),
    ),
    Promise.all(
      block.transactions
        .map((transaction) => toPrismaTransaction(transaction, block.timestamp))
        .map((prismaTransaction) =>
          prisma.transaction.upsert({
            where: { hash: prismaTransaction.hash },
            create: prismaTransaction,
            update: prismaTransaction,
          }),
        ),
    ),
  ]);
  await Promise.all(
    receipts.map(toPrismaTransactionReceipt).map((prismaTransactionReceipt) =>
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
  await Promise.all(
    logs
      .map((log) => toPrismaLog(log as ViemLog))
      .map((prismaLog) =>
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
  const [erc20Transfers, erc721Transfers, erc1155Transfers] = await Promise.all(
    [
      parseERC20Transfers(logs),
      parseERC721Transfers(logs),
      parseERC1155Transfers(logs),
    ],
  );
  await Promise.all([
    Promise.all(
      erc20Transfers.map(toPrismaERC20Transfer).map((prismaERC20Transfer) =>
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
    ),
    Promise.all(
      erc721Transfers.map(toPrismaERC721Transfer).map((prismaERC721Transfer) =>
        prisma.erc721Transfer.upsert({
          where: {
            transactionHash_logIndex: {
              transactionHash: prismaERC721Transfer.transactionHash,
              logIndex: prismaERC721Transfer.logIndex,
            },
          },
          create: prismaERC721Transfer,
          update: prismaERC721Transfer,
        }),
      ),
    ),
    Promise.all(
      erc1155Transfers
        .map(toPrismaERC1155Transfer)
        .map((prismaERC1155Transfer) =>
          prisma.erc1155Transfer.upsert({
            where: {
              transactionHash_logIndex: {
                transactionHash: prismaERC1155Transfer.transactionHash,
                logIndex: prismaERC1155Transfer.logIndex,
              },
            },
            create: prismaERC1155Transfer,
            update: prismaERC1155Transfer,
          }),
        ),
    ),
  ]);
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
