import { getContract } from "viem";
import abi from "@/lib/contracts/l1-standard-bridge/abi";
import { l1Chain, l2Chain, l1PublicClient } from "@/lib/chains";

const l1StandardBridge = getContract({
  address: l2Chain.contracts.l1StandardBridge[l1Chain.id].address,
  abi,
  client: l1PublicClient,
});

export default l1StandardBridge;
