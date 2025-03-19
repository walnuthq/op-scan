"use client";
import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type NFTMetadata } from "@/lib/types";

const NftLink = ({
  metadata: { address, name, symbol, imageUrl, tokenId },
}: {
  metadata: NFTMetadata;
}) => (
  <Tooltip delayDuration={100}>
    <TooltipTrigger>
      <Link href={`/address/${address}`}>
        <div className="flex items-center gap-2">
          {imageUrl ? (
            <Image
              alt={`${name}#${tokenId}`}
              src={imageUrl}
              width={40}
              height={40}
              className="size-10 rounded-sm"
            />
          ) : (
            <ImageOff className="size-10" />
          )}
          <div className="flex flex-col items-start gap-1">
            <p className="max-w-40 truncate text-sm font-semibold">
              {name}#{tokenId.toString()}
            </p>
            <p className="text-muted-foreground max-w-40 truncate text-xs">
              {name} ({symbol})
            </p>
          </div>
        </div>
      </Link>
    </TooltipTrigger>
    <TooltipContent>
      <p>
        {address} | {name} ({symbol})
      </p>
    </TooltipContent>
  </Tooltip>
);

export default NftLink;
