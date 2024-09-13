import { getContract, Address } from "viem";
import { l2PublicClient } from "@/lib/chains";
import abi from "@/lib/contracts/erc-721/abi";

const getErc721Contract = (address: Address) =>
  getContract({
    address,
    abi,
    client: l2PublicClient,
  });

export default getErc721Contract;
