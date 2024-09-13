import { AccountWithTransactionAndToken, Contract } from "@/lib/types";
import AddressContractInfo from "@/components/pages/address/address-contract/address-contract-info";
import AddressContractSources from "@/components/pages/address/address-contract/address-contract-sources";
import AddressContractAbi from "@/components/pages/address/address-contract/address-contract-abi";
import AddressContractCreationCode from "@/components/pages/address/address-contract/address-contract-creation-code";
import AddressContractBytecode from "@/components/pages/address/address-contract/address-contract-bytecode";
import AddressContractConstructorArguments from "@/components/pages/address/address-contract/address-contract-constructor-arguments";
import AddressContractSwarmSource from "@/components/pages/address/address-contract/address-contract-swarm-source";
import AddressContractVerify from "@/components/pages/address/address-contract/address-contract-verify";

const AddressContractCode = ({
  account,
  contract,
}: {
  account: AccountWithTransactionAndToken;
  contract: Contract;
}) => (
  <div className="space-y-8">
    {contract.info.match ? (
      <AddressContractInfo info={contract.info} />
    ) : (
      <AddressContractVerify address={account.address} />
    )}
    {contract.sources.length > 0 && (
      <AddressContractSources info={contract.info} sources={contract.sources} />
    )}
    {contract.abi.length > 0 && <AddressContractAbi abi={contract.abi} />}
    {account.transaction && (
      <AddressContractCreationCode creationCode={account.transaction.input} />
    )}
    {account.bytecode && (
      <AddressContractBytecode bytecode={account.bytecode} />
    )}
    {account.bytecode && account.transaction && (
      <AddressContractConstructorArguments
        bytecode={account.bytecode}
        creationCode={account.transaction.input}
        contract={contract}
      />
    )}

    {contract.info.match && account.bytecode && (
      <AddressContractSwarmSource bytecode={account.bytecode} />
    )}
  </div>
);

export default AddressContractCode;
