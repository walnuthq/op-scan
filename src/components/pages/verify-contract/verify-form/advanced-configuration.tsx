import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { evmVersions, evmVersionKeys } from "@/lib/types";
import { formSchema } from "@/components/pages/verify-contract/verify-form";

const VerifyContractVerifyFormAdvancedConfiguration = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => (
  <Card>
    <CardContent className="p-4">
      <AccordionItem value="advanced-configuration">
        <AccordionTrigger>Advanced Configuration</AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="grid gap-4 xl:grid-cols-2">
              <FormField
                control={form.control}
                name="optimizerEnabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Optimization</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimizerRuns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Runs (Optimizer)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="evmVersion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVM Version to target</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Please Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {evmVersionKeys.map((evmVersion) => (
                        <SelectItem key={evmVersion} value={evmVersion}>
                          {evmVersions[evmVersion]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </CardContent>
  </Card>
);

export default VerifyContractVerifyFormAdvancedConfiguration;
