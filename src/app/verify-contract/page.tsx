import { isAddress, getAddress } from "viem";
import VerifyContract from "@/components/pages/verify-contract";
import {
  type CompilerType,
  compilerTypeKeys,
  solidityCompilerVersionKeys,
  type SolidityCompilerVersion,
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
        version &&
        solidityCompilerVersionKeys.includes(version as SolidityCompilerVersion)
          ? (version as SolidityCompilerVersion)
          : undefined
      }
    />
  );
};

export const dynamic = "force-dynamic";

export default VerifyContractPage;
