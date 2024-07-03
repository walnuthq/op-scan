import { getContract } from "viem";
import abi from "@/lib/contracts/l1-cross-domain-messenger/abi";
import { l1PublicClient } from "@/lib/chains";

const l1CrossDomainMessenger = getContract({
  address: process.env.NEXT_PUBLIC_L1_CROSS_DOMAIN_MESSENGER_ADDRESS,
  abi,
  client: l1PublicClient,
});

export default l1CrossDomainMessenger;
