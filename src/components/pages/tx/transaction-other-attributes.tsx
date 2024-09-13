import { TransactionType, Hex } from "viem";
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
    <Badge variant="outline">
      <span className="mr-1 text-muted-foreground">Txn Type:</span>
      {formatTransactionType(type, typeHex)}
    </Badge>
    <Badge variant="outline">
      <span className="mr-1 text-muted-foreground">Nonce:</span>
      {nonce}
    </Badge>
    <Badge variant="outline">
      <span className="mr-1 text-muted-foreground">Position In Block:</span>
      {transactionIndex}
    </Badge>
  </DescriptionListItem>
);

export default TransactionOtherAttributes;
