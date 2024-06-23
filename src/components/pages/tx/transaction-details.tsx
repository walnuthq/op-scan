import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { formatTimestamp, parseTokenTransfers } from "@/lib/utils";
import DescriptionListItem from "@/components/lib/description-list-item";
import EthereumIcon from "@/components/lib/ethereum-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/lib/types";
import { formatGwei, formatEther, GetValue} from "viem";
import { l2PublicClient } from "@/lib/chains";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TransactionDetails = async ({ transaction }: { transaction: Transaction }) => {
  const receipt = await l2PublicClient.getTransactionReceipt({ hash: transaction.hash });
  const tokenTransfers = parseTokenTransfers(receipt.logs);
  return  (
    <Card>
      <CardContent className="p-4">
        <dl>
          <DescriptionListItem title="Transaction Hash">
            {transaction.hash}
          </DescriptionListItem>
          <DescriptionListItem title="Block">
            <Link
              className="text-primary hover:brightness-150"
              href={`/block/${transaction.blockNumber}`}
            >
              {transaction.blockNumber.toString()}
            </Link>
          </DescriptionListItem>
          <DescriptionListItem title="Timestamp">
            <Clock className="mr-1 size-4" />
            {formatTimestamp(transaction.timestamp)}
          </DescriptionListItem>
          <DescriptionListItem border title="Value">
            <EthereumIcon className="mr-1 size-4" />
            {formatEther(transaction.value)} ETH
          </DescriptionListItem>
          <DescriptionListItem title="Gas Price">
            {formatGwei(transaction.gasPrice ?? BigInt(0))} Gwei
            <span className="ml-1 text-muted-foreground">
              ({formatEther(transaction.gasPrice ?? BigInt(0))} ETH)
            </span>
          </DescriptionListItem>
          <DescriptionListItem title="ERC-20 Tokens Transferred">
            {tokenTransfers.length > 0 ? (
              <ul className="list-inside">
                {tokenTransfers.map((transfer, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <ChevronRight className="mr-1 size-4" />
                    <TooltipProvider>
                    <span>
                      <span className="font-semibold">From: </span> 
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <Link href={`/token/${transfer.from}`} className="text-primary hover:underline">{`${transfer.from.slice(0, 10)}...${transfer.from.slice(-9)}`}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          {transfer.from}
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <span>
                      <span className="font-semibold">To: </span> 
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                        <Link href={`/token/${transfer.to}`} className="text-primary hover:underline">{`${transfer.to.slice(0, 10)}...${transfer.to.slice(-9)}`}
                        </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          {transfer.to}
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <span>
                      <span className="font-semibold">For: </span> 
                      {formatEther(transfer.amount)}
                    </span>
                    <span>
                      <span className="font-semibold">Token: </span> 
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <Link href={`/token/${transfer.tokenAddress}`} className="text-primary hover:underline">{`${transfer.tokenAddress.slice(0, 10)}...${transfer.tokenAddress.slice(-9)}`}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          {transfer.tokenAddress}
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    </TooltipProvider>
                  </li>
                ))}
              </ul>
            ) : (
              <span>No ERC-20 token transfers in this transaction</span>
            )}
          </DescriptionListItem>
        </dl>
      </CardContent>
    </Card>
  );
  
}
export default TransactionDetails;
