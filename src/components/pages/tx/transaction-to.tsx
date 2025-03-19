import { type Address, type Hex } from "viem";
import { CircleCheck, CircleX } from "lucide-react";
import { type TransactionReceipt, type Account } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";
import AddressLink from "@/components/lib/address-link";
import CopyButton from "@/components/lib/copy-button";

const TransactionTo = ({
  to,
  input,
  receipt,
  account,
}: {
  to: Address | null;
  input: Hex;
  receipt: TransactionReceipt;
  account?: Account;
}) => {
  const actualTo = to ?? (account ? account.address : null);
  if (!actualTo) {
    return null;
  }
  return (
    <DescriptionListItem
      title={input === "0x" || account ? "To" : "Interacted With (To)"}
    >
      <div className="flex items-center gap-2">
        <AddressLink address={actualTo} />
        <CopyButton content="Copy To" copy={actualTo} />
        {account && "Deployed"}
        {receipt.status === "success" ? (
          <CircleCheck className="size-4 text-green-400" />
        ) : (
          <CircleX className="size-4 text-red-400" />
        )}
      </div>
    </DescriptionListItem>
  );
};

export default TransactionTo;
