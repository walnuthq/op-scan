import { type Log, getAddress, type Address, type Hex, zeroHash } from "viem";
import {
  extractTransactionDepositedLogs,
  getL2TransactionHash,
} from "viem/op-stack";
import {
  type Account,
  type Erc20Token,
  type Erc20Transfer,
  type Erc721Token,
  type Erc1155Token,
  type NftTransfer,
  type TransactionEnqueued,
} from "@/lib/types";
import {
  type ViemBlockWithTransactions,
  type ViemLog,
  type ViemTransaction,
  type ViemTransactionReceipt,
} from "@/lib/viem";
import {
  type Block as PrismaBlock,
  type Transaction as PrismaTransaction,
  type TransactionReceipt as PrismaTransactionReceipt,
  type Log as PrismaLog,
  type Erc20Transfer as PrismaErc20Transfer,
  type NftTransfer as PrismaNftTransfer,
  type TransactionEnqueued as PrismaTransactionEnqueued,
  type Account as PrismaAccount,
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
import optimismPortal from "@/lib/contracts/optimism-portal2/contract";
import l1CrossDomainMessenger from "@/lib/contracts/l1-cross-domain-messenger/contract";
import l1StandardBridge from "@/lib/contracts/l1-standard-bridge/contract";

const toPrismaBlock = (
  {
    number,
    hash,
    timestamp,
    gasUsed,
    gasLimit,
    extraData,
    parentHash,
    transactions,
  }: ViemBlockWithTransactions,
  chainId: number,
): PrismaBlock => ({
  number,
  hash,
  timestamp,
  gasUsed: `0x${gasUsed.toString(16)}`,
  gasLimit: `0x${gasLimit.toString(16)}`,
  extraData,
  parentHash,
  transactionsCount: transactions.length,
  chainId,
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
  chainId: number,
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
  nonce: nonce ?? 0,
  transactionIndex,
  input,
  timestamp,
  chainId,
});

const toPrismaTransactionReceipt = (
  {
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
  }: ViemTransactionReceipt,
  chainId: number,
): PrismaTransactionReceipt => ({
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
  chainId,
});

const toPrismaLog = (
  {
    address,
    blockNumber,
    blockHash,
    data,
    logIndex,
    transactionHash,
    transactionIndex,
    removed,
    topics,
  }: ViemLog,
  chainId: number,
): PrismaLog => ({
  address: getAddress(address),
  blockNumber,
  blockHash,
  data,
  logIndex,
  transactionHash,
  transactionIndex,
  removed,
  topics: topics.join(","),
  chainId,
});

const toPrismaErc20Transfer = (
  {
    blockNumber,
    transactionIndex,
    logIndex,
    transactionHash,
    address,
    from,
    to,
    value,
    destination,
    source,
  }: Erc20Transfer,
  chainId: number,
): PrismaErc20Transfer => ({
  blockNumber,
  transactionIndex,
  logIndex,
  transactionHash,
  address: getAddress(address),
  from: getAddress(from),
  to: getAddress(to),
  value: `0x${value.toString(16)}`,
  destination,
  source,
  chainId,
});

const toPrismaNftTransfer = (
  {
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
  }: NftTransfer,
  chainId: number,
): PrismaNftTransfer => ({
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
  chainId,
});

const toPrismaTransactionEnqueued = (
  {
    l1BlockNumber,
    l2TxHash,
    timestamp,
    l1TxHash,
    l1TxOrigin,
    gasLimit,
  }: TransactionEnqueued,
  chainId: number,
): PrismaTransactionEnqueued => ({
  l1BlockNumber,
  l2TxHash,
  timestamp,
  l1TxHash,
  l1TxOrigin: getAddress(l1TxOrigin),
  gasLimit: `0x${gasLimit.toString(16)}`,
  chainId,
});

const toPrismaAccount = (
  { address, bytecode, transactionHash, contract }: Account,
  chainId: number,
): PrismaAccount => ({
  address,
  bytecode,
  transactionHash,
  contract: contract ? JSON.stringify(contract) : null,
  chainId,
});

const indexAccount = async (
  address: Address,
  accounts: Map<Address, Hex | null>,
  chainId: number,
) => {
  const account = await prisma.account.findUnique({
    where: { address_chainId: { address, chainId } },
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
  chainId: number,
) => {
  const erc20Token = await prisma.erc20Token.findUnique({
    where: { address_chainId: { address, chainId } },
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
    console.error(error);
    unindexedTokens.add(address);
  }
};

const indexErc721Token = async (
  address: Address,
  erc721Tokens: Map<Address, Erc721Token>,
  unindexedTokens: Set<Address>,
  chainId: number,
) => {
  const erc721Token = await prisma.erc721Token.findUnique({
    where: { address_chainId: { address, chainId } },
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
    console.error(error);
    unindexedTokens.add(address);
  }
};

const indexErc1155Token = async (
  address: Address,
  erc1155Tokens: Map<Address, Erc1155Token>,
  chainId: number,
) => {
  const erc1155Token = await prisma.erc1155Token.findUnique({
    where: { address_chainId: { address, chainId } },
  });
  if (erc1155Token || erc1155Tokens.get(address)) {
    return;
  }
  erc1155Tokens.set(address, {
    address,
  });
};

export const indexL2Block = async (blockNumber: bigint, chainId: number) => {
  const block = await l2PublicClient.getBlock({
    blockNumber,
    includeTransactions: true,
  });
  const prismaBlock = toPrismaBlock(block, chainId);
  const prismaTransactions = block.transactions.map((transaction) =>
    toPrismaTransaction(transaction, block.timestamp, chainId),
  );
  const accounts = new Map<Address, Hex | null>();
  await Promise.all(
    block.transactions.map(({ from, to }) =>
      Promise.all([
        indexAccount(getAddress(from), accounts, chainId),
        to ? indexAccount(getAddress(to), accounts, chainId) : null,
      ]),
    ),
  );
  const transactionReceipts = await Promise.all(
    block.transactions.map(({ hash }) =>
      l2PublicClient.getTransactionReceipt({ hash }),
    ),
  );
  const prismaTransactionReceipts = transactionReceipts.map((receipt) =>
    toPrismaTransactionReceipt(receipt, chainId),
  );
  const contractDeployments = new Map<Address, Account>();
  for (const transactionReceipt of transactionReceipts) {
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
    logs.map(({ address }) =>
      indexAccount(getAddress(address), accounts, chainId),
    ),
  );
  const prismaLogs = logs.map((log) => toPrismaLog(log as ViemLog, chainId));
  const unindexedTokens = new Set<Address>();
  const erc20Tokens = new Map<Address, Erc20Token>();
  const erc20Transfers = parseErc20Transfers(logs);
  await Promise.all(
    erc20Transfers.map(({ from, to, address }) =>
      Promise.all([
        indexAccount(getAddress(from), accounts, chainId),
        indexAccount(getAddress(to), accounts, chainId),
        indexErc20Token(
          getAddress(address),
          erc20Tokens,
          unindexedTokens,
          chainId,
        ),
      ]),
    ),
  );
  const erc721Tokens = new Map<Address, Erc721Token>();
  const erc721Transfers = parseErc721Transfers(logs);
  await Promise.all(
    erc721Transfers.map(({ from, to, address }) =>
      Promise.all([
        indexAccount(getAddress(from), accounts, chainId),
        indexAccount(getAddress(to), accounts, chainId),
        indexErc721Token(
          getAddress(address),
          erc721Tokens,
          unindexedTokens,
          chainId,
        ),
      ]),
    ),
  );
  const erc1155Tokens = new Map<Address, Erc1155Token>();
  const erc1155Transfers = parseErc1155Transfers(logs);
  await Promise.all(
    erc1155Transfers.map(({ from, to, address }) =>
      Promise.all([
        indexAccount(getAddress(from), accounts, chainId),
        indexAccount(getAddress(to), accounts, chainId),
        indexErc1155Token(getAddress(address), erc1155Tokens, chainId),
      ]),
    ),
  );
  try {
    await prisma.$transaction([
      prisma.block.upsert({
        where: { number_chainId: { number: prismaBlock.number, chainId } },
        create: prismaBlock,
        update: prismaBlock,
      }),
      ...prismaTransactions.map((prismaTransaction) =>
        prisma.transaction.upsert({
          where: { hash_chainId: { hash: prismaTransaction.hash, chainId } },
          create: prismaTransaction,
          update: prismaTransaction,
        }),
      ),
      ...prismaTransactionReceipts.map((prismaTransactionReceipt) =>
        prisma.transactionReceipt.upsert({
          where: {
            transactionHash_chainId: {
              transactionHash: prismaTransactionReceipt.transactionHash,
              chainId,
            },
          },
          create: prismaTransactionReceipt,
          update: prismaTransactionReceipt,
        }),
      ),
      ...prismaLogs.map((prismaLog) =>
        prisma.log.upsert({
          where: {
            blockNumber_transactionIndex_logIndex_chainId: {
              blockNumber: prismaLog.blockNumber,
              transactionIndex: prismaLog.transactionIndex,
              logIndex: prismaLog.logIndex,
              chainId,
            },
          },
          create: prismaLog,
          update: prismaLog,
        }),
      ),
      ...Array.from(contractDeployments).map(([, account]) =>
        prisma.account.upsert({
          where: { address_chainId: { address: account.address, chainId } },
          create: toPrismaAccount(account, chainId),
          update: toPrismaAccount(account, chainId),
        }),
      ),
      ...Array.from(accounts).map(([address, bytecode]) =>
        prisma.account.upsert({
          where: { address_chainId: { address, chainId } },
          create: { address, bytecode, chainId },
          update: { address, bytecode, chainId },
        }),
      ),
      ...Array.from(erc20Tokens).map(([, erc20Token]) =>
        prisma.erc20Token.upsert({
          where: { address_chainId: { address: erc20Token.address, chainId } },
          create: { ...erc20Token, chainId },
          update: { ...erc20Token, chainId },
        }),
      ),
      ...erc20Transfers
        .filter(({ address }) => !unindexedTokens.has(address))
        .map((erc20Transfer) => toPrismaErc20Transfer(erc20Transfer, chainId))
        .map((prismaErc20Transfer) =>
          prisma.erc20Transfer.upsert({
            where: {
              blockNumber_transactionIndex_logIndex_chainId: {
                blockNumber: prismaErc20Transfer.blockNumber,
                transactionIndex: prismaErc20Transfer.transactionIndex,
                logIndex: prismaErc20Transfer.logIndex,
                chainId,
              },
            },
            create: prismaErc20Transfer,
            update: prismaErc20Transfer,
          }),
        ),
      ...Array.from(erc721Tokens).map(([, erc721Token]) =>
        prisma.erc721Token.upsert({
          where: { address_chainId: { address: erc721Token.address, chainId } },
          create: { ...erc721Token, chainId },
          update: { ...erc721Token, chainId },
        }),
      ),
      ...erc721Transfers
        .filter(({ address }) => !unindexedTokens.has(address))
        .map((erc721Transfer) => toPrismaNftTransfer(erc721Transfer, chainId))
        .map((prismaNftTransfer) =>
          prisma.nftTransfer.upsert({
            where: {
              blockNumber_transactionIndex_logIndex_chainId: {
                blockNumber: prismaNftTransfer.blockNumber,
                transactionIndex: prismaNftTransfer.transactionIndex,
                logIndex: prismaNftTransfer.logIndex,
                chainId,
              },
            },
            create: prismaNftTransfer,
            update: prismaNftTransfer,
          }),
        ),
      ...Array.from(erc1155Tokens).map(([, erc1155Token]) =>
        prisma.erc1155Token.upsert({
          where: {
            address_chainId: { address: erc1155Token.address, chainId },
          },
          create: { ...erc1155Token, chainId },
          update: { ...erc1155Token, chainId },
        }),
      ),
      ...erc1155Transfers
        .map((erc1155Transfer) => toPrismaNftTransfer(erc1155Transfer, chainId))
        .map((prismaNftTransfer) =>
          prisma.nftTransfer.upsert({
            where: {
              blockNumber_transactionIndex_logIndex_chainId: {
                blockNumber: prismaNftTransfer.blockNumber,
                transactionIndex: prismaNftTransfer.transactionIndex,
                logIndex: prismaNftTransfer.logIndex,
                chainId,
              },
            },
            create: prismaNftTransfer,
            update: prismaNftTransfer,
          }),
        ),
    ]);
  } catch (error) {
    console.error(error);
    console.error(
      `Error indexing L2 Block #${blockNumber} for L2 Chain ${chainId}`,
    );
  }
};

export const indexL1Block = async (blockNumber: bigint, chainId: number) => {
  const [
    { timestamp },
    transactionDepositedLogs,
    sentMessageLogs,
    ethBridgeInitiatedLogs,
  ] = await Promise.all([
    l1PublicClient.getBlock({ blockNumber }),
    optimismPortal.getEvents.TransactionDeposited(undefined, {
      fromBlock: blockNumber,
      toBlock: blockNumber,
    }),
    l1CrossDomainMessenger.getEvents.SentMessage(undefined, {
      fromBlock: blockNumber,
      toBlock: blockNumber,
    }),
    l1StandardBridge.getEvents.ETHBridgeInitiated(undefined, {
      fromBlock: blockNumber,
      toBlock: blockNumber,
    }),
  ]);
  const transactionsEnqueued = extractTransactionDepositedLogs({
    logs: transactionDepositedLogs,
  })
    .map((transactionDepositedLog, index) => {
      console.log(transactionDepositedLog);
      const sentMessageLog = sentMessageLogs[index];
      const gasLimit =
        sentMessageLog?.args.gasLimit ??
        BigInt(`0x${transactionDepositedLog.args.opaqueData.slice(130, 146)}`);
      return {
        l1BlockNumber: transactionDepositedLog.blockNumber,
        l2TxHash: getL2TransactionHash({ log: transactionDepositedLog }),
        l1TxHash: transactionDepositedLog.transactionHash,
        timestamp,
        l1TxOrigin: getAddress(transactionDepositedLog.args.from),
        gasLimit,
      };
    })
    .filter((transactionEnqueued) => transactionEnqueued !== null);
  // TODO: bridgeETH deposits not fully supported
  const bridgeTransactions = ethBridgeInitiatedLogs.map(
    (ethBridgeInitiatedLog) => {
      return {
        l1BlockNumber: ethBridgeInitiatedLog.blockNumber,
        l2TxHash: zeroHash,
        l1TxHash: ethBridgeInitiatedLog.transactionHash,
        timestamp,
        l1TxOrigin: getAddress(ethBridgeInitiatedLog.args.from!),
        gasLimit: BigInt(0),
      };
    },
  );
  transactionsEnqueued.push(...bridgeTransactions);
  try {
    await prisma.$transaction([
      prisma.l1Block.upsert({
        where: { number_chainId: { number: blockNumber, chainId } },
        create: { number: blockNumber, chainId },
        update: { number: blockNumber, chainId },
      }),
      ...transactionsEnqueued
        .map((transactionEnqueued) =>
          toPrismaTransactionEnqueued(transactionEnqueued, chainId),
        )
        .map((prismaTransactionEnqueued) =>
          prisma.transactionEnqueued.upsert({
            where: {
              l1BlockNumber_chainId: {
                l1BlockNumber: prismaTransactionEnqueued.l1BlockNumber,
                chainId,
              },
            },
            create: prismaTransactionEnqueued,
            update: prismaTransactionEnqueued,
          }),
        ),
    ]);
  } catch (error) {
    console.error(error);
    console.error(
      `Error indexing L1 Block #${blockNumber} for L2 Chain ${chainId}`,
    );
  }
};
