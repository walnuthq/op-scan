import { Hash } from "viem";
import { l2PublicClient } from "@/lib/chains";
import {
  ERC20Transfer,
  fromViemTransactionWithReceipt,
  TransactionWithReceipt,
  fromPrismaTransactionWithReceipt,
  fromPrismaERC20Transfer,
} from "@/lib/types";
import { getSignatureBySelector } from "@/lib/4byte-directory";
import { prisma } from "@/lib/prisma";
import { parseERC20Transfers } from "@/lib/utils";

type FetchTransactionDetailsReturnType = {
  transaction: TransactionWithReceipt | null;
  confirmations: bigint;
  erc20Transfers: ERC20Transfer[];
};

const fetchTransactionDetailsFromDatabase = async (
  hash: Hash,
): Promise<FetchTransactionDetailsReturnType> => {
  const [transaction, confirmations] = await Promise.all([
    prisma.transaction.findUnique({
      where: { hash },
      include: { receipt: { include: { erc20Transfers: true } } },
    }),
    l2PublicClient.getTransactionConfirmations({ hash }),
  ]);
  if (!transaction || !transaction.receipt) {
    return fetchTransactionDetailsFromJsonRpc(hash);
  }
  return {
    transaction: fromPrismaTransactionWithReceipt(
      transaction,
      transaction.receipt,
    ),
    confirmations,
    erc20Transfers: transaction.receipt.erc20Transfers.map(
      fromPrismaERC20Transfer,
    ),
  };
};

const fetchTransactionDetailsFromJsonRpc = async (
  hash: Hash,
): Promise<FetchTransactionDetailsReturnType> => {
  const [transaction, transactionReceipt] = await Promise.all([
    l2PublicClient.getTransaction({ hash }),
    l2PublicClient.getTransactionReceipt({ hash }),
  ]);
  if (!transaction || !transactionReceipt) {
    return {
      transaction: null,
      confirmations: BigInt(0),
      erc20Transfers: [],
    };
  }
  const [block, confirmations, erc20Transfers, signature] = await Promise.all([
    l2PublicClient.getBlock({ blockNumber: transaction.blockNumber }),
    l2PublicClient.getTransactionConfirmations({ transactionReceipt }),
    parseERC20Transfers(transactionReceipt.logs),
    getSignatureBySelector(transaction.input.slice(0, 10)),
  ]);
  return {
    transaction: fromViemTransactionWithReceipt(
      transaction,
      transactionReceipt,
      block.timestamp,
      signature,
    ),
    confirmations,
    erc20Transfers,
  };
};

const fetchTransactionDetails = process.env.DATABASE_URL
  ? fetchTransactionDetailsFromDatabase
  : fetchTransactionDetailsFromJsonRpc;

export default fetchTransactionDetails;
