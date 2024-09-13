import { ContractSources } from "@/lib/types";
import ContractSourceItem from "@/components/pages/address/address-contract/address-contract-sources/contract-source-item";

const ContractSourcesList = ({ sources }: { sources: ContractSources }) =>
  sources.map((source) => (
    <ContractSourceItem key={source.path} source={source} />
  ));

export default ContractSourcesList;
