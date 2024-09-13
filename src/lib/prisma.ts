import { Hash, Address, Hex, TransactionType } from "viem";
import {
  Prisma,
  PrismaClient,
  Erc20Token as PrismaErc20Token,
  Erc721Token as PrismaErc721Token,
  Erc1155Token as PrismaErc1155Token,
  Erc20Transfer as PrismaErc20Transfer,
  NftTransfer as PrismaNftTransfer,
  Log as PrismaLog,
  Transaction as PrismaTransaction,
  TransactionEnqueued as PrismaTransactionEnqueued,
  Account as PrismaAccount,
} from "@/prisma/generated/client";
import {
  Block,
  Transaction,
  BlockWithTransactionsAndReceipts,
  TransactionWithReceipt,
  TransactionWithReceiptAndAccounts,
  Log,
  Erc20Token,
  Erc721Token,
  Erc1155Token,
  Erc20Transfer,
  Erc20TransferWithToken,
  NftTransfer,
  NftTransferWithToken,
  TransactionEnqueued,
  Account,
  AccountWithTransactionAndToken,
} from "@/lib/types";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const prismaBlockWithTransactionsHashes =
  Prisma.validator<Prisma.BlockDefaultArgs>()({
    include: { transactions: { select: { hash: true } } },
  });

type PrismaBlockWithTransactionsHashes = Prisma.BlockGetPayload<
  typeof prismaBlockWithTransactionsHashes
>;

export const fromPrismaBlock = (
  block: PrismaBlockWithTransactionsHashes,
): Block => ({
  number: block.number,
  hash: block.hash as Hash,
  timestamp: block.timestamp,
  gasUsed: BigInt(block.gasUsed),
  gasLimit: BigInt(block.gasLimit),
  extraData: block.extraData as Hex,
  parentHash: block.parentHash as Hash,
  transactions: block.transactions.map(({ hash }) => hash as Hash),
});

const prismaBlockWithTransactionsAndReceipts =
  Prisma.validator<Prisma.BlockDefaultArgs>()({
    include: { transactions: { include: { receipt: true, accounts: true } } },
  });

type PrismaBlockWithTransactionsAndReceipts = Prisma.BlockGetPayload<
  typeof prismaBlockWithTransactionsAndReceipts
>;

export const fromPrismaBlockWithTransactionsAndReceipts = (
  block: PrismaBlockWithTransactionsAndReceipts,
  signatures: string[] = [],
): BlockWithTransactionsAndReceipts => ({
  number: block.number,
  hash: block.hash as Hash,
  timestamp: block.timestamp,
  gasUsed: BigInt(block.gasUsed),
  gasLimit: BigInt(block.gasLimit),
  extraData: block.extraData as Hex,
  parentHash: block.parentHash as Hash,
  transactions: block.transactions.map((transaction, i) =>
    fromPrismaTransactionWithReceiptAndAccounts(transaction, signatures[i]),
  ),
});

export const fromPrismaTransaction = (
  transaction: PrismaTransaction,
  signature: string = "",
): Transaction => ({
  hash: transaction.hash as Hash,
  blockNumber: transaction.blockNumber,
  from: transaction.from as Address,
  to: transaction.to ? (transaction.to as Address) : null,
  value: BigInt(transaction.value),
  gas: BigInt(transaction.gas),
  gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : null,
  maxFeePerGas: transaction.maxFeePerGas
    ? BigInt(transaction.maxFeePerGas)
    : null,
  maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
    ? BigInt(transaction.maxPriorityFeePerGas)
    : null,
  type: transaction.type as TransactionType,
  typeHex: transaction.typeHex as Hex,
  nonce: transaction.nonce,
  transactionIndex: transaction.transactionIndex,
  input: transaction.input as Hex,
  signature,
  timestamp: transaction.timestamp,
});

const prismaTransactionWithReceipt =
  Prisma.validator<Prisma.TransactionDefaultArgs>()({
    include: { receipt: true },
  });

type PrismaTransactionWithReceipt = Prisma.TransactionGetPayload<
  typeof prismaTransactionWithReceipt
>;

export const fromPrismaTransactionWithReceipt = (
  transaction: PrismaTransactionWithReceipt,
  signature: string = "",
): TransactionWithReceipt => ({
  ...fromPrismaTransaction(transaction, signature),
  receipt: {
    transactionHash: transaction.receipt!.transactionHash as Hash,
    status: transaction.receipt!.status ? "success" : "reverted",
    from: transaction.receipt!.from as Address,
    to: transaction.receipt!.to ? (transaction.receipt!.to as Address) : null,
    effectiveGasPrice: transaction.receipt!.effectiveGasPrice
      ? BigInt(transaction.receipt!.effectiveGasPrice)
      : transaction.gasPrice
        ? BigInt(transaction.gasPrice)
        : BigInt(0),
    gasUsed: BigInt(transaction.receipt!.gasUsed),
    l1Fee: transaction.receipt!.l1Fee
      ? BigInt(transaction.receipt!.l1Fee)
      : null,
    l1GasPrice: transaction.receipt!.l1GasPrice
      ? BigInt(transaction.receipt!.l1GasPrice)
      : null,
    l1GasUsed: transaction.receipt!.l1GasUsed
      ? BigInt(transaction.receipt!.l1GasUsed)
      : null,
    l1FeeScalar: transaction.receipt!.l1FeeScalar,
  },
});

const prismaTransactionWithReceiptAndAccounts =
  Prisma.validator<Prisma.TransactionDefaultArgs>()({
    include: { receipt: true, accounts: true },
  });

type PrismaTransactionWithReceiptAndAccounts = Prisma.TransactionGetPayload<
  typeof prismaTransactionWithReceiptAndAccounts
>;

export const fromPrismaTransactionWithReceiptAndAccounts = (
  transaction: PrismaTransactionWithReceiptAndAccounts,
  signature: string = "",
): TransactionWithReceiptAndAccounts => ({
  ...fromPrismaTransactionWithReceipt(transaction, signature),
  accounts: transaction.accounts.map(fromPrismaAccount),
});

export const fromPrismaLog = (log: PrismaLog): Log => ({
  address: log.address as Hash,
  blockNumber: log.blockNumber,
  blockHash: log.blockHash as Hash,
  data: log.data as Hex,
  logIndex: log.logIndex,
  transactionHash: log.transactionHash as Hash,
  transactionIndex: log.transactionIndex,
  removed: log.removed,
  topics:
    log.topics.length === 0 ? [] : (log.topics.split(",") as [Hex, ...Hex[]]),
});

export const fromPrismaErc20Token = (
  erc20Token: PrismaErc20Token,
): Erc20Token => ({
  address: erc20Token.address as Address,
  name: erc20Token.name,
  symbol: erc20Token.symbol,
  decimals: erc20Token.decimals,
});

export const fromPrismaErc20Transfer = (
  erc20Transfer: PrismaErc20Transfer,
): Erc20Transfer => ({
  blockNumber: erc20Transfer.blockNumber,
  transactionIndex: erc20Transfer.transactionIndex,
  logIndex: erc20Transfer.logIndex,
  transactionHash: erc20Transfer.transactionHash as Hash,
  address: erc20Transfer.address as Address,
  from: erc20Transfer.from as Address,
  to: erc20Transfer.to as Address,
  value: BigInt(erc20Transfer.value),
});

const prismaErc20TransferWithToken =
  Prisma.validator<Prisma.Erc20TransferDefaultArgs>()({
    include: { token: true },
  });

type PrismaErc20TransferWithToken = Prisma.Erc20TransferGetPayload<
  typeof prismaErc20TransferWithToken
>;

export const fromPrismaErc20TransferWithToken = (
  erc20Transfer: PrismaErc20TransferWithToken,
): Erc20TransferWithToken => ({
  ...fromPrismaErc20Transfer(erc20Transfer),
  token: fromPrismaErc20Token(erc20Transfer.token),
});

export const fromPrismaErc721Token = (
  erc721Token: PrismaErc721Token,
): Erc721Token => ({
  address: erc721Token.address as Address,
  name: erc721Token.name,
  symbol: erc721Token.symbol,
});

export const fromPrismaErc1155Token = (
  erc1155Token: PrismaErc1155Token,
): Erc1155Token => ({
  address: erc1155Token.address as Address,
});

export const fromPrismaNftTransfer = (
  nftTransfer: PrismaNftTransfer,
): NftTransfer => ({
  blockNumber: nftTransfer.blockNumber,
  transactionIndex: nftTransfer.transactionIndex,
  logIndex: nftTransfer.logIndex,
  transactionHash: nftTransfer.transactionHash as Hash,
  address: nftTransfer.address as Address,
  operator: nftTransfer.operator ? (nftTransfer.operator as Address) : null,
  from: nftTransfer.from as Address,
  to: nftTransfer.to as Address,
  tokenId: BigInt(nftTransfer.tokenId),
  value: BigInt(nftTransfer.value),
  erc721TokenAddress: nftTransfer.erc721TokenAddress
    ? (nftTransfer.erc721TokenAddress as Address)
    : null,
  erc1155TokenAddress: nftTransfer.erc1155TokenAddress
    ? (nftTransfer.erc1155TokenAddress as Address)
    : null,
});

const prismaNftTransferWithToken =
  Prisma.validator<Prisma.NftTransferDefaultArgs>()({
    include: { erc721Token: true, erc1155Token: true },
  });

type PrismaNftTransferWithToken = Prisma.NftTransferGetPayload<
  typeof prismaNftTransferWithToken
>;

export const fromPrismaNftTransferWithToken = (
  nftTransfer: PrismaNftTransferWithToken,
): NftTransferWithToken => ({
  ...fromPrismaNftTransfer(nftTransfer),
  erc721Token: nftTransfer.erc721Token
    ? fromPrismaErc721Token(nftTransfer.erc721Token)
    : null,
  erc1155Token: nftTransfer.erc1155Token
    ? fromPrismaErc1155Token(nftTransfer.erc1155Token)
    : null,
});

export const fromPrismaTransactionEnqueued = (
  transaction: PrismaTransactionEnqueued,
): TransactionEnqueued => ({
  l1BlockNumber: transaction.l1BlockNumber,
  l2TxHash: transaction.l2TxHash as Hash,
  timestamp: transaction.timestamp,
  l1TxHash: transaction.l1TxHash as Hash,
  l1TxOrigin: transaction.l1TxOrigin as Address,
  gasLimit: BigInt(transaction.gasLimit),
});

export const fromPrismaAccount = (account: PrismaAccount): Account => ({
  address: account.address as Address,
  bytecode: account.bytecode ? (account.bytecode as Hex) : null,
  transactionHash: account.transactionHash as Hash,
  contract: account.contract ? JSON.parse(account.contract) : null,
});

const prismaAccountWithTransactionAndToken =
  Prisma.validator<Prisma.AccountDefaultArgs>()({
    include: {
      transaction: true,
      erc20Token: true,
      erc721Token: true,
      erc1155Token: true,
    },
  });

type PrismaAccountWithTransactionAndToken = Prisma.AccountGetPayload<
  typeof prismaAccountWithTransactionAndToken
>;

export const fromPrismaAccountWithTransactionAndToken = (
  account: PrismaAccountWithTransactionAndToken,
): AccountWithTransactionAndToken => ({
  ...fromPrismaAccount(account),
  transaction: account.transaction
    ? fromPrismaTransaction(account.transaction)
    : null,
  erc20Token: account.erc20Token
    ? fromPrismaErc20Token(account.erc20Token)
    : null,
  erc721Token: account.erc721Token
    ? fromPrismaErc721Token(account.erc721Token)
    : null,
  erc1155Token: account.erc1155Token
    ? fromPrismaErc1155Token(account.erc1155Token)
    : null,
});
