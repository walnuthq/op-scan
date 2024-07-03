import Link from "next/link";
import { Address } from "viem";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionFrom = ({ from }: { from: Address }) => (
  <DescriptionListItem title="From">
    <Link
      className="text-primary hover:brightness-150"
      href={`/address/${from}`}
    >
      {from}
    </Link>
  </DescriptionListItem>
);

export default TransactionFrom;
