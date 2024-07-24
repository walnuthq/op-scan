import { Hash, Address, Hex, TransactionType } from "viem";
import {
  Block as PrismaBlock,
  Transaction as PrismaTransaction,
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
  nonce: number;
  transactionIndex: number;
  input: Hex;
  signature: string | null;
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
  transactionReceipt: TransactionReceipt;
};

export type BlockWithTransactions = Omit<Block, "transactions"> & {
  transactions: Transaction[];
};

export type L1L2Transaction = {
  l1BlockNumber: bigint;
  l1TxHash: Hash;
  l2TxHash: Hash;
  timestamp: bigint;
  l1TxOrigin: Address;
  gasLimit: bigint;
};

export const fromPrismaBlock = (
  block: PrismaBlock & { transactions: string[] },
): Block => ({
  number: block.number,
  hash: block.hash as Hash,
  timestamp: block.timestamp,
  gasUsed: BigInt(block.gasUsed),
  gasLimit: BigInt(block.gasLimit),
  extraData: block.extraData as Hex,
  parentHash: block.parentHash as Hash,
  transactions: block.transactions as Hash[],
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
  to: transaction.to ? (transaction.from as Address) : null,
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
  nonce: transaction.nonce,
  transactionIndex: transaction.transactionIndex,
  input: transaction.input as Hex,
  signature: transaction.signature,
  timestamp: transaction.timestamp,
});

export type TokenTransfer = {
  from: Address;
  to: Address;
  tokenAddress: Address;
  amount: string;
  decimals: number;
};
