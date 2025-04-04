import { getContract } from "viem";
import abi from "@/lib/contracts/optimism-portal2/abi";
import { l1PublicClient } from "@/lib/chains";

const optimismPortal = getContract({
  address: process.env.NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS,
  abi,
  client: l1PublicClient,
});

export default optimismPortal;
