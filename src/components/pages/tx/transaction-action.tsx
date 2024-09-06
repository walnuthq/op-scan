import { formatEther } from "viem";
import { ChevronRight } from "lucide-react";
import { TransactionWithReceipt } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";
import TxMethodBadge from "@/components/lib/tx-method-badge";
import AddressLink from "@/components/lib/address-link";

const TransactionAction = ({
  transaction,
}: {
  transaction: TransactionWithReceipt;
}) => {
  if (!transaction.to) {
    return null;
  }
  const selector = transaction.input.slice(0, 10);
  return (
    <DescriptionListItem title="Transaction Action">
      <div className="flex items-center gap-2">
        {selector === "0x" ? (
          <>
            <ChevronRight className="size-4" />
            <span className="text-muted-foreground">Native Transfer</span>
            <span>{formatEther(transaction.value)} ETH</span>
            <span className="text-muted-foreground">To</span>
            <AddressLink address={transaction.to} formatted />
          </>
        ) : (
          <>
            <ChevronRight className="size-4" />
            Call
            <TxMethodBadge
              selector={selector}
              signature={transaction.signature}
            />
            Method by
            <AddressLink address={transaction.from} formatted />
            on
            <AddressLink address={transaction.to} formatted />
          </>
        )}
      </div>
    </DescriptionListItem>
  );
};

export default TransactionAction;
