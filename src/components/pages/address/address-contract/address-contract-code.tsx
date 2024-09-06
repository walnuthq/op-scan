import { AccountWithTransactionAndToken } from "@/lib/types";
import { Contract } from "@/components/pages/address/address-contract/fetch-contract";
import AddressContractInfo from "@/components/pages/address/address-contract/address-contract-info";
import AddressContractSources from "@/components/pages/address/address-contract/address-contract-sources";
import AddressContractAbi from "@/components/pages/address/address-contract/address-contract-abi";
import AddressContractCreationCode from "@/components/pages/address/address-contract/address-contract-creation-code";
import AddressContractBytecode from "@/components/pages/address/address-contract/address-contract-bytecode";
import AddressContractConstructorArguments from "@/components/pages/address/address-contract/address-contract-constructor-arguments";
import AddressContractSwarmSource from "@/components/pages/address/address-contract/address-contract-swarm-source";

const AddressContractCode = ({
  account,
  contract,
}: {
  account: AccountWithTransactionAndToken;
  contract: Contract;
}) => (
  <div className="space-y-8">
    <AddressContractInfo info={contract.info} />
    <AddressContractSources info={contract.info} sources={contract.sources} />
    <AddressContractAbi abi={contract.abi} />
    <AddressContractCreationCode
      creationCode={account.transaction ? account.transaction.input : "0x"}
    />
    <AddressContractBytecode bytecode={account.bytecode ?? "0x"} />
    <AddressContractConstructorArguments
      account={account}
      contract={contract}
    />
    <AddressContractSwarmSource account={account} />
  </div>
);

export default AddressContractCode;
