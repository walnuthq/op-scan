import { Address } from "viem";
import { AccountWithTransactionAndToken } from "@/lib/types";
import { prisma, fromPrismaAccountWithTransactionAndToken } from "@/lib/prisma";
import { l2PublicClient } from "@/lib/chains";

const fetchAccountFromDatabase = async (
  address: Address,
): Promise<AccountWithTransactionAndToken> => {
  const account = await prisma.account.findUnique({
    where: { address },
    include: {
      transaction: true,
      erc20Token: true,
      erc721Token: true,
      erc1155Token: true,
    },
  });
  return account
    ? fromPrismaAccountWithTransactionAndToken(account)
    : fetchAccountFromJsonRpc(address);
};

const fetchAccountFromJsonRpc = async (
  address: Address,
): Promise<AccountWithTransactionAndToken> => {
  const bytecode = await l2PublicClient.getCode({ address });
  return {
    address,
    bytecode: bytecode ?? null,
    transactionHash: null,
    transaction: null,
    erc20Token: null,
    erc721Token: null,
    erc1155Token: null,
  };
};

const fetchAccount = process.env.DATABASE_URL
  ? fetchAccountFromDatabase
  : fetchAccountFromJsonRpc;

export default fetchAccount;
