import { getContract, Address } from "viem";
import { l2PublicClient } from "@/lib/chains";
import abi from "@/lib/contracts/erc-1155/abi";

const getERC1155Contract = (address: Address) =>
  getContract({
    address,
    abi,
    client: l2PublicClient,
  });

export default getERC1155Contract;
