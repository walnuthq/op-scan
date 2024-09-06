import { Hex } from "viem";
import { FileBox } from "lucide-react";
import { decode } from "@ethereum-sourcify/bytecode-utils";
import { AccountWithTransactionAndToken } from "@/lib/types";
import PreCard from "@/components/pages/address/address-contract/pre-card";

const getSwarmSource = (bytecode: Hex) => {
  console.log(decode(bytecode));
  const { ipfs, bzzr0, bzzr1 } = decode(bytecode);
  if (ipfs) {
    return `ipfs://${ipfs}`;
  }
  return null;
  /* const metadata = getContractMetadata(bytecode);
  const decoded = cbor.decodeFirstSync(metadata) as {
    ipfs?: Buffer;
    bzzr1?: Buffer;
    bzzr0?: Buffer;
    solc: Buffer;
  };
  if (decoded.ipfs) {
    return `ipfs://${bytesToHex(decoded.ipfs).slice(6)}`;
  }
  return null; */
};

const AddressContractSwarmSource = ({
  account,
}: {
  account: AccountWithTransactionAndToken;
}) => {
  const swarmSource = getSwarmSource(account.bytecode ?? "0x");
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
