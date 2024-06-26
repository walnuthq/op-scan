
import { getContract, Address } from 'viem'
import { l2PublicClient } from '@/lib/chains'
import abi from "@/lib/contracts/erc-20/abi";

export const getERC20Contract = (address: Address) => {
  return getContract({
    address,
    abi,
    client: l2PublicClient,
  })
}