import Link from "next/link";
import { Address } from "viem";
import DescriptionListItem from "@/components/lib/description-list-item";
import CopyButton from "@/components/lib/copy-button";

const TransactionFrom = ({ from }: { from: Address }) => (
  <DescriptionListItem title="From">
    <Link
      className="text-primary hover:brightness-150"
      href={`/address/${from}`}
    >
      {from}
    </Link>
    <CopyButton content="Copy Address to clipboard" copy={from} />
  </DescriptionListItem>
);

export default TransactionFrom;
