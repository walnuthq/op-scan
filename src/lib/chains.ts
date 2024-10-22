import {
  createPublicClient,
  http,
  defineChain,
  fallback,
  HttpTransportConfig,
} from "viem";
import { mainnet, sepolia, optimism, optimismSepolia } from "viem/chains";
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
      name: process.env.NEXT_PUBLIC_L1_BLOCK_EXPLORER_NAME,
      url: process.env.NEXT_PUBLIC_L1_BLOCK_EXPLORER_URL,
    },
  },
});

const l1ChainId = Number(process.env.NEXT_PUBLIC_L1_CHAIN_ID);

export const l1Chain = Object.keys(l1KnownChains).includes(
  process.env.NEXT_PUBLIC_L1_CHAIN_ID,
)
  ? l1KnownChains[l1ChainId as L1KnownChainId]
  : l1CustomChain;

const l2KnownChains = {
  [optimism.id]: optimism,
  [optimismSepolia.id]: optimismSepolia,
} as const;
type L2KnownChainId = keyof typeof l2KnownChains;

const l2CustomChain = defineChain({
  ...chainConfig,
  id: Number(process.env.NEXT_PUBLIC_L2_CHAIN_ID),
  caipNetworkId: `eip155:${process.env.NEXT_PUBLIC_L2_CHAIN_ID}`,
  chainNamespace: "eip155",
  name: process.env.NEXT_PUBLIC_L2_NAME,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_L2_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: process.env.NEXT_PUBLIC_L2_BLOCK_EXPLORER_NAME,
      url: process.env.NEXT_PUBLIC_L2_BLOCK_EXPLORER_URL,
    },
  },
});

const l2ChainId = Number(process.env.NEXT_PUBLIC_L2_CHAIN_ID);

export const l2Chain = Object.keys(l2KnownChains).includes(
  process.env.NEXT_PUBLIC_L2_CHAIN_ID,
)
  ? l2KnownChains[l2ChainId as L2KnownChainId]
  : l2CustomChain;

const transportOptions: HttpTransportConfig = {
  batch: true,
  fetchOptions: { cache: "no-store" },
  retryCount: 10,
};
const l1Transports = [
  http(process.env.NEXT_PUBLIC_L1_RPC_URL, transportOptions),
];
if (process.env.NEXT_PUBLIC_L1_FALLBACK1_RPC_URL) {
  l1Transports.push(
    http(process.env.NEXT_PUBLIC_L1_FALLBACK1_RPC_URL, transportOptions),
  );
}
if (process.env.NEXT_PUBLIC_L1_FALLBACK2_RPC_URL) {
  l1Transports.push(
    http(process.env.NEXT_PUBLIC_L1_FALLBACK2_RPC_URL, transportOptions),
  );
}
if (process.env.NEXT_PUBLIC_L1_FALLBACK3_RPC_URL) {
  l1Transports.push(
    http(process.env.NEXT_PUBLIC_L1_FALLBACK3_RPC_URL, transportOptions),
  );
}

export const l1PublicClient = createPublicClient({
  chain: l1Chain,
  transport: fallback(l1Transports),
});

const l2Transports = [
  http(process.env.NEXT_PUBLIC_L2_RPC_URL, transportOptions),
];
if (process.env.NEXT_PUBLIC_L2_FALLBACK1_RPC_URL) {
  l2Transports.push(
    http(process.env.NEXT_PUBLIC_L2_FALLBACK1_RPC_URL, transportOptions),
  );
}
if (process.env.NEXT_PUBLIC_L2_FALLBACK2_RPC_URL) {
  l2Transports.push(
    http(process.env.NEXT_PUBLIC_L2_FALLBACK2_RPC_URL, transportOptions),
  );
}
if (process.env.NEXT_PUBLIC_L2_FALLBACK3_RPC_URL) {
  l2Transports.push(
    http(process.env.NEXT_PUBLIC_L2_FALLBACK3_RPC_URL, transportOptions),
  );
}

export const l2Transport = fallback(l2Transports);

export const l2PublicClient = createPublicClient({
  chain: l2Chain,
  transport: l2Transport,
});
