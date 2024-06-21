import AddressLink from "@/components/pages/home/AddressLink";
import { formatEther } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import { ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatTimestamp } from "@/lib/utils";

interface LatestTransactionProps {
  transaction: Transaction;
}

const LatestTransaction = ({ transaction }: LatestTransactionProps) => {
  return (
    <div className="flex items-center gap-4 pt-6">
      <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground 2xl:flex">
        <ReceiptText className="h-5 w-5" />
      </div>
      <div className="flex grow flex-col gap-1">
        <div className="flex items-center gap-1 text-sm">
          Tx#{" "}
          <AddressLink
            type={"latest-transactions"}
            label={"tx"}
            address={transaction.hash}
            href={`/tx/${transaction.hash}`}
          >
            {transaction.hash}
          </AddressLink>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <div className="flex items-center gap-1">
            From{" "}
            <AddressLink
              type={"latest-transactions"}
              label={"from"}
              address={transaction.from}
              href={`/address/${transaction.from}`}
            >
              {transaction.from}
            </AddressLink>
          </div>
          <div className="flex items-center gap-1">
            To{" "}
            <AddressLink
              type={"latest-transactions"}
              label={"to"}
              address={transaction.to}
              href={`/address/${transaction.to}`}
            >
              {transaction.to}
            </AddressLink>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="pr-2 text-muted-foreground">
            {formatTimestamp(transaction.timestamp, false)}
          </span>
          <Badge variant="outline">{formatEther(transaction.value)} ETH</Badge>
        </div>
      </div>
    </div>
  );
};

export default LatestTransaction;
