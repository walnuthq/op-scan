import {
  type Hash,
  type Address,
  type Hex,
  type TransactionType,
  type Abi,
} from "viem";

export type Block = {
  number: bigint;
  hash: Hash;
  timestamp: bigint;
  gasUsed: bigint;
  gasLimit: bigint;
  extraData: Hex;
  parentHash: Hash;
  transactionsCount: number;
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

export type BlockWithTransactions = Block & {
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

export type TransactionWithAccounts = Transaction & {
  accounts: Account[];
};

export type TransactionWithReceiptAndAccounts = TransactionWithReceipt &
  TransactionWithAccounts;

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

export const solidityCompilerVersionKeys = [
  "0.8.29+commit.ab55807c",
  "0.8.28+commit.7893614a",
  "0.8.27+commit.40a35a09",
  "0.8.26+commit.8a97fa7a",
  "0.8.25+commit.b61c2a91",
  "0.8.24+commit.e11b9ed9",
  "0.8.23+commit.f704f362",
  "0.8.22+commit.4fc1097e",
  "0.8.21+commit.d9974bed",
  "0.8.20+commit.a1b79de6",
  "0.8.19+commit.7dd6d404",
  "0.8.18+commit.87f61d96",
  "0.8.17+commit.8df45f5f",
  "0.8.16+commit.07a7930e",
  "0.8.15+commit.e14f2714",
  "0.8.14+commit.80d49f37",
  "0.8.13+commit.abaa5c0e",
  "0.8.12+commit.f00d7308",
  "0.8.11+commit.d7f03943",
  "0.8.10+commit.fc410830",
  "0.8.9+commit.e5eed63a",
  "0.8.8+commit.dddeac2f",
  "0.8.7+commit.e28d00a7",
  "0.8.6+commit.11564f7e",
  "0.8.5+commit.a4f2e591",
  "0.8.4+commit.c7e474f2",
  "0.8.3+commit.8d00100c",
  "0.8.2+commit.661d1103",
  "0.8.1+commit.df193b15",
  "0.8.0+commit.c7dfd78e",
] as const;

export type SolidityCompilerVersion =
  (typeof solidityCompilerVersionKeys)[number];

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
