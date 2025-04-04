import { Accordion } from "@/components/ui/accordion";
import { type ContractSources } from "@/lib/types";
import ContractSourceItem from "@/components/pages/address/address-contract/address-contract-code/address-contract-sources/contract-source-item";

const ContractSourcesList = ({ sources }: { sources: ContractSources }) => (
  <Accordion type="multiple">
    {sources.map((source) => (
      <ContractSourceItem key={source.path} source={source} />
    ))}
  </Accordion>
);

export default ContractSourcesList;
