import {
  createPublicClient,
  http,
  defineChain,
  fallback,
  type HttpTransportConfig,
} from "viem";
import { chainConfig } from "viem/op-stack";

const l1ChainId = process.env.NEXT_PUBLIC_SUPERSIM
  ? 900
  : Number(process.env.NEXT_PUBLIC_L1_CHAIN_ID);

const l1ChainName = process.env.NEXT_PUBLIC_SUPERSIM
  ? "Local"
  : process.env.NEXT_PUBLIC_L1_NAME;

const l1ChainRpcUrl = process.env.NEXT_PUBLIC_SUPERSIM
  ? "http://127.0.0.1:8545"
  : process.env.NEXT_PUBLIC_L1_RPC_URL;

export const l1Chain = defineChain({
  id: l1ChainId,
  name: l1ChainName,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [l1ChainRpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: process.env.NEXT_PUBLIC_L1_BLOCK_EXPLORER_NAME,
      url: process.env.NEXT_PUBLIC_L1_BLOCK_EXPLORER_URL,
    },
  },
});

const l2ChainId = process.env.NEXT_PUBLIC_SUPERSIM
  ? typeof window === "undefined"
    ? process.env.PORT === "3001"
      ? 901
      : 902
    : window.location.port === "3001"
      ? 901
      : 902
  : Number(process.env.NEXT_PUBLIC_L2_CHAIN_ID);

const l2ChainName = process.env.NEXT_PUBLIC_SUPERSIM
  ? typeof window === "undefined"
    ? process.env.PORT === "3001"
      ? "OPChainA"
      : "OPChainB"
    : window.location.port === "3001"
      ? "OPChainA"
      : "OPChainB"
  : process.env.NEXT_PUBLIC_L2_NAME;

const l2ChainRpcUrl = process.env.NEXT_PUBLIC_SUPERSIM
  ? typeof window === "undefined"
    ? process.env.PORT === "3001"
      ? "http://127.0.0.1:9545"
      : "http://127.0.0.1:9546"
    : window.location.port === "3001"
      ? "http://127.0.0.1:9545"
      : "http://127.0.0.1:9546"
  : process.env.NEXT_PUBLIC_L2_RPC_URL;

const l2ChainBlockExplorerName = process.env.NEXT_PUBLIC_SUPERSIM
  ? "SuperScan"
  : process.env.NEXT_PUBLIC_L2_BLOCK_EXPLORER_NAME;

const l2ChainBlockExplorerUrl = process.env.NEXT_PUBLIC_SUPERSIM
  ? `http://127.0.0.1:${typeof window === "undefined" ? process.env.PORT : window.location.port}`
  : process.env.NEXT_PUBLIC_L2_BLOCK_EXPLORER_URL;

export const l2Chain = defineChain({
  ...chainConfig,
  id: l2ChainId,
  name: l2ChainName,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [l2ChainRpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: l2ChainBlockExplorerName,
      url: l2ChainBlockExplorerUrl,
    },
  },
});

const transportOptions: HttpTransportConfig = {
  batch: true,
  fetchOptions: { cache: "no-store" },
  retryCount: 10,
};
const l1Transports = [http(l1ChainRpcUrl, transportOptions)];
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

const l2Transports = [http(l2ChainRpcUrl, transportOptions)];
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
