import { Hex } from "viem";
import { Account } from "@/lib/types";
import PreCard from "@/components/lib/pre-card";
import DescriptionListItem from "@/components/lib/description-list-item";

const getPlaceholder = (
  signature: string,
  input: string,
  account?: Account,
) => {
  if (input === "0x" || account) {
    return input;
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
    .join("\n") ?? '';
  return result;
};

const TransactionInput = ({
  signature,
  input,
  account,
}: {
  signature: string;
  input: Hex;
  account?: Account;
}) => (
  <DescriptionListItem title="Input Data">
    <PreCard className="max-h-64 overflow-y-auto whitespace-pre-wrap break-words">
      {getPlaceholder(signature, input, account)}
    </PreCard>
  </DescriptionListItem>
);

export default TransactionInput;
