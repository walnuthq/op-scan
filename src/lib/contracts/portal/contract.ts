import { getContract } from "viem";
import abi from "@/lib/contracts/portal/abi";
import { l1PublicClient } from "@/lib/chains";

const portal = getContract({
  address: process.env.NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS,
  abi,
  client: l1PublicClient,
});

export default portal;
