"use client";
import Link from "next/link";
import { formatEther, formatGwei, formatGas, formatPrice } from "@/lib/utils";
import { Erc20TransferWithToken } from "@/lib/types";
import DescriptionListItem from "@/components/lib/description-list-item";
import EthereumIcon from "@/components/lib/ethereum-icon";
import { Separator } from "@/components/ui/separator";
import { TransactionWithReceiptAndAccounts } from "@/lib/types";
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
  transaction: {
    hash,
    blockNumber,
    from,
    to,
    value,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    input,
    type,
    typeHex,
    nonce,
    transactionIndex,
    signature,
    timestamp,
    receipt,
    accounts,
  },
  confirmations,
  ethPrice,
  erc20Transfers,
}: {
  transaction: TransactionWithReceiptAndAccounts;
  confirmations: bigint;
  ethPrice: number;
  erc20Transfers: Erc20TransferWithToken[];
}) => {
  const txFee = formatEther(receipt.effectiveGasPrice * receipt.gasUsed, 18);
  const { value: gasUsed, percentageFormatted: gasUsedPercentage } = formatGas(
    receipt.gasUsed,
    gas,
  );
  const account = accounts.length === 1 ? accounts[0] : undefined;
  return (
    <dl>
      <DescriptionListItem title="Transaction Hash">
        <div className="flex items-center gap-2">
          {hash}
          <CopyButton content="Copy Transaction Hash" copy={hash} />
        </div>
      </DescriptionListItem>
      <DescriptionListItem title="Status">
        <TxStatusBadge success={receipt.status === "success"} />
      </DescriptionListItem>
      <DescriptionListItem title="Block">
        <div className="flex items-center gap-4">
          <Link
            className="text-primary hover:brightness-150"
            href={`/block/${blockNumber}`}
          >
            {blockNumber.toString()}
          </Link>
          <span className="text-muted-foreground">|</span>
          <span>{confirmations.toString()} Block confirmations</span>
        </div>
      </DescriptionListItem>
      <TimestampListItem timestamp={timestamp} />
      <Separator />
      <TransactionAction
        from={from}
        to={to}
        input={input}
        signature={signature}
        value={value}
        account={account}
      />
      <Separator />
      <TransactionFrom from={from} />
      <TransactionTo
        to={to}
        input={input}
        receipt={receipt}
        account={account}
      />
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
          {formatEther(value)} ETH
        </div>
      </DescriptionListItem>
      <DescriptionListItem title="Transaction Fee">
        {txFee} ETH
      </DescriptionListItem>
      <DescriptionListItem title="Gas Price">
        <div className="flex items-center gap-1">
          {formatGwei(gasPrice ?? BigInt(0), 9)} Gwei
          <span className="text-muted-foreground">
            ({formatEther(gasPrice ?? BigInt(0), 18)} ETH)
          </span>
        </div>
      </DescriptionListItem>
      <Separator />
      <DescriptionListItem title="ETH Price">
        {formatPrice(ethPrice)} / ETH
      </DescriptionListItem>
      <DescriptionListItem title="Gas Limit & Usage by Txn">
        <div className="flex items-center gap-4">
          {formatGas(gas).value}
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
            {formatGwei(gasPrice ?? BigInt(0), 9)} Gwei
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Max:</span>
            {formatGwei(maxFeePerGas ?? BigInt(0), 9)} Gwei
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Max Priority:</span>
            {formatGwei(maxPriorityFeePerGas ?? BigInt(0), 9)} Gwei
          </div>
        </div>
      </DescriptionListItem>
      <Separator />
      <DescriptionListItem title="L2 Fees Paid">
        {txFee} ETH
      </DescriptionListItem>
      <DescriptionListItem title="L1 Fees Paid">
        {formatEther(receipt.l1Fee ?? BigInt(0), 18)} ETH
      </DescriptionListItem>
      <DescriptionListItem title="L1 Gas Price">
        <div className="flex items-center gap-1">
          {formatEther(receipt.l1GasPrice ?? BigInt(0), 18)} ETH
          <span className="text-muted-foreground ml-1">
            ({formatGwei(receipt.l1GasPrice ?? BigInt(0), 9)} Gwei)
          </span>
        </div>
      </DescriptionListItem>
      <DescriptionListItem title="L1 Gas Used by Txn">
        {formatGas(receipt.l1GasUsed ?? BigInt(0)).value}
      </DescriptionListItem>
      <DescriptionListItem title="L1 Fee Scalar">
        {receipt.l1FeeScalar ?? 0}
      </DescriptionListItem>
      <Separator />
      <TransactionOtherAttributes
        type={type}
        typeHex={typeHex}
        nonce={nonce}
        transactionIndex={transactionIndex}
      />
      <TransactionInput signature={signature} input={input} account={account} />
    </dl>
  );
};

export default TransactionDetails;
