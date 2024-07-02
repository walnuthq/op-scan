import { Hex } from "viem";
import { Textarea } from "@/components/ui/textarea";
import DescriptionListItem from "@/components/lib/description-list-item";

const BlockExtraData = ({ extraData }: { extraData: Hex }) => (
  <DescriptionListItem title="Extra Data">
    <Textarea placeholder={extraData} className="font-mono" disabled />
  </DescriptionListItem>
);

export default BlockExtraData;
