"use server";
import { type Address, type Hash } from "viem";
import { prisma } from "@/lib/prisma";
import { l2Chain } from "@/lib/chains";

export const searchBlock = async (number: bigint) => {
  const block = await prisma.block.findUnique({
    where: { number_chainId: { number, chainId: l2Chain.id } },
  });
  return block !== null;
};

export const searchAddress = async (address: Address) => {
  const account = await prisma.account.findUnique({
    where: { address_chainId: { address, chainId: l2Chain.id } },
  });
  return account !== null;
};

export const searchTransaction = async (hash: Hash) => {
  const transaction = await prisma.transaction.findUnique({
    where: { hash_chainId: { hash, chainId: l2Chain.id } },
  });
  return transaction !== null;
};
