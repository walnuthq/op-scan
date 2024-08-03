import { Hash, Address, Hex, TransactionType, getAddress } from "viem";
import {
  Block as PrismaBlock,
  Transaction as PrismaTransaction,
  TransactionReceipt as PrismaTransactionReceipt,
  erc20Transfer as PrismaERC20Transfer,
  TransactionEnqueued as PrismaTransactionEnqueued,
} from "@/prisma/generated/client";

export type Block = {
  number: bigint;
  hash: Hash;
  timestamp: bigint;
  gasUsed: bigint;
  gasLimit: bigint;
  extraData: Hex;
  parentHash: Hash;
  transactions: Hash[];
};

export type Transaction = {
  hash: Hash;
  blockNumber: bigint;
  from: Address;
  to: Address | null;
  value: bigint;
  gas: bigint;
  gasPrice: bigint | null;
  maxFeePerGas: bigint | null;
  maxPriorityFeePerGas: bigint | null;
  type: TransactionType;
  typeHex: Hex;
  nonce: number;
  transactionIndex: number;
  input: Hex;
  signature: string;
  timestamp: bigint;
};

export type TransactionReceipt = {
  transactionHash: Hash;
  status: "success" | "reverted";
  from: Address;
  to: Address | null;
  effectiveGasPrice: bigint;
  gasUsed: bigint;
  l1Fee: bigint | null;
  l1GasPrice: bigint | null;
  l1GasUsed: bigint | null;
  l1FeeScalar: number | null;
};

export type TransactionWithReceipt = Transaction & {
  receipt: TransactionReceipt;
};

export type BlockWithTransactions = Omit<Block, "transactions"> & {
  transactions: Transaction[];
};

export type TransactionEnqueued = {
  l1BlockNumber: bigint;
  l2TxHash: Hash;
  timestamp: bigint;
  l1TxHash: Hash;
  l1TxOrigin: Address;
  gasLimit: bigint;
};

export type ViemBlock = {
  number: bigint;
  hash: Hash;
  timestamp: bigint;
  gasUsed: bigint;
  gasLimit: bigint;
  extraData: Hex;
  parentHash: Hash;
  transactions: Hash[];
};

export const fromViemBlock = (block: ViemBlock): Block => ({
  number: block.number,
  hash: block.hash,
  timestamp: block.timestamp,
  gasUsed: block.gasUsed,
  gasLimit: block.gasLimit,
  extraData: block.extraData,
  parentHash: block.parentHash,
  transactions: block.transactions,
});

export type ViemTransaction = {
  hash: Hash;
  blockNumber: bigint;
  from: Address;
  to: Address | null;
  value: bigint;
  gas: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  type: TransactionType;
  typeHex: Hex | null;
  nonce: number;
  transactionIndex: number;
  input: Hex;
};

export type ViemBlockWithTransactions = Omit<ViemBlock, "transactions"> & {
  transactions: ViemTransaction[];
};

export const fromViemBlockWithTransactions = (
  block: ViemBlockWithTransactions,
  signatures?: string[],
): BlockWithTransactions => ({
  number: block.number,
  hash: block.hash,
  timestamp: block.timestamp,
  gasUsed: block.gasUsed,
  gasLimit: block.gasLimit,
  extraData: block.extraData,
  parentHash: block.parentHash,
  transactions: block.transactions.map((transaction, i) => ({
    blockNumber: transaction.blockNumber,
    hash: transaction.hash,
    from: getAddress(transaction.from),
    to: transaction.to ? getAddress(transaction.to) : null,
    value: transaction.value,
    gas: transaction.gas,
    gasPrice: transaction.gasPrice ?? null,
    maxFeePerGas: transaction.maxFeePerGas ?? null,
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ?? null,
    transactionIndex: transaction.transactionIndex,
    type: transaction.type || "legacy",
    typeHex: transaction.typeHex || "0x1",
    nonce: transaction.nonce,
    input: transaction.input,
    signature: signatures ? signatures[i] : "",
    timestamp: block.timestamp,
  })),
});

export const fromViemTransaction = (
  transaction: ViemTransaction,
  timestamp: bigint,
  signature?: string,
): Transaction => ({
  blockNumber: transaction.blockNumber,
  hash: transaction.hash,
  from: getAddress(transaction.from),
  to: transaction.to ? getAddress(transaction.to) : null,
  value: transaction.value,
  gas: transaction.gas,
  gasPrice: transaction.gasPrice ?? null,
  maxFeePerGas: transaction.maxFeePerGas ?? null,
  maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ?? null,
  transactionIndex: transaction.transactionIndex,
  type: transaction.type || "legacy",
  typeHex: transaction.typeHex || "0x1",
  nonce: transaction.nonce,
  input: transaction.input,
  signature: signature ?? "",
  timestamp,
});

export type ViemTransactionReceipt = {
  transactionHash: Hash;
  status: "success" | "reverted";
  from: Address;
  to: Address | null;
  effectiveGasPrice: bigint | null;
  gasUsed: bigint;
  l1Fee: bigint | null;
  l1GasPrice: bigint | null;
  l1GasUsed: bigint | null;
  l1FeeScalar: number | null;
};

export const fromViemTransactionWithReceipt = (
  transaction: ViemTransaction,
  receipt: ViemTransactionReceipt,
  timestamp: bigint,
  signature?: string,
): TransactionWithReceipt => ({
  blockNumber: transaction.blockNumber,
  hash: transaction.hash,
  from: getAddress(transaction.from),
  to: transaction.to ? getAddress(transaction.to) : null,
  value: transaction.value,
  gas: transaction.gas,
  gasPrice: transaction.gasPrice ?? null,
  maxFeePerGas: transaction.maxFeePerGas ?? null,
  maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ?? null,
  transactionIndex: transaction.transactionIndex,
  type: transaction.type || "legacy",
  typeHex: transaction.typeHex || "0x1",
  nonce: transaction.nonce,
  input: transaction.input,
  signature: signature ?? "",
  timestamp,
  receipt: {
    transactionHash: receipt.transactionHash,
    status: receipt.status,
    from: getAddress(receipt.from),
    to: receipt.to ? getAddress(receipt.to) : null,
    effectiveGasPrice:
      receipt.effectiveGasPrice || transaction.gasPrice || BigInt(0),
    gasUsed: receipt.gasUsed,
    l1Fee: receipt.l1Fee,
    l1GasPrice: receipt.l1GasPrice,
    l1GasUsed: receipt.l1GasUsed,
    l1FeeScalar: receipt.l1FeeScalar,
  },
});

export type ViemLog = {
  address: Address;
  blockNumber: bigint;
  blockHash: Hash;
  data: Hex;
  logIndex: number;
  transactionHash: Hash;
  transactionIndex: number;
  removed: boolean;
  topics: Hex[];
};

export const fromPrismaBlock = (
  block: PrismaBlock & { transactions: PrismaTransaction[] },
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

export const fromPrismaBlockWithTransactions = (
  block: PrismaBlock & { transactions: PrismaTransaction[] },
): BlockWithTransactions => ({
  number: block.number,
  hash: block.hash as Hash,
  timestamp: block.timestamp,
  gasUsed: BigInt(block.gasUsed),
  gasLimit: BigInt(block.gasLimit),
  extraData: block.extraData as Hex,
  parentHash: block.parentHash as Hash,
  transactions: block.transactions.map(fromPrismaTransaction),
});

export const fromPrismaTransaction = (
  transaction: PrismaTransaction,
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
  signature: transaction.signature || "",
  timestamp: transaction.timestamp,
});

export const fromPrismaTransactionWithReceipt = (
  transaction: PrismaTransaction,
  receipt: PrismaTransactionReceipt,
): TransactionWithReceipt => ({
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
  signature: transaction.signature || "",
  timestamp: transaction.timestamp,
  receipt: {
    transactionHash: receipt.transactionHash as Hash,
    status: receipt.status ? "success" : "reverted",
    from: receipt.from as Address,
    to: receipt.to ? (receipt.to as Address) : null,
    effectiveGasPrice: receipt.effectiveGasPrice
      ? BigInt(receipt.effectiveGasPrice)
      : transaction.gasPrice
        ? BigInt(transaction.gasPrice)
        : BigInt(0),
    gasUsed: BigInt(receipt.gasUsed),
    l1Fee: receipt.l1Fee ? BigInt(receipt.l1Fee) : null,
    l1GasPrice: receipt.l1GasPrice ? BigInt(receipt.l1GasPrice) : null,
    l1GasUsed: receipt.l1GasUsed ? BigInt(receipt.l1GasUsed) : null,
    l1FeeScalar: receipt.l1FeeScalar,
  },
});

export const fromPrismaERC20Transfer = (
  erc20Transfer: PrismaERC20Transfer,
): ERC20Transfer => ({
  transactionHash: erc20Transfer.transactionHash as Hash,
  logIndex: erc20Transfer.logIndex,
  from: erc20Transfer.from as Address,
  to: erc20Transfer.to as Address,
  address: erc20Transfer.address as Address,
  amount: BigInt(erc20Transfer.amount),
  decimals: erc20Transfer.decimals,
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

export type ERC20Transfer = {
  transactionHash: Hash;
  logIndex: number;
  from: Address;
  to: Address;
  address: Address;
  amount: bigint;
  decimals: number;
};
