import { Clock } from "lucide-react";
import { TransactionWithReceipt } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionTimestamp = ({
  transaction,
}: {
  transaction: TransactionWithReceipt;
}) => {
  const { distance, utcWithTz } = formatTimestamp(transaction.timestamp);
  return (
    <DescriptionListItem title="Timestamp">
      <Clock className="mr-1 size-4" />
      {distance} ({utcWithTz})
    </DescriptionListItem>
  );
};

export default TransactionTimestamp;
