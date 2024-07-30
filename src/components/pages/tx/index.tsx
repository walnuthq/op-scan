import { Hash } from "viem";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { l2PublicClient } from "@/lib/chains";
import { parseTokenTransfers } from "@/lib/utils";
import { fetchTokensPrices } from "@/lib/fetch-data";
import TransactionDetails from "@/components/pages/tx/transaction-details";
import { getSignatureBySelector } from "@/lib/4byte-directory";
import { fromViemTransactionWithReceipt } from "@/lib/types";

const Tx = async ({ hash }: { hash: Hash }) => {
  const [transaction, transactionReceipt] = await Promise.all([
    l2PublicClient.getTransaction({ hash }),
    l2PublicClient.getTransactionReceipt({ hash }),
  ]);
  if (!transaction || !transactionReceipt) {
    notFound();
  }
  const [block, confirmations, tokenTransfers, signature, tokensPrices] =
    await Promise.all([
      l2PublicClient.getBlock({ blockNumber: transaction.blockNumber }),
      l2PublicClient.getTransactionConfirmations({ transactionReceipt }),
      parseTokenTransfers(transactionReceipt.logs),
      getSignatureBySelector(transaction.input.slice(0, 10)),
      fetchTokensPrices(),
    ]);
  const transactionWithReceipt = fromViemTransactionWithReceipt(
    transaction,
    transactionReceipt,
    block.timestamp,
    signature,
  );
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="text-2xl font-bold tracking-tight">Transaction Details</h2>
      <Separator />
      <Card>
        <CardContent className="p-4">
          <TransactionDetails
            transaction={transactionWithReceipt}
            confirmations={confirmations}
            ethPriceToday={tokensPrices.eth.today}
            tokenTransfers={tokenTransfers}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default Tx;
