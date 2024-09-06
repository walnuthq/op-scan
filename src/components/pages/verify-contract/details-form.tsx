"use client";
import { useRouter } from "next/navigation";
import { Address } from "viem";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { compilerTypes, compilerTypeKeys, compilerVersions } from "@/lib/types";
import { submitContractDetails } from "@/components/pages/verify-contract/actions";

const [firstCompilerTypeKey, ...otherCompilerTypeKeys] = compilerTypeKeys;
const [firstCompilerVersionKey, ...otherCompilerVersionKeys] = compilerVersions;

export const formSchema = z.object({
  address: z.string().startsWith("0x").length(42),
  type: z.enum([firstCompilerTypeKey, ...otherCompilerTypeKeys]),
  version: z.enum([firstCompilerVersionKey, ...otherCompilerVersionKeys]),
});

const VerifyContractDetailsForm = ({ address }: { address?: Address }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: address ?? "",
      type: firstCompilerTypeKey,
      version: firstCompilerVersionKey,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submitContractDetails(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Please enter the Contract Address you would like to verify
              </FormLabel>
              <FormControl>
                <Input placeholder="0x" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please select Compiler Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {compilerTypeKeys.map((compilerType) => (
                    <SelectItem key={compilerType} value={compilerType}>
                      {compilerTypes[compilerType]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please select Compiler Version</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {compilerVersions.map((compilerVersion) => (
                    <SelectItem key={compilerVersion} value={compilerVersion}>
                      {compilerVersion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="submit" variant="destructive">
            Continue
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              form.reset({
                address: "",
                type: firstCompilerTypeKey,
                version: firstCompilerVersionKey,
              })
            }
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VerifyContractDetailsForm;
