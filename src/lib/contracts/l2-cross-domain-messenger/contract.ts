import { getContract } from "viem";
import abi from "@/lib/contracts/l2-cross-domain-messenger/abi";
import { l2PublicClient } from "@/lib/chains";

const l2CrossDomainMessenger = getContract({
  address: "0x4200000000000000000000000000000000000007",
  abi,
  client: l2PublicClient,
});

export default l2CrossDomainMessenger;
