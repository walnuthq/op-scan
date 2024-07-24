import { Hex } from "viem";
import { Textarea } from "@/components/ui/textarea";
import DescriptionListItem from "@/components/lib/description-list-item";

const getPlaceholder = (signature: string, input: string) => {
  if (input === "0x") {
    return "0x";
  }
  let result = "";
  if (signature) {
    result += `Function: ${signature} ***\n\n`;
  }
  result += `MethodID: ${input.slice(0, 10)}\n`;
  result += input
    .slice(10)
    .match(/.{1,64}/g)
    ?.map((cd, index) => `[${index}]: ${cd}`)
    .join("\n");
  return result;
};

const TransactionInput = ({
  signature,
  input,
}: {
  signature: string;
  input: Hex;
}) => {
  const placeholder = getPlaceholder(signature, input);
  return (
    <DescriptionListItem title="Input Data">
      <Textarea
        placeholder={placeholder}
        className="font-mono"
        disabled
        rows={Math.min(placeholder.split("\n").length, 8)}
      />
    </DescriptionListItem>
  );
};

export default TransactionInput;
