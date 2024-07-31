"use client";
import Link from "next/link";
import { formatEther, formatGwei, formatGas, formatPrice } from "@/lib/utils";
import { ERC20Transfer } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";
import EthereumIcon from "@/components/lib/ethereum-icon";
import { Separator } from "@/components/ui/separator";
import { TransactionWithReceipt } from "@/lib/types";
import TxStatusBadge from "@/components/lib/tx-status-badge";
import TimestampListItem from "@/components/lib/timestamp-list-item";
import TransactionAction from "@/components/pages/tx/transaction-action";
import TransactionFrom from "@/components/pages/tx/transaction-from";
import TransactionTo from "@/components/pages/tx/transaction-to";
import TransactionERC20Transfers from "@/components/pages/tx/transaction-erc20-transfers";
import TransactionOtherAttributes from "@/components/pages/tx/transaction-other-attributes";
import TransactionInput from "@/components/pages/tx/transaction-input";

const TransactionDetails = ({
  transaction,
  confirmations,
  ethPriceToday,
  erc20Transfers,
}: {
  transaction: TransactionWithReceipt;
  confirmations: bigint;
  ethPriceToday: number;
  erc20Transfers: ERC20Transfer[];
}) => (
  <dl>
    <DescriptionListItem title="Transaction Hash">
      {transaction.hash}
    </DescriptionListItem>
    <DescriptionListItem title="Status">
      <TxStatusBadge success={transaction.receipt.status === "success"} />
    </DescriptionListItem>
    <DescriptionListItem title="Block">
      <Link
        className="text-primary hover:brightness-150"
        href={`/block/${transaction.blockNumber}`}
      >
        {transaction.blockNumber.toString()}
      </Link>
      <span className="mx-4 text-muted-foreground">|</span>
      <span>{confirmations.toString()} Block confirmations</span>
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
        <TransactionERC20Transfers erc20Transfers={erc20Transfers} />
      </>
    )}
    <Separator />
    <DescriptionListItem title="Value">
      <EthereumIcon className="mr-1 size-4" />
      {formatEther(transaction.value)} ETH
    </DescriptionListItem>
    <DescriptionListItem title="Transaction Fee">
      {formatEther(
        transaction.receipt.effectiveGasPrice * transaction.receipt.gasUsed,
        18,
      )}{" "}
      ETH
    </DescriptionListItem>
    <DescriptionListItem title="Gas Price">
      {formatGwei(transaction.gasPrice ?? BigInt(0), 9)} Gwei
      <span className="ml-1 text-muted-foreground">
        ({formatEther(transaction.gasPrice ?? BigInt(0), 18)} ETH)
      </span>
    </DescriptionListItem>
    <Separator />
    <DescriptionListItem title="ETH Price">
      {formatPrice(ethPriceToday)} / ETH
    </DescriptionListItem>
    <DescriptionListItem title="Gas Limit & Usage by Txn">
      {formatGas(transaction.gas).value}
      <span className="mx-4 text-muted-foreground">|</span>
      {formatGas(transaction.receipt.gasUsed).value} (
      {
        formatGas(transaction.receipt.gasUsed, transaction.gas)
          .percentageFormatted
      }
      )
    </DescriptionListItem>
    <DescriptionListItem title="Gas Fees">
      <span className="mr-1 text-muted-foreground">Base:</span>
      {formatGwei(transaction.gasPrice ?? BigInt(0), 9)} Gwei
      <span className="mx-4 text-muted-foreground">|</span>
      <span className="mr-1 text-muted-foreground">Max:</span>
      {formatGwei(transaction.maxFeePerGas ?? BigInt(0), 9)} Gwei
      <span className="mx-4 text-muted-foreground">|</span>
      <span className="mr-1 text-muted-foreground">Max Priority:</span>
      {formatGwei(transaction.maxPriorityFeePerGas ?? BigInt(0), 9)} Gwei
    </DescriptionListItem>
    <Separator />
    <DescriptionListItem title="L2 Fees Paid">
      {formatEther(
        transaction.receipt.effectiveGasPrice * transaction.receipt.gasUsed,
        18,
      )}{" "}
      ETH
    </DescriptionListItem>
    <DescriptionListItem title="L1 Fees Paid">
      {formatEther(transaction.receipt.l1Fee ?? BigInt(0), 18)} ETH
    </DescriptionListItem>
    <DescriptionListItem title="L1 Gas Price">
      {formatEther(transaction.receipt.l1GasPrice ?? BigInt(0), 18)} ETH{" "}
      <span className="ml-1 text-muted-foreground">
        ({formatGwei(transaction.receipt.l1GasPrice ?? BigInt(0), 9)} Gwei)
      </span>
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

export default TransactionDetails;
