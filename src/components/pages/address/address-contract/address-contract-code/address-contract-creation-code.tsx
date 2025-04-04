import { type Hex } from "viem";
import { SquareCode } from "lucide-react";
import PreCard from "@/components/lib/pre-card";
import CopyButton from "@/components/lib/copy-button";

const AddressContractCreationCode = ({
  creationCode,
}: {
  creationCode: Hex;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-sm">
        <SquareCode className="size-4" />
        <span className="font-semibold">Contract Creation Code</span>
      </div>
      <CopyButton content="Copy Creation Code" copy={creationCode} />
    </div>
    <PreCard className="max-h-64 overflow-y-auto break-words whitespace-pre-wrap">
      {creationCode}
    </PreCard>
  </div>
);

export default AddressContractCreationCode;
