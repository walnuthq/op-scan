"use client";
import Link from "next/link";
import { type Address } from "viem";
import { SquareArrowOutUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatAddress } from "@/lib/utils";
import { l1Chain } from "@/lib/chains";
import useGlobalContext from "@/components/lib/context/hook";

const AddressLink = ({
  address,
  formatted = false,
  external = false,
}: {
  address: Address;
  formatted?: boolean;
  external?: boolean;
}) => {
  const {
    state: { hoveredAddress },
    setHoveredAddress,
  } = useGlobalContext();
  const displayedAddress = formatted ? formatAddress(address) : address;
  return (
    <Tooltip
      delayDuration={100}
      onOpenChange={(open) => setHoveredAddress(open ? address : "")}
    >
      <TooltipTrigger
        className={cn(
          "text-primary truncate rounded-md border border-transparent px-2 py-1 transition-colors hover:border hover:border-dashed hover:border-yellow-500 hover:bg-yellow-500/15 hover:brightness-150",
          {
            "border-dashed border-yellow-500 bg-yellow-500/15":
              hoveredAddress === address,
          },
        )}
      >
        {external ? (
          <a
            href={`${l1Chain.blockExplorers.default.url}/address/${address}`}
            className="flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="truncate">{displayedAddress}</span>
            <SquareArrowOutUpRight className="size-4" />
          </a>
        ) : (
          <Link href={`/address/${address}`}>
            <span className="truncate">{displayedAddress}</span>
          </Link>
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>{address}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AddressLink;
