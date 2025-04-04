import { type Address } from "viem";
import { Separator } from "@/components/ui/separator";
import VerifyContractInfo from "@/components/pages/verify-contract/info";
import VerifyContractWizard from "@/components/pages/verify-contract/wizard";
import VerifyContractDetailsForm from "@/components/pages/verify-contract/details-form";
import VerifyContractVerifyForm from "@/components/pages/verify-contract/verify-form";
import { type CompilerType, type SolidityCompilerVersion } from "@/lib/types";

const VerifyContract = async ({
  address,
  type,
  version,
}: {
  address?: Address;
  type?: CompilerType;
  version?: SolidityCompilerVersion;
}) => {
  const step = type && version ? 2 : 1;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="text-center text-2xl font-bold tracking-tight">
        Verify & Publish Contract Source Code
      </h2>
      <Separator />
      <div className="my-8 flex flex-col items-center gap-8">
        <VerifyContractInfo step={step} type={type} />
        <VerifyContractWizard step={step} address={address} />
        {step === 1 ? (
          <VerifyContractDetailsForm address={address} />
        ) : (
          address &&
          type &&
          version && (
            <VerifyContractVerifyForm
              address={address}
              type={type}
              version={version}
            />
          )
        )}
      </div>
    </main>
  );
};

export default VerifyContract;
