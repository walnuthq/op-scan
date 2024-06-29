import { Hash, Address } from "viem";
import {
  Block as PrismaBlock,
  Transaction as PrismaTransaction,
} from "@/prisma/generated/client";

export type Block = { number: bigint; hash: Hash; timestamp: bigint };

export type Transaction = {
  hash: Hash;
  blockNumber: bigint;
  from: Address;
  to: Address | null;
  value: bigint;
  gasPrice?: bigint;
  timestamp: bigint;
  effectiveGasUsed?: bigint;
  method?: string;
};

export type AddressDetails = {
  addressType: "Contract" | "Address";
  balance: bigint;
};

export type BlockWithTransactions = Block & { transactions: Transaction[] };

export type L1L2Transaction = {
  l1BlockNumber: bigint;
  l1Hash: Hash;
  l2Hash: Hash;
};

export const fromPrismaBlock = (block: PrismaBlock) => ({
  number: BigInt(block.number),
  hash: block.hash as Hash,
  timestamp: BigInt(block.timestamp),
});

export const fromPrismaBlockWithTransactions = (
  block: PrismaBlock & { transactions: PrismaTransaction[] },
) => ({
  ...fromPrismaBlock(block),
  transactions: block.transactions.map(fromPrismaTransaction),
});

export const fromPrismaTransaction = (transaction: PrismaTransaction) => ({
  hash: transaction.hash as Hash,
  blockNumber: BigInt(transaction.blockNumber),
  from: transaction.from as Address,
  to: transaction.to ? (transaction.from as Address) : null,
  value: BigInt(transaction.value),
  gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : undefined,
  timestamp: BigInt(transaction.timestamp),
});
