import { Hash, Address, Hex, TransactionType, Abi } from "viem";

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

export type TransactionWithReceiptAndAccounts = TransactionWithReceipt & {
  accounts: Account[];
};

export type BlockWithTransactionsAndReceipts = Omit<Block, "transactions"> & {
  transactions: TransactionWithReceiptAndAccounts[];
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

export type ContractInfo = {
  name: string;
  match: "partial" | "perfect" | null;
  evmVersion: string;
  compilerVersion: string;
  optimizer: { enabled: boolean; runs: number };
  license: string;
  language: string;
};

export type ContractSource = { path: string; content: string };

export type ContractSources = ContractSource[];

export type Contract = {
  info: ContractInfo;
  sources: ContractSources;
  abi: Abi;
};

export type Account = {
  address: Address;
  bytecode: Hex | null;
  transactionHash: Hash | null;
  contract: Contract | null;
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
  "solidity-standard-json-input": "Solidity (Standard Json Input)",
  "solidity-single-file": "Solidity (Single file)",
  // "solidity-multiple-files": "Solidity (Multi-Part files)",
} as const;

export type CompilerType = keyof typeof compilerTypes;

export const compilerTypeKeys = Object.keys(compilerTypes) as CompilerType[];

export const compilerVersions = [
  "0.8.24+commit.e11b9ed9",
  "0.8.20+commit.a1b79de6",
  "0.8.18+commit.87f61d96",
  "0.8.7+commit.e28d00a7",
  "0.8.5+commit.a4f2e591",
] as const;

export type CompilerVersion = (typeof compilerVersions)[number];

export const evmVersions = {
  default: "default (compiler defaults)",
  berlin: "berlin (default for >= v0.8.5)",
  london: "london (default for >= v0.8.7)",
  paris: "paris (default for >= v0.8.18)",
  shanghai: "shanghai (default for >= v0.8.20)",
  cancun: "cancun (default for >= v0.8.24)",
} as const;

export type EvmVersion = keyof typeof evmVersions;

export const evmVersionKeys = Object.keys(evmVersions) as EvmVersion[];
