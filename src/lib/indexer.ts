import { Log, getAddress, Address, Hex } from "viem";
import {
  extractTransactionDepositedLogs,
  getL2TransactionHash,
} from "viem/op-stack";
import {
  Account,
  Erc20Token,
  Erc20Transfer,
  Erc721Token,
  Erc1155Token,
  NftTransfer,
  TransactionEnqueued,
} from "@/lib/types";
import {
  ViemBlockWithTransactions,
  ViemLog,
  ViemTransaction,
  ViemTransactionReceipt,
} from "@/lib/viem";
import {
  Block as PrismaBlock,
  Transaction as PrismaTransaction,
  TransactionReceipt as PrismaTransactionReceipt,
  Log as PrismaLog,
  Erc20Transfer as PrismaErc20Transfer,
  NftTransfer as PrismaNftTransfer,
  TransactionEnqueued as PrismaTransactionEnqueued,
  Account as PrismaAccount,
} from "@/prisma/generated/client";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import { prisma } from "@/lib/prisma";
import {
  parseErc20Transfers,
  parseErc721Transfers,
  parseErc1155Transfers,
} from "@/lib/utils";
import getErc20Contract from "@/lib/contracts/erc-20/contract";
import getErc721Contract from "@/lib/contracts/erc-721/contract";
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

const toPrismaErc20Transfer = ({
  blockNumber,
  transactionIndex,
  logIndex,
  transactionHash,
  address,
  from,
  to,
  value,
}: Erc20Transfer): PrismaErc20Transfer => ({
  blockNumber,
  transactionIndex,
  logIndex,
  transactionHash,
  address: getAddress(address),
  from: getAddress(from),
  to: getAddress(to),
  value: `0x${value.toString(16)}`,
});

const toPrismaNftTransfer = ({
  blockNumber,
  transactionIndex,
  logIndex,
  transactionHash,
  address,
  operator,
  from,
  to,
  tokenId,
  value,
  erc721TokenAddress,
  erc1155TokenAddress,
}: NftTransfer): PrismaNftTransfer => ({
  blockNumber,
  transactionIndex,
  logIndex,
  transactionHash,
  address: getAddress(address),
  operator: operator ? getAddress(operator) : null,
  from: getAddress(from),
  to: getAddress(to),
  tokenId: `0x${tokenId.toString(16)}`,
  value: `0x${value.toString(16)}`,
  erc721TokenAddress: erc721TokenAddress
    ? getAddress(erc721TokenAddress)
    : null,
  erc1155TokenAddress: erc1155TokenAddress
    ? getAddress(erc1155TokenAddress)
    : null,
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
  l1TxOrigin: getAddress(l1TxOrigin),
  gasLimit: `0x${gasLimit.toString(16)}`,
});

const toPrismaAccount = ({
  address,
  bytecode,
  transactionHash,
  contract,
}: Account): PrismaAccount => ({
  address,
  bytecode,
  transactionHash,
  contract: contract ? JSON.stringify(contract) : null,
});

const indexAccount = async (
  address: Address,
  accounts: Map<Address, Hex | null>,
) => {
  const account = await prisma.account.findUnique({
    where: { address },
  });
  if (account || accounts.get(address)) {
    return;
  }
  const bytecode = await l2PublicClient.getCode({ address });
  accounts.set(address, bytecode ?? null);
};

const indexErc20Token = async (
  address: Address,
  erc20Tokens: Map<Address, Erc20Token>,
  unindexedTokens: Set<Address>,
) => {
  const erc20Token = await prisma.erc20Token.findUnique({
    where: { address },
  });
  if (erc20Token || erc20Tokens.get(address)) {
    return;
  }
  const contract = getErc20Contract(address);
  try {
    const [name, symbol, decimals] = await Promise.all([
      contract.read.name(),
      contract.read.symbol(),
      contract.read.decimals(),
    ]);
    erc20Tokens.set(address, {
      address,
      name,
      symbol,
      decimals,
    });
  } catch (error) {
    // console.error(error);
    unindexedTokens.add(address);
  }
};

const indexErc721Token = async (
  address: Address,
  erc721Tokens: Map<Address, Erc721Token>,
  unindexedTokens: Set<Address>,
) => {
  const erc721Token = await prisma.erc721Token.findUnique({
    where: { address },
  });
  if (erc721Token || erc721Tokens.get(address)) {
    return;
  }
  const contract = getErc721Contract(address);
  try {
    const [name, symbol] = await Promise.all([
      contract.read.name(),
      contract.read.symbol(),
    ]);
    erc721Tokens.set(address, {
      address,
      name,
      symbol,
    });
  } catch (error) {
    // console.error(error);
    unindexedTokens.add(address);
  }
};

const indexErc1155Token = async (
  address: Address,
  erc1155Tokens: Map<Address, Erc1155Token>,
) => {
  const erc1155Token = await prisma.erc1155Token.findUnique({
    where: { address },
  });
  if (erc1155Token || erc1155Tokens.get(address)) {
    return;
  }
  erc1155Tokens.set(address, {
    address,
  });
};

export const indexL2Block = async (blockNumber: bigint) => {
  const block = await l2PublicClient.getBlock({
    blockNumber,
    includeTransactions: true,
  });
  const prismaBlock = toPrismaBlock(block);
  const prismaTransactions = block.transactions.map((transaction) =>
    toPrismaTransaction(transaction, block.timestamp),
  );
  const accounts = new Map<Address, Hex | null>();
  await Promise.all(
    block.transactions.map(({ from, to }) =>
      Promise.all([
        indexAccount(getAddress(from), accounts),
        to ? indexAccount(getAddress(to), accounts) : null,
      ]),
    ),
  );
  const transactionReceipts = await Promise.all(
    block.transactions.map(({ hash }) =>
      l2PublicClient.getTransactionReceipt({ hash }),
    ),
  );
  const prismaTransactionReceipts = transactionReceipts.map(
    toPrismaTransactionReceipt,
  );
  const contractDeployments = new Map<Address, Account>();
  for (let transactionReceipt of transactionReceipts) {
    if (transactionReceipt.contractAddress) {
      const bytecode = await l2PublicClient.getCode({
        address: transactionReceipt.contractAddress,
      });
      contractDeployments.set(transactionReceipt.contractAddress, {
        address: getAddress(transactionReceipt.contractAddress),
        bytecode: bytecode ?? null,
        transactionHash: transactionReceipt.transactionHash,
        contract: null,
      });
    }
  }
  const logs = transactionReceipts.reduce<Log[]>(
    (logs, receipt) => [...logs, ...receipt.logs],
    [],
  );
  await Promise.all(
    logs.map(({ address }) => indexAccount(getAddress(address), accounts)),
  );
  const prismaLogs = logs.map((log) => toPrismaLog(log as ViemLog));
  const unindexedTokens = new Set<Address>();
  const erc20Tokens = new Map<Address, Erc20Token>();
  const erc20Transfers = parseErc20Transfers(logs);
  await Promise.all(
    erc20Transfers.map(({ from, to, address }) =>
      Promise.all([
        indexAccount(getAddress(from), accounts),
        indexAccount(getAddress(to), accounts),
        indexErc20Token(getAddress(address), erc20Tokens, unindexedTokens),
      ]),
    ),
  );
  const erc721Tokens = new Map<Address, Erc721Token>();
  const erc721Transfers = parseErc721Transfers(logs);
  await Promise.all(
    erc721Transfers.map(({ from, to, address }) =>
      Promise.all([
        indexAccount(getAddress(from), accounts),
        indexAccount(getAddress(to), accounts),
        indexErc721Token(getAddress(address), erc721Tokens, unindexedTokens),
      ]),
    ),
  );
  const erc1155Tokens = new Map<Address, Erc1155Token>();
  const erc1155Transfers = parseErc1155Transfers(logs);
  await Promise.all(
    erc1155Transfers.map(({ from, to, address }) =>
      Promise.all([
        indexAccount(getAddress(from), accounts),
        indexAccount(getAddress(to), accounts),
        indexErc1155Token(getAddress(address), erc1155Tokens),
      ]),
    ),
  );
  try {
    await prisma.$transaction([
      prisma.block.upsert({
        where: { number: prismaBlock.number },
        create: prismaBlock,
        update: prismaBlock,
      }),
      ...prismaTransactions.map((prismaTransaction) =>
        prisma.transaction.upsert({
          where: { hash: prismaTransaction.hash },
          create: prismaTransaction,
          update: prismaTransaction,
        }),
      ),
      ...prismaTransactionReceipts.map((prismaTransactionReceipt) =>
        prisma.transactionReceipt.upsert({
          where: { transactionHash: prismaTransactionReceipt.transactionHash },
          create: prismaTransactionReceipt,
          update: prismaTransactionReceipt,
        }),
      ),
      ...prismaLogs.map((prismaLog) =>
        prisma.log.upsert({
          where: {
            blockNumber_transactionIndex_logIndex: {
              blockNumber: prismaLog.blockNumber,
              transactionIndex: prismaLog.transactionIndex,
              logIndex: prismaLog.logIndex,
            },
          },
          create: prismaLog,
          update: prismaLog,
        }),
      ),
      ...Array.from(contractDeployments).map(([, account]) =>
        prisma.account.upsert({
          where: { address: account.address },
          create: toPrismaAccount(account),
          update: toPrismaAccount(account),
        }),
      ),
      ...Array.from(accounts).map(([address, bytecode]) =>
        prisma.account.upsert({
          where: { address },
          create: { address, bytecode },
          update: { address, bytecode },
        }),
      ),
      ...Array.from(erc20Tokens).map(([, erc20Token]) =>
        prisma.erc20Token.upsert({
          where: { address: erc20Token.address },
          create: erc20Token,
          update: erc20Token,
        }),
      ),
      ...erc20Transfers
        .filter(({ address }) => !unindexedTokens.has(address))
        .map(toPrismaErc20Transfer)
        .map((prismaErc20Transfer) =>
          prisma.erc20Transfer.upsert({
            where: {
              blockNumber_transactionIndex_logIndex: {
                blockNumber: prismaErc20Transfer.blockNumber,
                transactionIndex: prismaErc20Transfer.transactionIndex,
                logIndex: prismaErc20Transfer.logIndex,
              },
            },
            create: prismaErc20Transfer,
            update: prismaErc20Transfer,
          }),
        ),
      ...Array.from(erc721Tokens).map(([, erc721Token]) =>
        prisma.erc721Token.upsert({
          where: { address: erc721Token.address },
          create: erc721Token,
          update: erc721Token,
        }),
      ),
      ...erc721Transfers
        .filter(({ address }) => !unindexedTokens.has(address))
        .map(toPrismaNftTransfer)
        .map((prismaNftTransfer) =>
          prisma.nftTransfer.upsert({
            where: {
              blockNumber_transactionIndex_logIndex: {
                blockNumber: prismaNftTransfer.blockNumber,
                transactionIndex: prismaNftTransfer.transactionIndex,
                logIndex: prismaNftTransfer.logIndex,
              },
            },
            create: prismaNftTransfer,
            update: prismaNftTransfer,
          }),
        ),
      ...Array.from(erc1155Tokens).map(([, erc1155Token]) =>
        prisma.erc1155Token.upsert({
          where: { address: erc1155Token.address },
          create: erc1155Token,
          update: erc1155Token,
        }),
      ),
      ...erc1155Transfers.map(toPrismaNftTransfer).map((prismaNftTransfer) =>
        prisma.nftTransfer.upsert({
          where: {
            blockNumber_transactionIndex_logIndex: {
              blockNumber: prismaNftTransfer.blockNumber,
              transactionIndex: prismaNftTransfer.transactionIndex,
              logIndex: prismaNftTransfer.logIndex,
            },
          },
          create: prismaNftTransfer,
          update: prismaNftTransfer,
        }),
      ),
    ]);
  } catch (error) {
    console.error(error);
    console.error(`Error indexing l2-${blockNumber}`);
  }
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
        l1TxOrigin: getAddress(transactionDepositedLog.args.from),
        gasLimit: sentMessageLog.args.gasLimit,
      };
    })
    .filter((transactionEnqueued) => transactionEnqueued !== null);
  try {
    await prisma.$transaction([
      prisma.l1Block.upsert({
        where: { number: blockNumber },
        create: { number: blockNumber },
        update: { number: blockNumber },
      }),
      ...transactionsEnqueued
        .map(toPrismaTransactionEnqueued)
        .map((prismaTransactionEnqueued) =>
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
    ]);
  } catch (error) {
    console.error(error);
    console.error(`Error indexing l1-${blockNumber}`);
  }
};
