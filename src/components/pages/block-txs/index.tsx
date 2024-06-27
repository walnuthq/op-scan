import Link from "next/link";
import { notFound } from "next/navigation";
import { l2PublicClient } from "@/lib/chains";
import BlockTransactionsTable from "@/components/pages/block-txs/block-transactions-table";

const BlockTxs = async ({ number }: { number: bigint }) => {
  const block = await l2PublicClient.getBlock({
    blockNumber: number,
    includeTransactions: true,
  });
  if (!block) {
    notFound();
  }
  const transactionReceipts = await Promise.all(
    block.transactions.map(({ hash }) =>
      l2PublicClient.getTransactionReceipt({ hash }),
    ),
  );
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Transactions
      </h2>
      <p>
        For block{" "}
        <Link
          href={`/block/${number}`}
          className="text-sm font-medium leading-none text-primary hover:brightness-150"
        >
          {number.toString()}
        </Link>
      </p>
      <BlockTransactionsTable
        transactions={block.transactions.map(
          ({ hash, blockNumber, from, to, value }, i) => ({
            hash,
            blockNumber,
            from,
            to,
            value,
            timestamp: block.timestamp,
            transactionReceipt: {
              transactionHash: transactionReceipts[i].transactionHash,
              from: transactionReceipts[i].from,
              to: transactionReceipts[i].to,
              effectiveGasPrice: transactionReceipts[i].effectiveGasPrice,
            },
          }),
        )}
      />
    </main>
  );
};

export default BlockTxs;
