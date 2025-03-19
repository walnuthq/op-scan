import Link from "next/link";
import DecodedLog from "@/components/pages/address/address-events/decoded-log";
import { formatTimestamp } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { type Event } from "@/components/pages/address/address-events/fetch-events";
import TxMethodBadge from "@/components/lib/tx-method-badge";
import CopyButton from "@/components/lib/copy-button";

const EventsTableRow = ({
  event,
  timestampFormattedAsDate,
}: {
  event: Event;
  timestampFormattedAsDate: boolean;
}) => {
  const { distance, utc } = formatTimestamp(event.timestamp);
  return (
    <TableRow>
      <TableCell className="max-w-40 align-top">
        <div className="flex items-center gap-2">
          <Link
            href={`/tx/${event.transactionHash}`}
            className="text-primary truncate hover:brightness-150"
          >
            {event.transactionHash}
          </Link>
          <CopyButton
            content="Copy Transaction Hash"
            copy={event.transactionHash}
          />
        </div>
      </TableCell>
      <TableCell className="align-top">
        <Link
          href={`/block/${event.blockNumber}`}
          className="text-primary hover:brightness-150"
        >
          {event.blockNumber.toString()}
        </Link>
      </TableCell>
      <TableCell className="align-top" suppressHydrationWarning>
        {timestampFormattedAsDate ? utc : distance}
      </TableCell>
      <TableCell className="align-top">
        <TxMethodBadge selector={event.selector} signature={event.signature} />
      </TableCell>
      <TableCell>
        <DecodedLog event={event} />
      </TableCell>
    </TableRow>
  );
};

export default EventsTableRow;
