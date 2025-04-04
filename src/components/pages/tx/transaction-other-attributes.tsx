import { type TransactionType, type Hex } from "viem";
import { formatTransactionType } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionOtherAttributes = ({
  type,
  typeHex,
  nonce,
  transactionIndex,
}: {
  type: TransactionType;
  typeHex: Hex;
  nonce: number;
  transactionIndex: number;
}) => (
  <DescriptionListItem title="Other Attributes">
    <div className="flex gap-2">
      <Badge variant="outline">
        <span className="text-muted-foreground mr-1">Txn Type:</span>
        {formatTransactionType(type, typeHex)}
      </Badge>
      <Badge variant="outline">
        <span className="text-muted-foreground mr-1">Nonce:</span>
        {nonce}
      </Badge>
      <Badge variant="outline">
        <span className="text-muted-foreground mr-1">Position In Block:</span>
        {transactionIndex}
      </Badge>
    </div>
  </DescriptionListItem>
);

export default TransactionOtherAttributes;
