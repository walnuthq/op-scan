import { Clock } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import DescriptionListItem from "@/components/lib/description-list-item";

const TimestampListItem = ({ timestamp }: { timestamp: bigint }) => {
  const { distance, utc } = formatTimestamp(timestamp);
  return (
    <DescriptionListItem title="Timestamp">
      <Clock className="mr-1 size-4" />
      {distance} ({utc} +UTC)
    </DescriptionListItem>
  );
};

export default TimestampListItem;
