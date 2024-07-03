import { createPublicClient, http, defineChain } from "viem";
import { mainnet, sepolia, optimism } from "viem/chains";
import { chainConfig } from "viem/op-stack";

export const l1Chain = process.env.LOCAL === "true" ? sepolia : mainnet;

const optimismLocal = defineChain({
  ...chainConfig,
  id: Number(process.env.NEXT_PUBLIC_L2_CHAIN_ID),
  name: "OP Local",
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

export const l2Chain = process.env.LOCAL === "true" ? optimismLocal : optimism;

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
