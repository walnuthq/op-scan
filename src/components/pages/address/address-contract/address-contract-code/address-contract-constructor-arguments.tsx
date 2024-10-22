import { decodeAbiParameters, Hex, Abi } from "viem";
import { Network } from "lucide-react";
import { Contract } from "@/lib/types";
import { getContractMetadata, findAbiConstructor } from "@/lib/utils";
import PreCard from "@/components/lib/pre-card";
import DecodedParameterValue from "@/components/lib/decoded-parameter-value";

const decodeDeployData = ({
  abi,
  bytecode,
  data,
}: {
  abi: Abi;
  bytecode: Hex;
  data: Hex;
}) => {
  const metadata = getContractMetadata(bytecode);
  const last2Bytes = bytecode.slice(-4);
  const [, args] = data.split(`${metadata}${last2Bytes}`);
  const abiConstructor = findAbiConstructor(abi);
  if (!args || !abiConstructor) {
    return { args: [], bytecode };
  }
  return {
    args: decodeAbiParameters(abiConstructor.inputs, `0x${args}`),
    bytecode,
  };
};

const AddressContractConstructorArguments = ({
  bytecode,
  creationCode,
  contract,
}: {
  bytecode: Hex;
  creationCode: Hex;
  contract: Contract;
}) => {
  const abiConstructor = findAbiConstructor(contract.abi);
  if (!abiConstructor) {
    return null;
  }
  const { args } = decodeDeployData({
    abi: contract.abi,
    bytecode,
    data: creationCode,
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 text-sm">
        <Network className="size-4" />
        <span className="font-semibold">Constructor Arguments</span>
        <span className="text-muted-foreground">
          (ABI-Encoded and is the last bytes of the Contract Creation Code
          above)
        </span>
      </div>
      <PreCard className="overflow-x-auto">
        <p>-----Decoded View---------------</p>
        {args.map((arg, index) => {
          const input = abiConstructor.inputs[index];
          if (!input) {
            return null;
          }
          const { name, type } = input;
          return (
            <p key={index}>
              Arg [{index}] : {name} ({type}):{" "}
              <DecodedParameterValue value={arg} />
            </p>
          );
        })}
      </PreCard>
    </div>
  );
};

export default AddressContractConstructorArguments;
