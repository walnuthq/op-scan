import { getContract } from "viem";
import abi from "@/lib/contracts/l1-standard-bridge/abi";
import { l1PublicClient } from "@/lib/chains";

const l1StandardBridge = getContract({
  address: process.env.NEXT_PUBLIC_L1_STANDARD_BRIDGE_ADDRESS,
  abi,
  client: l1PublicClient,
});

export default l1StandardBridge;
