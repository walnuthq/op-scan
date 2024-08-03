import { CircleCheck, CircleX } from "lucide-react";
import { TransactionWithReceipt } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";
import AddressLink from "@/components/lib/address-link";

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
      <AddressLink
        href={`/address/${transaction.to}`}
        address={transaction.to}
      />
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
