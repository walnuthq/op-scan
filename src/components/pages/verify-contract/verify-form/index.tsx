"use client";
import { useState } from "react";
import { type Address } from "viem";
import { z } from "zod";
import { BadgeX } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Accordion } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  type CompilerType,
  evmVersionKeys,
  type SolidityCompilerVersion,
} from "@/lib/types";
import { verifyContract } from "@/components/pages/verify-contract/actions";
import VerifyContractVerifyFormSingleFile from "@/components/pages/verify-contract/verify-form/single-file";
import VerifyContractVerifyFormStandardJsonInput from "@/components/pages/verify-contract/verify-form/standard-json-input";
import VerifyContractVerifyFormAdvancedConfiguration from "@/components/pages/verify-contract/verify-form/advanced-configuration";

const [firstEvmVersionKey, ...otherEvmVersionKeys] = evmVersionKeys;

const advancedConfigurationSchema = {
  optimizerEnabled: z.enum(["yes", "no"]),
  optimizerRuns: z.coerce.number().int().nonnegative(),
  evmVersion: z.enum([firstEvmVersionKey!, ...otherEvmVersionKeys]),
};

export const formSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("solidity-single-file"),
    singleFile: z.string().min(1),
    ...advancedConfigurationSchema,
  }),
  z.object({
    type: z.literal("solidity-multiple-files"),
    ...advancedConfigurationSchema,
  }),
  z.object({
    type: z.literal("solidity-standard-json-input"),
    standardJsonInput: z
      .any()
      .refine(
        (files) => files?.length === 1,
        "Standard Json Input is required.",
      ),
  }),
]);

const readFile = (file: File) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => resolve(reader.result as string),
      false,
    );
    reader.readAsText(file);
  });

const VerifyContractVerifyForm = ({
  address,
  type,
  version,
}: {
  address: Address;
  type: CompilerType;
  version: SolidityCompilerVersion;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const defaultValues = {
    type,
    singleFile: "",
    optimizerEnabled: "yes",
    optimizerRuns: 200,
    evmVersion: "default",
  } as const;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const fileRef = form.register("standardJsonInput");
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    try {
      await verifyContract({
        address,
        type,
        version,
        singleFile:
          values.type === "solidity-single-file"
            ? values.singleFile
            : defaultValues.singleFile,
        standardJsonInput:
          values.type === "solidity-standard-json-input"
            ? await readFile(values.standardJsonInput[0])
            : "",
        optimizerEnabled:
          values.type === "solidity-single-file"
            ? values.optimizerEnabled
            : defaultValues.optimizerEnabled,
        optimizerRuns:
          values.type === "solidity-single-file"
            ? values.optimizerRuns
            : defaultValues.optimizerRuns,
        evmVersion:
          values.type === "solidity-single-file"
            ? values.evmVersion
            : defaultValues.evmVersion,
      });
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        setError(error);
      }
    }
    setLoading(false);
  };
  return (
    <Accordion
      className="w-full lg:w-2/3"
      type="multiple"
      defaultValue={["source-code", "advanced-configuration"]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {type === "solidity-single-file" && (
            <VerifyContractVerifyFormSingleFile form={form} />
          )}
          {type === "solidity-standard-json-input" && (
            <VerifyContractVerifyFormStandardJsonInput
              form={form}
              fileRef={fileRef}
            />
          )}
          {type !== "solidity-standard-json-input" && (
            <VerifyContractVerifyFormAdvancedConfiguration form={form} />
          )}
          {error && (
            <Alert>
              <BadgeX className="size-4" />
              <AlertTitle>Error while verifying contract!</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-center">
            <Button type="submit" disabled={loading}>
              {loading && <ReloadIcon className="mr-2 size-4 animate-spin" />}
              {loading ? "Loading…" : "Verify & Publish"}
            </Button>
          </div>
        </form>
      </Form>
    </Accordion>
  );
};

export default VerifyContractVerifyForm;
