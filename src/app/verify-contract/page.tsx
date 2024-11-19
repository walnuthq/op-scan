import { isAddress, getAddress } from "viem";
import VerifyContract from "@/components/pages/verify-contract";
import {
  CompilerType,
  compilerTypeKeys,
  compilerVersions,
  CompilerVersion,
} from "@/lib/types";

const VerifyContractPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ address?: string; type?: string; version?: string }>;
}) => {
  const { address, type, version } = await searchParams;
  return (
    <VerifyContract
      address={address && isAddress(address) ? getAddress(address) : undefined}
      type={
        type && compilerTypeKeys.includes(type as CompilerType)
          ? (type as CompilerType)
          : undefined
      }
      version={
        version && compilerVersions.includes(version as CompilerVersion)
          ? (version as CompilerVersion)
          : undefined
      }
    />
  );
};

export const dynamic = "force-dynamic";

export default VerifyContractPage;
