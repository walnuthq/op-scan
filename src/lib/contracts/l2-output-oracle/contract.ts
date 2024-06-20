import { getContract } from "viem";
import abi from "@/lib/contracts/l2-output-oracle/abi";
import { l1Chain, l2Chain, l1PublicClient } from "@/lib/chains";

const l2OutputOracle = getContract({
  address: l2Chain.contracts.l2OutputOracle[l1Chain.id].address,
  abi,
  client: l1PublicClient,
});

export default l2OutputOracle;
