import Link from "next/link";
import { formatEther } from "viem";
import { ChevronRight } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { TransactionWithReceipt } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";
import TxMethodBadge from "@/components/lib/tx-method-badge";

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
      <ChevronRight className="mr-1 size-4" />
      {selector === "0x" ? (
        <>
          <span className="mr-2 text-muted-foreground">Native Transfer</span>
          <span>{formatEther(transaction.value)} ETH</span>
          <span className="mx-2 text-muted-foreground">To</span>
          <Link
            className="text-primary hover:brightness-150"
            href={`/address/${transaction.to}`}
          >
            {formatAddress(transaction.to)}
          </Link>
        </>
      ) : (
        <>
          <span className="mr-2">Call</span>
          <TxMethodBadge
            selector={selector}
            signature={transaction.signature}
          />
          <span className="mx-2">Method by</span>
          <Link
            className="text-primary hover:brightness-150"
            href={`/address/${transaction.from}`}
          >
            {formatAddress(transaction.from)}
          </Link>
          <span className="mx-2">on</span>
          <Link
            className="text-primary hover:brightness-150"
            href={`/address/${transaction.to}`}
          >
            {formatAddress(transaction.to)}
          </Link>
        </>
      )}
    </DescriptionListItem>
  );
};

export default TransactionAction;
