import Link from "next/link";

import { DecodedLogDisplay } from "./decodedLog-display";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { FormattedLog } from "@/interfaces";
import { formatTimestamp } from "@/lib/utils";
import TxMethodBadge from "@/components/lib/tx-method-badge";

interface Props {
  decodedLogs: FormattedLog[];
}

export const ContractEventsTable = ({ decodedLogs }: Props) => {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-4 md:p-4">
      {decodedLogs.length !== 0 ? (
        <Table className="table-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Hash</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Decoded logs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {decodedLogs.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="relative max-w-40 truncate align-top text-primary hover:brightness-150">
                  <Link
                    href={`/tx/${item.transactionHash}`}
                    className="text-sm font-medium leading-none"
                  >
                    {item.transactionHash}
                  </Link>
                </TableCell>
                <TableCell className="max-w-28 truncate align-top text-primary hover:brightness-150">
                  <Link
                    href={`/block/${item.blockNumber}`}
                    className="text-sm font-medium leading-none"
                  >
                    {item.blockNumber.toString()}
                  </Link>
                </TableCell>
                <TableCell className="align-top">
                  <div>{`${formatTimestamp(item.timestamp).distance}`}</div>
                </TableCell>
                <TableCell className="align-top">
                  <TxMethodBadge
                    selector={item.method}
                    signature={item.eventName}
                  />
                </TableCell>
                <TableCell className="align-top">
                  <DecodedLogDisplay args={item.args} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <span className="text-xl font-semibold">
          Oops! No events found. Please reload the page
        </span>
      )}
    </section>
  );
};
