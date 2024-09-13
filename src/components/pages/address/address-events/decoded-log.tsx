import { concat } from "viem";
import { cn } from "@/lib/utils";
import { Event } from "@/components/pages/address/address-events/fetch-events";
import DecodedLogEvent from "@/components/pages/address/address-events/decoded-log-event";
import DecodedLogData from "@/components/pages/address/address-events/decoded-log-data";

const DecodedLog = ({ event }: { event: Event }) => (
  <div className="flex flex-col gap-3">
    {event.abiEvent && (
      <DecodedLogEvent
        abiEvent={event.abiEvent}
        data={concat([...event.topics.slice(1), event.data])}
      />
    )}
    <div className="flex flex-col gap-1">
      {event.topics.map((topic, index) => (
        <p
          key={index}
          className={cn("font-mono font-semibold", {
            "text-muted-foreground": index === 0,
          })}
        >
          [topic{index}] {topic}
        </p>
      ))}
    </div>
    <div className="flex flex-col gap-1">
      {event.decodedData.map((decodedData, index) => (
        <DecodedLogData key={index} decodedData={decodedData} />
      ))}
    </div>
  </div>
);

export default DecodedLog;
