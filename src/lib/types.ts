import { Hash, Address, Hex, TransactionType } from "viem";

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

export type BlockWithTransactions = Omit<Block, "transactions"> & {
  transactions: Transaction[];
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

export type BlockWithTransactionsAndReceipts = Omit<Block, "transactions"> & {
  transactions: TransactionWithReceipt[];
};

export type Log = {
  address: Address;
  blockNumber: bigint;
  blockHash: Hash;
  data: Hex;
  logIndex: number;
  transactionHash: Hash;
  transactionIndex: number;
  removed: boolean;
  topics: [Hex, ...Hex[]] | [];
};

export type Erc20Token = {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
};

export type Erc20Transfer = {
  blockNumber: bigint;
  transactionIndex: number;
  logIndex: number;
  transactionHash: Hash;
  address: Address;
  from: Address;
  to: Address;
  value: bigint;
};

export type Erc20TransferWithToken = Erc20Transfer & { token: Erc20Token };

export type Erc721Token = {
  address: Address;
  name: string;
  symbol: string;
};

export type Erc1155Token = {
  address: Address;
};

export type NftTransfer = {
  blockNumber: bigint;
  transactionIndex: number;
  logIndex: number;
  transactionHash: Hash;
  address: Address;
  operator: Address | null;
  from: Address;
  to: Address;
  tokenId: bigint;
  value: bigint;
  erc721TokenAddress: Address | null;
  erc1155TokenAddress: Address | null;
};

export type NftTransferWithToken = NftTransfer & {
  erc721Token: Erc721Token | null;
  erc1155Token: Erc1155Token | null;
};

export type Account = {
  address: Address;
  bytecode: Hex | null;
  transactionHash: Hash | null;
};

export type AccountWithTransaction = Account & {
  transaction: Transaction | null;
};

export type AccountWithTransactionAndToken = AccountWithTransaction & {
  erc20Token: Erc20Token | null;
  erc721Token: Erc721Token | null;
  erc1155Token: Erc1155Token | null;
};

export type TransactionEnqueued = {
  l1BlockNumber: bigint;
  l2TxHash: Hash;
  timestamp: bigint;
  l1TxHash: Hash;
  l1TxOrigin: Address;
  gasLimit: bigint;
};

export type NFTMetadata = {
  address: Address;
  name: string;
  symbol: string;
  tokenId: bigint;
  imageUrl: string;
};

export const compilerTypes = {
  "solidity-single-file": "Solidity (Single file)",
  "solidity-multiple-files": "Solidity (Multi-Part files)",
  "solidity-standard-json-input": "Solidity (Standard Json Input)",
} as const;

export const compilerTypeKeys = Object.keys(compilerTypes) as CompilerType[];

export type CompilerType = keyof typeof compilerTypes;

export const compilerVersions = [
  "v0.8.27+commit.40a35a09",
  "v0.8.26+commit.8a97fa7a",
  "v0.8.25+commit.b61c2a91",
  "v0.8.24+commit.e11b9ed9",
  "v0.8.23+commit.f704f362",
  "v0.8.22+commit.4fc1097e",
  "v0.8.21+commit.d9974bed",
  "v0.8.20+commit.a1b79de6",
  "v0.8.19+commit.7dd6d404",
  "v0.8.18+commit.87f61d96",
  "v0.8.17+commit.8df45f5f",
  "v0.8.16+commit.07a7930e",
  "v0.8.15+commit.e14f2714",
  "v0.8.14+commit.80d49f37",
  "v0.8.13+commit.abaa5c0e",
  "v0.8.12+commit.f00d7308",
  "v0.8.11+commit.d7f03943",
  "v0.8.10+commit.fc410830",
  "v0.8.9+commit.e5eed63a",
  "v0.8.8+commit.dddeac2f",
  "v0.8.7+commit.e28d00a7",
  "v0.8.6+commit.11564f7e",
  "v0.8.5+commit.a4f2e591",
  "v0.8.4+commit.c7e474f2",
  "v0.8.3+commit.8d00100c",
  "v0.8.2+commit.661d1103",
  "v0.8.1+commit.df193b15",
  "v0.8.0+commit.c7dfd78e",
] as const;

export type CompilerVersion = (typeof compilerVersions)[number];
