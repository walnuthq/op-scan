import { createPublicClient, http, defineChain } from "viem";
import { mainnet, sepolia, optimism } from "viem/chains";
import { chainConfig } from "viem/op-stack";

const l1KnownChains = { [mainnet.id]: mainnet, [sepolia.id]: sepolia } as const;
type L1KnownChainId = keyof typeof l1KnownChains;

const l1CustomChain = defineChain({
  id: Number(process.env.NEXT_PUBLIC_L1_CHAIN_ID),
  name: process.env.NEXT_PUBLIC_L1_NAME,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_L1_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://etherscan.io",
      apiUrl: "https://api.etherscan.io/api",
    },
  },
});

const l1ChainId = Number(process.env.NEXT_PUBLIC_L1_CHAIN_ID);

export const l1Chain = Object.keys(l1KnownChains).includes(
  process.env.NEXT_PUBLIC_L1_CHAIN_ID,
)
  ? l1KnownChains[l1ChainId as L1KnownChainId]
  : l1CustomChain;

const l2KnownChains = { [optimism.id]: optimism } as const;
type L2KnownChainId = keyof typeof l2KnownChains;

const l2CustomChain = defineChain({
  ...chainConfig,
  id: Number(process.env.NEXT_PUBLIC_L2_CHAIN_ID),
  name: process.env.NEXT_PUBLIC_L2_NAME,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_L2_RPC_URL],
    },
  },
  contracts: {
    ...chainConfig.contracts,
    disputeGameFactory: {
      [l1Chain.id]: {
        address: process.env.NEXT_PUBLIC_DISPUTE_GAME_FACTORY_ADDRESS,
      },
    },
    l2OutputOracle: {
      [l1Chain.id]: {
        address: process.env.NEXT_PUBLIC_L2_OUTPUT_ORACLE_ADDRESS,
      },
    },
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 1620204,
    },
    portal: {
      [l1Chain.id]: {
        address: process.env.NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS,
      },
    },
    l1StandardBridge: {
      [l1Chain.id]: {
        address: process.env.NEXT_PUBLIC_L1_STANDARD_BRIDGE_ADDRESS,
      },
    },
  },
});

const l2ChainId = Number(process.env.NEXT_PUBLIC_L2_CHAIN_ID);

export const l2Chain = Object.keys(l2KnownChains).includes(
  process.env.NEXT_PUBLIC_L2_CHAIN_ID,
)
  ? l2KnownChains[l2ChainId as L2KnownChainId]
  : l2CustomChain;

export const l1PublicClient = createPublicClient({
  chain: l1Chain,
  transport: http(process.env.NEXT_PUBLIC_L1_RPC_URL, {
    batch: true,
    fetchOptions: { cache: "no-store" },
  }),
});

export const l2PublicClient = createPublicClient({
  chain: l2Chain,
  transport: http(process.env.NEXT_PUBLIC_L2_RPC_URL, {
    batch: true,
    fetchOptions: { cache: "no-store" },
  }),
});
