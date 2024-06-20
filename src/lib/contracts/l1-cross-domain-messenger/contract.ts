import { getContract } from "viem";
import abi from "@/lib/contracts/l1-cross-domain-messenger/abi";
import { l1PublicClient } from "@/lib/chains";

const l1CrossDomainMessenger = getContract({
  address: "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1",
  abi,
  client: l1PublicClient,
});

export default l1CrossDomainMessenger;
