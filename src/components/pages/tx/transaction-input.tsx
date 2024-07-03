import { Hex } from "viem";
import { Textarea } from "@/components/ui/textarea";
import DescriptionListItem from "@/components/lib/description-list-item";

const TransactionInput = ({ input }: { input: Hex }) => (
  <DescriptionListItem title="Input Data">
    <Textarea placeholder={input} className="font-mono" disabled />
  </DescriptionListItem>
);

export default TransactionInput;
