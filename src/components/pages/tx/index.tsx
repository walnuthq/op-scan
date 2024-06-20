import { Hash } from "viem";
import { l2PublicClient } from "@/lib/chains";
import TransactionDetails from "@/components/pages/tx/transaction-details";

const Tx = async ({ hash }: { hash: Hash }) => {
  const transaction = await l2PublicClient.getTransaction({ hash });
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Transaction Details
      </h2>
      <TransactionDetails
        transaction={{
          blockNumber: transaction.blockNumber,
          hash: transaction.hash,
          from: transaction.from,
          to: transaction.to,
          value: transaction.value,
          gasPrice: transaction.gasPrice,
          timestamp: BigInt(0),
        }}
      />
    </main>
  );
};

export default Tx;
