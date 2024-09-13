import { isAddress, getAddress } from "viem";
import VerifyContract from "@/components/pages/verify-contract";
import {
  CompilerType,
  compilerTypeKeys,
  compilerVersions,
  CompilerVersion,
} from "@/lib/types";

const VerifyContractPage = ({
  searchParams: { address, type, version },
}: {
  searchParams: { address?: string; type?: string; version?: string };
}) => (
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

export default VerifyContractPage;
