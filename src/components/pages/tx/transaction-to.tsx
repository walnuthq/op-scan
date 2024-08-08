import { CircleCheck, CircleX } from "lucide-react";
import { TransactionWithReceipt } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";
import AddressLink from "@/components/lib/address-link";
import CopyButton from "@/components/lib/copy-button";

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
      <div className="flex items-center gap-2">
        <AddressLink address={transaction.to} />
        <CopyButton content="Copy To" copy={transaction.to} />
      </div>
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
