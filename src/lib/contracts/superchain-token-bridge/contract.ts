import { getContract } from "viem";
import abi from "@/lib/contracts/superchain-token-bridge/abi";
import { l2PublicClient } from "@/lib/chains";

const superchainTokenBridge = getContract({
  address: "0x4200000000000000000000000000000000000028",
  abi,
  client: l2PublicClient,
});

export default superchainTokenBridge;
