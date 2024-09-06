import { Hash, Address, Hex, TransactionType, getAddress } from "viem";
import {
  Block,
  BlockWithTransactionsAndReceipts,
  Transaction,
  TransactionWithReceipt,
} from "@/lib/types";

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

export const fromViemBlockWithTransactionsAndReceipts = (
  block: ViemBlockWithTransactions,
  receipts: ViemTransactionReceipt[],
  signatures: string[] = [],
): BlockWithTransactionsAndReceipts => ({
  number: block.number,
  hash: block.hash,
  timestamp: block.timestamp,
  gasUsed: block.gasUsed,
  gasLimit: block.gasLimit,
  extraData: block.extraData,
  parentHash: block.parentHash,
  transactions: block.transactions.map((transaction, i) =>
    fromViemTransactionWithReceipt(
      transaction,
      receipts[i],
      block.timestamp,
      signatures[i],
    ),
  ),
});

export const fromViemTransaction = (
  transaction: ViemTransaction,
  timestamp: bigint,
  signature: string = "",
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
  signature,
  timestamp,
});

export const fromViemTransactionWithReceipt = (
  transaction: ViemTransaction,
  receipt: ViemTransactionReceipt,
  timestamp: bigint,
  signature: string = "",
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
  signature,
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
