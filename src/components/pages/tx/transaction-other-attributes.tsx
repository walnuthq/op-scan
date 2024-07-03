import { TransactionWithReceipt } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionOtherAttributes = ({
  transaction,
}: {
  transaction: TransactionWithReceipt;
}) => {
  return (
    <DescriptionListItem title="Other Attributes">
      <Badge variant="outline">
        <span className="mr-1 text-muted-foreground">Txn Type:</span> 2
        (EIP-1559)
      </Badge>
      <Badge variant="outline">
        <span className="mr-1 text-muted-foreground">Nonce:</span>{" "}
        {transaction.nonce}
      </Badge>
      <Badge variant="outline">
        <span className="mr-1 text-muted-foreground">Position In Block:</span>{" "}
        {transaction.transactionIndex}
      </Badge>
    </DescriptionListItem>
  );
};

export default TransactionOtherAttributes;
