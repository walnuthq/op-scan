"use client";
import Link from "next/link";
import { formatEther, formatGwei, formatGas, formatPrice } from "@/lib/utils";
import { Erc20TransferWithToken } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";
import EthereumIcon from "@/components/lib/ethereum-icon";
import { Separator } from "@/components/ui/separator";
import { TransactionWithReceipt } from "@/lib/types";
import TxStatusBadge from "@/components/lib/tx-status-badge";
import TimestampListItem from "@/components/lib/timestamp-list-item";
import TransactionAction from "@/components/pages/tx/transaction-action";
import TransactionFrom from "@/components/pages/tx/transaction-from";
import TransactionTo from "@/components/pages/tx/transaction-to";
import TransactionErc20Transfers from "@/components/pages/tx/transaction-erc20-transfers";
import TransactionOtherAttributes from "@/components/pages/tx/transaction-other-attributes";
import TransactionInput from "@/components/pages/tx/transaction-input";
import CopyButton from "@/components/lib/copy-button";

const TransactionDetails = ({
  transaction,
  confirmations,
  ethPrice,
  erc20Transfers,
}: {
  transaction: TransactionWithReceipt;
  confirmations: bigint;
  ethPrice: number;
  erc20Transfers: Erc20TransferWithToken[];
}) => {
  const txFee = formatEther(
    transaction.receipt.effectiveGasPrice * transaction.receipt.gasUsed,
    18,
  );
  const { value: gasUsed, percentageFormatted: gasUsedPercentage } = formatGas(
    transaction.receipt.gasUsed,
    transaction.gas,
  );
  return (
    <dl>
      <DescriptionListItem title="Transaction Hash">
        <div className="flex items-center gap-2">
          {transaction.hash}
          <CopyButton content="Copy Transaction Hash" copy={transaction.hash} />
        </div>
      </DescriptionListItem>
      <DescriptionListItem title="Status">
        <TxStatusBadge success={transaction.receipt.status === "success"} />
      </DescriptionListItem>
      <DescriptionListItem title="Block">
        <div className="flex items-center gap-4">
          <Link
            className="text-primary hover:brightness-150"
            href={`/block/${transaction.blockNumber}`}
          >
            {transaction.blockNumber.toString()}
          </Link>
          <span className="text-muted-foreground">|</span>
          <span>{confirmations.toString()} Block confirmations</span>
        </div>
      </DescriptionListItem>
      <TimestampListItem timestamp={transaction.timestamp} />
      <Separator />
      <TransactionAction transaction={transaction} />
      <Separator />
      <TransactionFrom from={transaction.from} />
      <TransactionTo transaction={transaction} />
      {erc20Transfers.length > 0 && (
        <>
          <Separator />
          <TransactionErc20Transfers erc20Transfers={erc20Transfers} />
        </>
      )}
      <Separator />
      <DescriptionListItem title="Value">
        <div className="flex items-center gap-1">
          <EthereumIcon className="size-4" />
          {formatEther(transaction.value)} ETH
        </div>
      </DescriptionListItem>
      <DescriptionListItem title="Transaction Fee">
        {txFee} ETH
      </DescriptionListItem>
      <DescriptionListItem title="Gas Price">
        <div className="flex items-center gap-1">
          {formatGwei(transaction.gasPrice ?? BigInt(0), 9)} Gwei
          <span className="text-muted-foreground">
            ({formatEther(transaction.gasPrice ?? BigInt(0), 18)} ETH)
          </span>
        </div>
      </DescriptionListItem>
      <Separator />
      <DescriptionListItem title="ETH Price">
        {formatPrice(ethPrice)} / ETH
      </DescriptionListItem>
      <DescriptionListItem title="Gas Limit & Usage by Txn">
        <div className="flex items-center gap-4">
          {formatGas(transaction.gas).value}
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1">
            {gasUsed}
            <span className="text-muted-foreground">({gasUsedPercentage})</span>
          </div>
        </div>
      </DescriptionListItem>
      <DescriptionListItem title="Gas Fees">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Base:</span>
            {formatGwei(transaction.gasPrice ?? BigInt(0), 9)} Gwei
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Max:</span>
            {formatGwei(transaction.maxFeePerGas ?? BigInt(0), 9)} Gwei
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Max Priority:</span>
            {formatGwei(transaction.maxPriorityFeePerGas ?? BigInt(0), 9)} Gwei
          </div>
        </div>
      </DescriptionListItem>
      <Separator />
      <DescriptionListItem title="L2 Fees Paid">
        <div className="flex items-center gap-1">
          {formatEther(
            transaction.receipt.effectiveGasPrice * transaction.receipt.gasUsed,
            18,
          )}
          ETH
        </div>
      </DescriptionListItem>
      <DescriptionListItem title="L1 Fees Paid">
        {formatEther(transaction.receipt.l1Fee ?? BigInt(0), 18)} ETH
      </DescriptionListItem>
      <DescriptionListItem title="L1 Gas Price">
        <div className="flex items-center gap-1">
          {formatEther(transaction.receipt.l1GasPrice ?? BigInt(0), 18)} ETH
          <span className="ml-1 text-muted-foreground">
            ({formatGwei(transaction.receipt.l1GasPrice ?? BigInt(0), 9)} Gwei)
          </span>
        </div>
      </DescriptionListItem>
      <DescriptionListItem title="L1 Gas Used by Txn">
        {formatGas(transaction.receipt.l1GasUsed ?? BigInt(0)).value}
      </DescriptionListItem>
      <DescriptionListItem title="L1 Fee Scalar">
        {transaction.receipt.l1FeeScalar ?? 0}
      </DescriptionListItem>
      <Separator />
      <TransactionOtherAttributes transaction={transaction} />
      <TransactionInput
        signature={transaction.signature}
        input={transaction.input}
      />
    </dl>
  );
};

export default TransactionDetails;
