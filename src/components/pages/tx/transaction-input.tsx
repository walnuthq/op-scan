import { TransactionWithReceipt } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionInput = ({
  transaction,
}: {
  transaction: TransactionWithReceipt;
}) => (
  <DescriptionListItem title="Input Data">
    <Textarea placeholder={transaction.input} className="font-mono" disabled />
  </DescriptionListItem>
);

export default TransactionInput;
