import {
  createPublicClient,
  http,
  defineChain,
  fallback,
  type HttpTransportConfig,
} from "viem";
import { chainConfig } from "viem/op-stack";

export const l1Chain = defineChain({
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

export const l2Chain = defineChain({
  ...chainConfig,
  id: Number(process.env.NEXT_PUBLIC_L2_CHAIN_ID),
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
if (process.env.NEXT_PUBLIC_L1_FALLBACK4_RPC_URL) {
  l1Transports.push(
    http(process.env.NEXT_PUBLIC_L1_FALLBACK4_RPC_URL, transportOptions),
  );
}
if (process.env.NEXT_PUBLIC_L1_FALLBACK5_RPC_URL) {
  l1Transports.push(
    http(process.env.NEXT_PUBLIC_L1_FALLBACK5_RPC_URL, transportOptions),
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
if (process.env.NEXT_PUBLIC_L2_FALLBACK4_RPC_URL) {
  l2Transports.push(
    http(process.env.NEXT_PUBLIC_L2_FALLBACK4_RPC_URL, transportOptions),
  );
}
if (process.env.NEXT_PUBLIC_L2_FALLBACK5_RPC_URL) {
  l2Transports.push(
    http(process.env.NEXT_PUBLIC_L2_FALLBACK5_RPC_URL, transportOptions),
  );
}

export const l2Transport = fallback(l2Transports);

export const l2PublicClient = createPublicClient({
  chain: l2Chain,
  transport: l2Transport,
});
