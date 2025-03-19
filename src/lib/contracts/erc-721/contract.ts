import { getContract, type Address, erc721Abi } from "viem";
import { l2PublicClient } from "@/lib/chains";

const getErc721Contract = (address: Address) =>
  getContract({
    address,
    abi: erc721Abi,
    client: l2PublicClient,
  });

export default getErc721Contract;
