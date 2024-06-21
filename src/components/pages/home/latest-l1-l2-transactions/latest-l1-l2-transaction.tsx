import AddressLink from "@/components/pages/home/AddressLink";
import { SquareArrowOutUpRight } from "lucide-react";
import { L1L2Transaction } from "@/lib/types";
import { ReceiptText } from "lucide-react";
import { l1Chain } from "@/lib/chains";

interface LatestL1L2TransactionProps {
  transaction: L1L2Transaction;
}

const LatestL1L2Transaction = ({ transaction }: LatestL1L2TransactionProps) => (
  <div className="flex items-center gap-4 pt-6">
    <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground 2xl:flex">
      <ReceiptText className="h-5 w-5" />
    </div>
    <div className="grid gap-1">
      <div className="flex items-center gap-1 text-sm">
        Block#{" "}
        <span className="flex max-w-60 items-center truncate text-primary md:max-w-96 xl:max-w-60">
          {transaction.l1BlockNumber.toString()}
          <SquareArrowOutUpRight className="ml-1 size-4" />
        </span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <div className="flex items-center gap-1">
          L1 Tx#{" "}
          <AddressLink
            type={"l1-l2"}
            label={"l1"}
            address={transaction.l1Hash}
            href={`${l1Chain.blockExplorers.default.url}/tx/${transaction.l1Hash}`}
          >
            {transaction.l1Hash}
          </AddressLink>
        </div>
        <div className="flex items-center gap-1">
          L2 Tx#{" "}
          <AddressLink
            type={"l1-l2"}
            label={"l2"}
            address={transaction.l2Hash}
            href={`/tx/${transaction.l2Hash}`}
          >
            {transaction.l2Hash}
          </AddressLink>
        </div>
      </div>
    </div>
  </div>
);

export default LatestL1L2Transaction;
