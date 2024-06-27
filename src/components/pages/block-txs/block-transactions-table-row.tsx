import Link from "next/link";
import { formatEther, formatGwei } from "viem";
import { TransactionWithReceipt } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import EthereumIcon from "@/components/lib/ethereum-icon";
import { TableRow, TableCell } from "@/components/ui/table";

const BlockTransactionsTableRow = ({
  transaction,
}: {
  transaction: TransactionWithReceipt;
}) => (
  <TableRow>
    <TableCell className="max-w-[10rem] truncate">
      <Link
        href={`/tx/${transaction.hash}`}
        className="text-sm font-medium leading-none text-primary hover:brightness-150"
      >
        {transaction.hash}
      </Link>
    </TableCell>
    <TableCell className="max-w-[8rem] truncate">{"METHOD"}</TableCell>
    <TableCell className="max-w-[10rem] truncate">
      {formatTimestamp(transaction.timestamp, false)}
    </TableCell>
    <TableCell className="max-w-[10rem] truncate">
      <Link
        href={`/address/${transaction.from}`}
        className="text-sm font-medium leading-none text-primary hover:brightness-150"
      >
        {transaction.from}
      </Link>
    </TableCell>
    <TableCell className="max-w-[10rem] truncate">
      <Link
        href={`/address/${transaction.to}`}
        className="text-sm font-medium leading-none text-primary hover:brightness-150"
      >
        {transaction.to}
      </Link>
    </TableCell>
    <TableCell className="max-w-[8rem] truncate">
      <p className="flex items-center">
        <EthereumIcon className="mr-1 size-4" />
        {formatEther(transaction.value)} ETH
      </p>
    </TableCell>
    <TableCell className="max-w-[8rem] truncate">
      {formatGwei(transaction.gasPrice ?? BigInt(0))} Gwei
      <span className="ml-1 text-muted-foreground">
        (
        {formatEther(
          transaction.transactionReceipt.effectiveGasPrice ?? BigInt(0),
        )}{" "}
        ETH)
      </span>
    </TableCell>
  </TableRow>
);

export default BlockTransactionsTableRow;
