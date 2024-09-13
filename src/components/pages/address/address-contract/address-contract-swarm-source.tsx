import { Hex } from "viem";
import { FileBox } from "lucide-react";
import { decode } from "@ethereum-sourcify/bytecode-utils";
import PreCard from "@/components/lib/pre-card";

const getSwarmSource = (bytecode: Hex) => {
  const { ipfs, bzzr0, bzzr1 } = decode(bytecode);
  if (ipfs) {
    return `ipfs://${ipfs}`;
  }
  return null;
};

const AddressContractSwarmSource = ({ bytecode }: { bytecode: Hex }) => {
  const swarmSource = getSwarmSource(bytecode);
  if (!swarmSource) {
    return null;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 text-sm">
        <FileBox className="size-4" />
        <span className="font-semibold">Swarm Source</span>
      </div>
      <PreCard>{swarmSource}</PreCard>
    </div>
  );
};

export default AddressContractSwarmSource;
