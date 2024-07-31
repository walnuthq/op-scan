import Link from "next/link";
import { formatUnits } from "viem";
import { ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
          <ChevronRight className="mr-1 size-4" />
          <TooltipProvider>
            <span>
              <span className="font-semibold">From: </span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Link
                    href={`/address/${erc20Transfer.from}`}
                    className="text-primary hover:underline"
                  >
                    {`${erc20Transfer.from.slice(0, 10)}...${erc20Transfer.from.slice(-9)}`}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{erc20Transfer.from}</TooltipContent>
              </Tooltip>
            </span>
            <span>
              <span className="font-semibold">To: </span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Link
                    href={`/address/${erc20Transfer.to}`}
                    className="text-primary hover:underline"
                  >
                    {`${erc20Transfer.to.slice(0, 10)}...${erc20Transfer.to.slice(-9)}`}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{erc20Transfer.to}</TooltipContent>
              </Tooltip>
            </span>
            <span>
              <span className="font-semibold">For: </span>
              {formatUnits(erc20Transfer.amount, erc20Transfer.decimals)}
            </span>
            <span>
              <span className="font-semibold">Token: </span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Link
                    href={`/address/${erc20Transfer.address}`}
                    className="text-primary hover:underline"
                  >
                    {`${erc20Transfer.address.slice(0, 10)}...${erc20Transfer.address.slice(-9)}`}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{erc20Transfer.address}</TooltipContent>
              </Tooltip>
            </span>
          </TooltipProvider>
        </li>
      ))}
    </ul>
  </DescriptionListItem>
);

export default TransactionERC20Transfers;
