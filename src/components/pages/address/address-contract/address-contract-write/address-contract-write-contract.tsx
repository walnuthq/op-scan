"use client";
import { AbiFunction, Address } from "viem";
import { Contract } from "@/lib/types";
import { Accordion } from "@/components/ui/accordion";
import ReadWriteFunction from "@/components/pages/address/address-contract/read-write-function";

const AddressContractWrite = ({
  address,
  contract,
}: {
  address: Address;
  contract: Contract;
}) => {
  const functions = contract.abi.filter(
    ({ type }) => type === "function",
  ) as AbiFunction[];
  const writeFunctions = functions.filter(({ stateMutability }) =>
    ["nonpayable", "payable"].includes(stateMutability),
  );
  return (
    <div className="space-y-4">
      <appkit-button />
      <Accordion className="space-y-4" type="multiple">
        {writeFunctions.map((writeFunction, index) => (
          <ReadWriteFunction
            key={writeFunction.name}
            index={index}
            readWriteFunction={writeFunction}
            address={address}
            contract={contract}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default AddressContractWrite;
