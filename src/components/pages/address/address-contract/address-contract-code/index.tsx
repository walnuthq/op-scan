"use client";
import { AccountWithTransactionAndToken } from "@/lib/types";
import AddressContractInfo from "@/components/pages/address/address-contract/address-contract-code/address-contract-info";
import AddressContractSources from "@/components/pages/address/address-contract/address-contract-code/address-contract-sources";
import AddressContractAbi from "@/components/pages/address/address-contract/address-contract-code/address-contract-abi";
import AddressContractCreationCode from "@/components/pages/address/address-contract/address-contract-code/address-contract-creation-code";
import AddressContractBytecode from "@/components/pages/address/address-contract/address-contract-code/address-contract-bytecode";
import AddressContractConstructorArguments from "@/components/pages/address/address-contract/address-contract-code/address-contract-constructor-arguments";
import AddressContractSwarmSource from "@/components/pages/address/address-contract/address-contract-code/address-contract-swarm-source";
import AddressContractVerify from "@/components/pages/address/address-contract/address-contract-code/address-contract-verify";

const AddressContractCode = ({
  account,
}: {
  account: AccountWithTransactionAndToken;
}) => (
  <div className="space-y-8">
    {account.contract ? (
      <AddressContractInfo info={account.contract.info} />
    ) : (
      <AddressContractVerify address={account.address} />
    )}
    {account.contract && account.contract.sources.length > 0 && (
      <AddressContractSources
        info={account.contract.info}
        sources={account.contract.sources}
      />
    )}
    {account.contract && account.contract.abi.length > 0 && (
      <AddressContractAbi abi={account.contract.abi} />
    )}
    {account.transaction && (
      <AddressContractCreationCode creationCode={account.transaction.input} />
    )}
    {account.bytecode && (
      <AddressContractBytecode bytecode={account.bytecode} />
    )}
    {account.contract && account.bytecode && account.transaction && (
      <AddressContractConstructorArguments
        bytecode={account.bytecode}
        creationCode={account.transaction.input}
        contract={account.contract}
      />
    )}
    {account.contract && account.bytecode && (
      <AddressContractSwarmSource
        bytecode={account.bytecode}
        contract={account.contract}
      />
    )}
  </div>
);

export default AddressContractCode;
