import { getContract, Address, erc20Abi } from "viem";
import { l2PublicClient } from "@/lib/chains";

const getErc20Contract = (address: Address) =>
  getContract({
    address,
    abi: erc20Abi,
    client: l2PublicClient,
  });

export default getErc20Contract;
