import Link from "next/link";
import { TransactionWithReceipt } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionFrom = ({
  transaction,
}: {
  transaction: TransactionWithReceipt;
}) => (
  <DescriptionListItem title="From">
    <Link
      className="text-primary hover:brightness-150"
      href={`/address/${transaction.from}`}
    >
      {transaction.from}
    </Link>
  </DescriptionListItem>
);

export default TransactionFrom;
