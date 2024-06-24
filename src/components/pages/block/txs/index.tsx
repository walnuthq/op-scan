import { l2PublicClient } from "@/lib/chains";
import Link from "next/link";
import BlockTransactionsTable from "./block-transactions-table";

const BlckTxs = async ({ number }: { number: bigint }) => {
  const block = await l2PublicClient.getBlock({
    blockNumber: number,
    includeTransactions: true,
  });

  const receipts = await Promise.all(
    block.transactions.map(({ hash }) =>
      l2PublicClient.getTransactionReceipt({ hash }),
    ),
  );

  const transactions_arr = await Promise.all(
    receipts.map(
      async ({
        transactionHash,
        blockNumber,
        from,
        to,
        effectiveGasPrice,
        gasUsed,
      }) => {
        return block.transactions.map(({ value, input }) => ({
          hash: transactionHash,
          blockNumber,
          from,
          to,
          value,
          timestamp: block.timestamp,
          effectiveGasUsed: effectiveGasPrice * gasUsed,
          method: input.slice(0, 10),
        }));
      },
    ),
  );

  const transactions = transactions_arr[0];

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
      <BlockTransactionsTable transactions={transactions} />
    </main>
  );
};

export default BlckTxs;
