import Link from "next/link";
import { type Address } from "viem";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const VerifyContractWizard = ({
  step,
  address,
}: {
  step: 1 | 2;
  address?: Address;
}) => (
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
      <Badge
        className="size-4 rounded-full p-4"
        variant={step === 1 ? "default" : "secondary"}
      >
        1
      </Badge>
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
    <Separator className="data-[orientation=horizontal]:w-8" />
    <div className="flex items-center gap-2">
      <Badge
        className="size-4 rounded-full p-4"
        variant={step === 1 ? "secondary" : "default"}
      >
        2
      </Badge>
      <span className={cn("text-sm", { "font-semibold": step === 2 })}>
        Verify & Publish
      </span>
    </div>
  </div>
);

export default VerifyContractWizard;
