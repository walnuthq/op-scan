import { FileCode } from "lucide-react";
import { ContractInfo, ContractSources } from "@/lib/types";
import ContractSourcesList from "@/components/pages/address/address-contract/address-contract-code/address-contract-sources/contract-sources-list";

const AddressContractSources = ({
  info,
  sources,
}: {
  info: ContractInfo;
  sources: ContractSources;
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-1 text-sm">
      <FileCode className="size-4" />
      <span className="font-semibold">Contract Source Code</span>
      <span className="text-muted-foreground">({info.language})</span>
    </div>
    <ContractSourcesList sources={sources} />
  </div>
);

export default AddressContractSources;
