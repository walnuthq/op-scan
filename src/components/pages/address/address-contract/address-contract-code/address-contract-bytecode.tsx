import { type Hex } from "viem";
import { SquareCode } from "lucide-react";
import PreCard from "@/components/lib/pre-card";
import CopyButton from "@/components/lib/copy-button";

const AddressContractBytecode = ({ bytecode }: { bytecode: Hex }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-sm">
        <SquareCode className="size-4" />
        <span className="font-semibold">Deployed Bytecode</span>
      </div>
      <CopyButton content="Copy Bytecode" copy={bytecode} />
    </div>
    <PreCard className="max-h-64 overflow-y-auto break-words whitespace-pre-wrap">
      {bytecode}
    </PreCard>
  </div>
);

export default AddressContractBytecode;
