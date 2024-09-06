import Link from "next/link";
import { Address } from "viem";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const VerifyContractWizard = ({
  step,
  address,
}: {
  step: 1 | 2;
  address?: Address;
}) => (
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-full bg-destructive">
        <span className="text-sm font-semibold">1</span>
      </div>
      <Link
        className={cn("text-sm", {
          "pointer-events-none font-semibold": step === 1,
          "hover:text-primary": step === 2,
        })}
        href={
          address ? `/verify-contract?address=${address}` : "/verify-contract"
        }
        aria-disabled={step === 1}
      >
        Enter Contract Details
      </Link>
    </div>
    <Separator className="w-8" />
    <div className="flex items-center gap-2">
      <div
        className={cn("flex size-8 items-center justify-center rounded-full", {
          "bg-muted": step === 1,
          "bg-destructive": step === 2,
        })}
      >
        <span className="text-sm font-semibold">2</span>
      </div>
      <span className={cn("text-sm", { "font-semibold": step === 2 })}>
        Verify & Publish
      </span>
    </div>
  </div>
);
export default VerifyContractWizard;
