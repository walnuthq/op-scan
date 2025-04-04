import { type AbiFunction, type Address } from "viem";
import { type Dispatch, type SetStateAction } from "react";
import { type Contract } from "@/lib/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InputsForm from "@/components/pages/address/address-contract/inputs-form";
import OutputsResult from "@/components/pages/address/address-contract/outputs-result";

const ReadWriteFunction = ({
  index,
  readWriteFunction,
  address,
  contract,
  result,
  setResults,
}: {
  index: number;
  readWriteFunction: AbiFunction;
  address: Address;
  contract: Contract;
  result?: unknown;
  setResults?: Dispatch<SetStateAction<Record<string, unknown>>>;
}) => (
  <AccordionItem value={readWriteFunction.name}>
    <AccordionTrigger>
      {index + 1}. {readWriteFunction.name}
    </AccordionTrigger>
    <AccordionContent className="space-y-4">
      <InputsForm
        readWriteFunction={readWriteFunction}
        address={address}
        contract={contract}
        setResults={setResults}
      />
      {readWriteFunction.outputs.length > 0 && (
        <OutputsResult outputs={readWriteFunction.outputs} result={result} />
      )}
    </AccordionContent>
  </AccordionItem>
);

export default ReadWriteFunction;
