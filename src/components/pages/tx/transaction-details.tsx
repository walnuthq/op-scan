import Link from "next/link";
import { Clock } from "lucide-react";
import { formatTimestamp, isContract } from "@/lib/utils";
import DescriptionListItem from "@/components/lib/description-list-item";
import EthereumIcon from "@/components/lib/ethereum-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/lib/types";
import { formatGwei, formatEther } from "viem";

const TransactionDetails = async ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  const isFromContract = await isContract(transaction.from);
  const isToContract = await isContract(transaction.to);

  return (
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
          <DescriptionListItem title="From">
            {isFromContract}
            <Link
              className="text-primary hover:brightness-150"
              href={`/address/${transaction.from}`}
            >
              {transaction.from}
            </Link>
          </DescriptionListItem>
          <DescriptionListItem title="Interacted With (To)">
            {isToContract}
            <Link
              className="text-primary hover:brightness-150"
              href={`/address/${transaction.to}`}
            >
              {transaction.to}
            </Link>
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
};

export default TransactionDetails;
