import { Address, Hex, formatEther } from "viem";
import { ChevronRight } from "lucide-react";
import { Account } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";
import TxMethodBadge from "@/components/lib/tx-method-badge";
import AddressLink from "@/components/lib/address-link";

const TransactionAction = ({
  from,
  to,
  input,
  signature,
  value,
  account,
}: {
  from: Address;
  to: Address | null;
  input: Hex;
  signature: string;
  value: bigint;
  account?: Account;
}) => {
  const actualTo = to ?? (account ? account.address : null);
  if (!actualTo) {
    return null;
  }
  return (
    <DescriptionListItem title="Transaction Action">
      <div className="flex items-center gap-2">
        <ChevronRight className="size-4" />
        {input === "0x" ? (
          <>
            <span className="text-muted-foreground">Native Transfer</span>
            <span>{formatEther(value)} ETH</span>
            <span className="text-muted-foreground">To</span>
            <AddressLink address={actualTo} formatted />
          </>
        ) : account ? (
          <>
            <span className="text-muted-foreground">Deployed</span>
            <AddressLink address={actualTo} formatted />
          </>
        ) : (
          <>
            Call
            <TxMethodBadge
              selector={input.slice(0, 10)}
              signature={signature}
            />
            Method by
            <AddressLink address={from} formatted />
            on
            <AddressLink address={actualTo} formatted />
          </>
        )}
      </div>
    </DescriptionListItem>
  );
};
export default TransactionAction;
