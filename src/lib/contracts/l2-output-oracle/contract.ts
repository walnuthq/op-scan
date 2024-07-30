import { getContract } from "viem";
import abi from "@/lib/contracts/l2-output-oracle/abi";
import { l1PublicClient } from "@/lib/chains";

const l2OutputOracle = getContract({
  address: process.env.NEXT_PUBLIC_L2_OUTPUT_ORACLE_ADDRESS,
  abi,
  client: l1PublicClient,
});

export default l2OutputOracle;
