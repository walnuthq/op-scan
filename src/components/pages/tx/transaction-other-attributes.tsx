import { TransactionType } from "viem";
import { TransactionWithReceipt } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionOtherAttributes = ({
  transaction,
}: {
  transaction: TransactionWithReceipt;
}) => {
  const types: Record<TransactionType, string> = {
    legacy: "0 (Legacy)",
    eip1559: "2 (EIP-1559)",
    eip2930: "1 (EIP-2930)",
    eip4844: "3 (EIP-4844)",
  } as const;
  return (
    <DescriptionListItem title="Other Attributes">
      <Badge variant="outline">
        <span className="mr-1 text-muted-foreground">Txn Type:</span>
        {types[transaction.type]}
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
};

export default TransactionOtherAttributes;
