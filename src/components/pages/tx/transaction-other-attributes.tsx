import { formatTransactionType } from "@/lib/utils";
import { TransactionWithReceipt } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionOtherAttributes = ({
  transaction,
}: {
  transaction: TransactionWithReceipt;
}) => (
  <DescriptionListItem title="Other Attributes">
    <Badge variant="outline">
      <span className="mr-1 text-muted-foreground">Txn Type:</span>
      {formatTransactionType(transaction.type, transaction.typeHex)}
    </Badge>
    <Badge variant="outline">
      <span className="mr-1 text-muted-foreground">Nonce:</span>
      {transaction.nonce}
    </Badge>
    <Badge variant="outline">
      <span className="mr-1 text-muted-foreground">Position In Block:</span>
      {transaction.transactionIndex}
    </Badge>
  </DescriptionListItem>
);

export default TransactionOtherAttributes;
