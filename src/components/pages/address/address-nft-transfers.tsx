import { Address } from "viem";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { cn, NftPlaceholderImage } from "@/lib/utils";
import CopyButton from "@/components/lib/copy-button";
import { formatDistanceToNow } from "date-fns";

type NFTMetadata = {
  name: string;
  tokenId: string;
  contractAddress: string;
  symbol: string;
  image: string;
};

type NftTransfer = {
  transactionHash: string;
  method: string;
  block: number;
  age: Date;
  from: string;
  to: string;
  type: "ERC721" | "ERC1155";
  metadata: NFTMetadata;
};

type TransferEventsResponse = {
  transfers: NftTransfer[];
  page: number;
  limit: number;
};

const AddressNftTransfers = ({
  address,
  nftTokenTransfers,
}: {
  address: Address;
  nftTokenTransfers: TransferEventsResponse | undefined;
}) => {
  return (
    <Card>
      <CardHeader>Latest 25 NFT Transfers Token Transfers Events</CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction Hash</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Block</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>From</TableHead>
            <TableHead></TableHead>
            <TableHead>To</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Item</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-xs">
          <TooltipProvider>
            {nftTokenTransfers && nftTokenTransfers?.transfers.length !== 0 ? (
              nftTokenTransfers?.transfers?.map((item, i) => {
                const nullTo =
                  item.to === "0x0000000000000000000000000000000000000000";
                const nullFrom =
                  item.from === "0x0000000000000000000000000000000000000000";
                const imageSize =
                  item.metadata.image === NftPlaceholderImage ? 30 : 48;
                const transactionType = address === item.from ? "OUT" : "IN";

                return (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex flex-row">
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger>
                            {item.transactionHash.slice(0, 12)}...
                          </TooltipTrigger>
                          <TooltipContent>
                            {item.transactionHash}
                          </TooltipContent>
                        </Tooltip>
                        <CopyButton
                          content="Copy Transaction Hash"
                          copy={item.transactionHash}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="rounded-md border p-2 text-center">
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger>{item.method}</TooltipTrigger>
                          <TooltipContent>{item.method}</TooltipContent>
                        </Tooltip>
                      </p>
                    </TableCell>
                    <TableCell>{item.block}</TableCell>
                    <TableCell>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                          {formatDistanceToNow(item.age, { addSuffix: true })}
                        </TooltipTrigger>
                        <TooltipContent>
                          {item.age.toLocaleString()}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger>
                              {nullFrom && "Null: "}
                              {item.from.slice(0, nullFrom ? 5 : 11)}...
                              {item.from.slice(nullFrom ? -3 : -9)}
                            </TooltipTrigger>
                            <TooltipContent>{item.from}</TooltipContent>
                          </Tooltip>
                          <CopyButton content="Copy Address" copy={item.from} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p
                        className={cn(
                          "rounded-md border px-2 py-1 text-center font-bold",
                          transactionType === "IN"
                            ? "border-[#cc9a06] bg-[#cc9a0626] text-[#cc9a06]"
                            : "border-[#00a186] bg-[#00a18626] text-[#00a186]",
                        )}
                      >
                        {transactionType}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row">
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger>
                            {nullTo && "Null: "}
                            {item.to.slice(0, nullTo ? 5 : 11)}...
                            {item.to.slice(nullTo ? -3 : -9)}
                          </TooltipTrigger>
                          <TooltipContent>{item.to}</TooltipContent>
                        </Tooltip>
                        <CopyButton content="Copy Address" copy={item.to} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="rounded-full border p-2 text-center">
                        {item.type}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-56 flex-row">
                        <div
                          className={cn(
                            "mr-3 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border",
                            item.metadata.image === NftPlaceholderImage &&
                              "p-2",
                          )}
                        >
                          <Image
                            width={imageSize}
                            height={imageSize}
                            src={item.metadata.image}
                            alt="nft"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 flex-col justify-center gap-1">
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger>
                              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                                {item.metadata.name}#{item.metadata.tokenId}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              {item.metadata.name}#{item.metadata.tokenId}
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger>
                              <p className="text-left font-semibold text-muted-foreground">
                                {item.metadata.symbol !== ""
                                  ? item.metadata.symbol
                                  : item.metadata.name}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent className="self-start">
                              {item.metadata.contractAddress} |{" "}
                              {item.metadata.name}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Table is empty
                </TableCell>
              </TableRow>
            )}
          </TooltipProvider>
        </TableBody>
      </Table>
    </Card>
  );
};

export default AddressNftTransfers;
