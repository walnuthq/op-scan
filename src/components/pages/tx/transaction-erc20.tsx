import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TokenTransfer } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionERC20 = ({
  tokenTransfers,
}: {
  tokenTransfers: TokenTransfer[];
}) => (
  <DescriptionListItem title="ERC-20 Tokens Transferred">
    <ul className="max-h-64 list-inside overflow-y-auto pr-2">
      {tokenTransfers.map((transfer, index) => (
        <li key={index} className="flex items-center gap-1">
          <ChevronRight className="mr-1 size-4" />
          <TooltipProvider>
            <span>
              <span className="font-semibold">From: </span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Link
                    href={`/token/${transfer.from}`}
                    className="text-primary hover:underline"
                  >
                    {`${transfer.from.slice(0, 10)}...${transfer.from.slice(-9)}`}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{transfer.from}</TooltipContent>
              </Tooltip>
            </span>
            <span>
              <span className="font-semibold">To: </span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Link
                    href={`/token/${transfer.to}`}
                    className="text-primary hover:underline"
                  >
                    {`${transfer.to.slice(0, 10)}...${transfer.to.slice(-9)}`}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{transfer.to}</TooltipContent>
              </Tooltip>
            </span>
            <span>
              <span className="font-semibold">For: </span>
              {transfer.amount}
            </span>
            <span>
              <span className="font-semibold">Token: </span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Link
                    href={`/token/${transfer.tokenAddress}`}
                    className="text-primary hover:underline"
                  >
                    {`${transfer.tokenAddress.slice(0, 10)}...${transfer.tokenAddress.slice(-9)}`}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{transfer.tokenAddress}</TooltipContent>
              </Tooltip>
            </span>
          </TooltipProvider>
        </li>
      ))}
    </ul>
  </DescriptionListItem>
);

export default TransactionERC20;
