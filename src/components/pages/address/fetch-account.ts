import { Address } from "viem";
import { AccountWithTransactionAndToken } from "@/lib/types";
import {
  prisma,
  fromPrismaAccountWithTransactionAndToken,
  fromPrismaTransaction,
} from "@/lib/prisma";
import { l2PublicClient } from "@/lib/chains";

const fetchAccountFromDatabase = async (
  address: Address,
): Promise<AccountWithTransactionAndToken> => {
  const [prismaAccount, prismaTransaction] = await Promise.all([
    prisma.account.findUnique({
      where: { address },
      include: {
        transaction: true,
        erc20Token: true,
        erc721Token: true,
        erc1155Token: true,
      },
    }),
    prisma.transaction.findFirst({
      where: { to: address },
      orderBy: [{ blockNumber: "asc" }, { transactionIndex: "asc" }],
    }),
  ]);
  if (!prismaAccount) {
    return fetchAccountFromJsonRpc(address);
  }
  const account = fromPrismaAccountWithTransactionAndToken(prismaAccount);
  const fundingTransaction =
    prismaTransaction && fromPrismaTransaction(prismaTransaction);
  const transaction = account.transaction ?? fundingTransaction;
  return {
    ...account,
    transactionHash: transaction ? transaction.hash : null,
    transaction,
  };
};

const fetchAccountFromJsonRpc = async (
  address: Address,
): Promise<AccountWithTransactionAndToken> => {
  const bytecode = await l2PublicClient.getCode({ address });
  return {
    address,
    bytecode: bytecode ?? null,
    transactionHash: null,
    contract: null,
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
