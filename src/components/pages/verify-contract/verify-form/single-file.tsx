import { type z } from "zod";
import { type UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type formSchema } from "@/components/pages/verify-contract/verify-form";

const VerifyContractVerifyFormSingleFile = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => (
  <Card>
    <CardContent className="p-4">
      <AccordionItem value="source-code">
        <AccordionTrigger>Upload Contract Source Code</AccordionTrigger>
        <AccordionContent>
          <FormField
            control={form.control}
            name="singleFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter the Solidity Contract Code below</FormLabel>
                <FormControl>
                  <div className="px-1">
                    <Textarea rows={8} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
    </CardContent>
  </Card>
);

export default VerifyContractVerifyFormSingleFile;
