import { type Address } from "viem";
import { type AccountWithTransactionAndToken } from "@/lib/types";
import {
  prisma,
  fromPrismaAccountWithRollupConfig,
  fromPrismaAccountWithTransactionAndToken,
  fromPrismaTransaction,
} from "@/lib/prisma";
import { l2PublicClient, l2Chain } from "@/lib/chains";
import { fetchContract } from "@/lib/fetch-contract";

const fetchAccountFromDatabase = async (
  address: Address,
): Promise<AccountWithTransactionAndToken> => {
  const [prismaAccount, prismaTransaction, prismaAccounts] = await Promise.all([
    prisma.account.findUnique({
      where: { address_chainId: { address, chainId: l2Chain.id } },
      include: {
        transaction: true,
        erc20Token: true,
        erc721Token: true,
        erc1155Token: true,
      },
    }),
    prisma.transaction.findFirst({
      where: { to: address, chainId: l2Chain.id },
      orderBy: [{ blockNumber: "asc" }, { transactionIndex: "asc" }],
    }),
    prisma.account.findMany({
      where: { address, NOT: { chainId: l2Chain.id } },
      include: { rollupConfig: true },
    }),
  ]);
  if (!prismaAccount) {
    return fetchAccountFromJsonRpc(address);
  }
  const account = fromPrismaAccountWithTransactionAndToken(prismaAccount);
  const contract = account.contract
    ? account.contract
    : account.bytecode
      ? await fetchContract(address)
      : null;
  const fundingTransaction =
    account.bytecode === null
      ? prismaTransaction && fromPrismaTransaction(prismaTransaction)
      : null;
  const transaction = account.transaction ?? fundingTransaction;
  return {
    ...account,
    contract,
    transactionHash: transaction ? transaction.hash : null,
    transaction,
    accounts: prismaAccounts.map(fromPrismaAccountWithRollupConfig),
  };
};

const fetchAccountFromJsonRpc = async (
  address: Address,
): Promise<AccountWithTransactionAndToken> => {
  const bytecode = await l2PublicClient.getCode({ address });
  const contract = bytecode ? await fetchContract(address) : null;
  return {
    address,
    bytecode: bytecode ?? null,
    transactionHash: null,
    contract,
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
