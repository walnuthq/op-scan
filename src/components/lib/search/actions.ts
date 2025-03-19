"use server";
import { type Address, type Hash } from "viem";
import { prisma } from "@/lib/prisma";

export const searchBlock = async (number: bigint) => {
  const block = await prisma.block.findUnique({ where: { number } });
  return block !== null;
};

export const searchAddress = async (address: Address) => {
  const account = await prisma.account.findUnique({ where: { address } });
  return account !== null;
};

export const searchTransaction = async (hash: Hash) => {
  const transaction = await prisma.transaction.findUnique({ where: { hash } });
  return transaction !== null;
};
