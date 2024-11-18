"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Event } from "@/components/pages/address/address-events/fetch-events";
import EventsTableRow from "@/components/pages/address/address-events/events-table-row";
import useGlobalContext from "@/components/lib/context/hook";

const EventsTable = ({ events }: { events: Event[] }) => {
  const {
    state: { timestampFormattedAsDate },
    toggleTimestampFormattedAsDate,
  } = useGlobalContext();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction Hash</TableHead>
          <TableHead>Block</TableHead>
          <TableHead>
            <a
              className="cursor-pointer text-primary hover:brightness-150"
              role="button"
              onClick={toggleTimestampFormattedAsDate}
            >
              {timestampFormattedAsDate ? "Date Time (UTC)" : "Age"}
            </a>
          </TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Logs</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No data available in table
            </TableCell>
          </TableRow>
        ) : (
          events.map((event) => (
            <EventsTableRow
              key={`${event.blockNumber}-${event.transactionHash}-${event.logIndex}`}
              event={event}
              timestampFormattedAsDate={timestampFormattedAsDate}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default EventsTable;
