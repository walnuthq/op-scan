import { Hash } from "viem";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { l2PublicClient } from "@/lib/chains";
import { parseTokenTransfers } from "@/lib/utils";
import { fetchTokensPrices } from "@/lib/fetch-data";
import TransactionDetails from "@/components/pages/tx/transaction-details";
import { getSignatureBySelector } from "@/lib/4byte-directory";

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
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="text-2xl font-bold tracking-tight">Transaction Details</h2>
      <Separator />
      <Card>
        <CardContent className="p-4">
          <TransactionDetails
            transaction={{
              blockNumber: transaction.blockNumber,
              hash: transaction.hash,
              from: transaction.from,
              to: transaction.to,
              value: transaction.value,
              gas: transaction.gas,
              gasPrice: transaction.gasPrice ?? null,
              maxFeePerGas: transaction.maxFeePerGas ?? null,
              maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ?? null,
              transactionIndex: transaction.transactionIndex,
              type: transaction.type,
              nonce: transaction.nonce,
              input: transaction.input,
              signature,
              timestamp: block.timestamp,
              transactionReceipt: {
                transactionHash: transactionReceipt.transactionHash,
                status: transactionReceipt.status,
                from: transactionReceipt.from,
                to: transactionReceipt.to,
                effectiveGasPrice: transactionReceipt.effectiveGasPrice,
                gasUsed: transactionReceipt.gasUsed,
                l1Fee: transactionReceipt.l1Fee,
                l1GasPrice: transactionReceipt.l1GasPrice,
                l1GasUsed: transactionReceipt.l1GasUsed,
                l1FeeScalar: transactionReceipt.l1FeeScalar,
              },
            }}
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
