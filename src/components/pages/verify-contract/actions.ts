"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { formSchema } from "@/components/pages/verify-contract/details-form";

export const submitContractDetails = async ({
  address,
  type,
  version,
}: z.infer<typeof formSchema>) => {
  redirect(
    `/verify-contract?address=${address}&type=${type}&version=${encodeURIComponent(version)}`,
  );
};
