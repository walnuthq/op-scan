import { type Hex } from "viem";
import { FileBox } from "lucide-react";
import { decode, AuxdataStyle } from "@ethereum-sourcify/bytecode-utils";
import PreCard from "@/components/lib/pre-card";
import { type Contract } from "@/lib/types";

const getSwarmSource = (bytecode: Hex, language: string) => {
  if (language === "solidity") {
    const { ipfs } = decode(bytecode, AuxdataStyle.SOLIDITY);
    if (ipfs) {
      return `ipfs://${ipfs}`;
    }
  }
  return null;
};

const AddressContractSwarmSource = ({
  bytecode,
  contract,
}: {
  bytecode: Hex;
  contract: Contract;
}) => {
  const swarmSource = getSwarmSource(bytecode, contract.info.language);
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
