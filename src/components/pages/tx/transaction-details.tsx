import Link from "next/link";
import { Clock } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import DescriptionListItem from "@/components/lib/description-list-item";
import EthereumIcon from "@/components/lib/ethereum-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/lib/types";
import { formatGwei, formatEther } from "viem";

const TransactionDetails = ({ transaction }: { transaction: Transaction }) => (
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
      </dl>
    </CardContent>
  </Card>
);

export default TransactionDetails;
