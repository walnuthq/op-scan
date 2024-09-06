import { Address } from "viem";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import EventsTable from "@/components/pages/address/address-events/events-table";
import { fetchEvents } from "@/components/pages/address/address-events/fetch-events";

const CardHeaderFooterContent = ({ totalCount }: { totalCount: number }) =>
  totalCount === 0 ? (
    <p className="text-sm">No contract events found</p>
  ) : (
    <p className="text-sm">
      Latest {totalCount} contract event{totalCount === 1 ? "" : "s"}
    </p>
  );

const AddressEvents = async ({ address }: { address: Address }) => {
  const events = await fetchEvents(address);
  return (
    <Card>
      <CardHeader>
        <CardHeaderFooterContent totalCount={events.length} />
      </CardHeader>
      <CardContent className="px-0">
        <EventsTable events={events} />
      </CardContent>
      <CardFooter>
        <CardHeaderFooterContent totalCount={events.length} />
      </CardFooter>
    </Card>
  );
};

export default AddressEvents;
