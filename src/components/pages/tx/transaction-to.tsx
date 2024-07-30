import Link from "next/link";
import { CircleCheck, CircleX } from "lucide-react";
import { TransactionWithReceipt } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionTo = ({
  transaction,
}: {
  transaction: TransactionWithReceipt;
}) => {
  if (!transaction.to) {
    return null;
  }
  return (
    <DescriptionListItem
      title={transaction.input === "0x" ? "To" : "Interacted With (To)"}
    >
      <Link
        className="text-primary hover:brightness-150"
        href={`/address/${transaction.to}`}
      >
        {transaction.to}
      </Link>
      {transaction.input !== "0x" && (
        <>
          {transaction.receipt.status === "success" ? (
            <CircleCheck className="ml-4 size-4 text-green-400" />
          ) : (
            <CircleX className="ml-4 size-4 text-red-400" />
          )}
        </>
      )}
    </DescriptionListItem>
  );
};

export default TransactionTo;
