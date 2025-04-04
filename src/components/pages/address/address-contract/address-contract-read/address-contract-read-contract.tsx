"use client";
import { useState } from "react";
import { difference } from "lodash";
import { type AbiFunction, type Address } from "viem";
import { type Contract } from "@/lib/types";
import { Accordion } from "@/components/ui/accordion";
import ReadWriteFunction from "@/components/pages/address/address-contract/read-write-function";
import { l2PublicClient } from "@/lib/chains";

const AddressContractReadContract = ({
  address,
  contract,
}: {
  address: Address;
  contract: Contract;
}) => {
  const [previousValue, setPreviousValue] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, unknown>>({});
  const functions = contract.abi.filter(
    ({ type }) => type === "function",
  ) as AbiFunction[];
  const readFunctions = functions.filter(({ stateMutability }) =>
    ["view", "pure"].includes(stateMutability),
  );
  return (
    <Accordion
      className="space-y-4"
      type="multiple"
      onValueChange={async (newValue) => {
        const [readFunctionName] = difference(newValue, previousValue);
        const readFunction = readFunctions.find(
          ({ name }) => name === readFunctionName,
        );
        if (readFunction && readFunction.inputs.length === 0) {
          const result = await l2PublicClient.readContract({
            address,
            abi: contract.abi,
            functionName: readFunction.name,
          });
          setResults((previousResults) => {
            const newResults = structuredClone(previousResults);
            newResults[readFunction.name] = result;
            return newResults;
          });
        }
        setPreviousValue(newValue);
      }}
    >
      {readFunctions.map((readFunction, index) => (
        <ReadWriteFunction
          key={readFunction.name}
          index={index}
          readWriteFunction={readFunction}
          address={address}
          contract={contract}
          result={results[readFunction.name]}
          setResults={setResults}
        />
      ))}
    </Accordion>
  );
};

export default AddressContractReadContract;
