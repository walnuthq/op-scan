import { useState, type Dispatch, type SetStateAction } from "react";
import { type AbiFunction, type Address } from "viem";
import { useWriteContract } from "wagmi";
import { BadgeX } from "lucide-react";
import Form from "@rjsf/core";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import validator from "@rjsf/validator-ajv8";
import { type Contract } from "@/lib/types";
import { l2PublicClient } from "@/lib/chains";
import {
  inputsToSchema,
  inputsToUiSchema,
} from "@/components/pages/address/address-contract/inputs-form/schema";
import widgets from "@/components/pages/address/address-contract/inputs-form/widgets";
import templates from "@/components/pages/address/address-contract/inputs-form/templates";

const InputsForm = ({
  readWriteFunction,
  address,
  contract,
  setResults,
}: {
  readWriteFunction: AbiFunction;
  address: Address;
  contract: Contract;
  setResults?: Dispatch<SetStateAction<Record<string, unknown>>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { writeContract, isPending } = useWriteContract();
  return (
    <div className="space-y-4">
      <Form
        className="space-y-4"
        schema={inputsToSchema(readWriteFunction.inputs)}
        uiSchema={inputsToUiSchema(
          readWriteFunction.inputs,
          setResults === undefined,
        )}
        widgets={widgets}
        templates={templates}
        validator={validator}
        onSubmit={async (data) => {
          const args = {
            address,
            abi: contract.abi,
            functionName: readWriteFunction.name,
            args: Array.from({
              ...data.formData,
              length: readWriteFunction.inputs.length,
            }),
          };
          if (setResults) {
            setLoading(true);
            setError(null);
            try {
              const result = await l2PublicClient.readContract(args);
              setResults((previousResults) => {
                const newResults = structuredClone(previousResults);
                newResults[readWriteFunction.name] = result;
                return newResults;
              });
            } catch (error) {
              if (error instanceof Error) {
                setError(error as Error);
              }
            }
            setLoading(false);
          } else {
            writeContract(args, {
              onError: (error) => setError(error),
              onSuccess: () => setError(null),
            });
          }
        }}
        disabled={setResults ? loading : isPending}
      />
      {error && (
        <Alert>
          <BadgeX className="size-4" />
          <AlertTitle>
            Error while {setResults ? "reading" : "writing"} contract!
          </AlertTitle>
          <AlertDescription>
            <pre className="over overflow-x-auto font-mono text-xs">
              {error.message}
            </pre>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default InputsForm;
