import { formatUnits } from "viem";
import { ChevronRight } from "lucide-react";
import AddressLink from "@/components/lib/address-link";
import { ERC20Transfer } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionERC20Transfers = ({
  erc20Transfers,
}: {
  erc20Transfers: ERC20Transfer[];
}) => (
  <DescriptionListItem title="ERC-20 Tokens Transferred">
    <ul className="max-h-64 list-inside overflow-y-auto pr-2">
      {erc20Transfers.map((erc20Transfer, index) => (
        <li key={index} className="flex items-center gap-1">
          <ChevronRight className="size-4" />
          <span className="font-semibold">From</span>
          <AddressLink address={erc20Transfer.from} formatted />
          <span className="font-semibold">To</span>
          <AddressLink address={erc20Transfer.to} formatted />
          <span className="font-semibold">For</span>
          {formatUnits(erc20Transfer.value, erc20Transfer.decimals)}
          <span className="font-semibold">Token</span>
          <AddressLink address={erc20Transfer.address} formatted />
        </li>
      ))}
    </ul>
  </DescriptionListItem>
);

export default TransactionERC20Transfers;
