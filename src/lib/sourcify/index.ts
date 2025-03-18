import { SourcifyChain } from "@ethereum-sourcify/lib-sourcify";
import { l2Chain } from "@/lib/chains";
import solc from "@/lib/sourcify/solidity-compiler";
import vyper from "@/lib/sourcify/vyper-compiler";

const rpc = [process.env.NEXT_PUBLIC_L2_RPC_URL];
if (process.env.NEXT_PUBLIC_L2_FALLBACK1_RPC_URL) {
  rpc.push(process.env.NEXT_PUBLIC_L2_FALLBACK1_RPC_URL);
}
if (process.env.NEXT_PUBLIC_L2_FALLBACK2_RPC_URL) {
  rpc.push(process.env.NEXT_PUBLIC_L2_FALLBACK2_RPC_URL);
}
if (process.env.NEXT_PUBLIC_L2_FALLBACK3_RPC_URL) {
  rpc.push(process.env.NEXT_PUBLIC_L2_FALLBACK3_RPC_URL);
}
if (process.env.NEXT_PUBLIC_L2_FALLBACK4_RPC_URL) {
  rpc.push(process.env.NEXT_PUBLIC_L2_FALLBACK4_RPC_URL);
}
if (process.env.NEXT_PUBLIC_L2_FALLBACK5_RPC_URL) {
  rpc.push(process.env.NEXT_PUBLIC_L2_FALLBACK5_RPC_URL);
}

export const sourcifyChain = new SourcifyChain({
  chainId: l2Chain.id,
  name: l2Chain.name,
  rpc,
  supported: true,
});

export { solc, vyper };
