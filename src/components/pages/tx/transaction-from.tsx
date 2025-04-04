import { type Address } from "viem";
import DescriptionListItem from "@/components/lib/description-list-item";
import AddressLink from "@/components/lib/address-link";
import CopyButton from "@/components/lib/copy-button";

const TransactionFrom = ({ from }: { from: Address }) => (
  <DescriptionListItem title="From">
    <div className="flex items-center gap-2">
      <AddressLink address={from} />
      <CopyButton content="Copy From" copy={from} />
    </div>
  </DescriptionListItem>
);

export default TransactionFrom;
