import { Hex } from "viem";
import PreCard from "@/components/lib/pre-card";
import DescriptionListItem from "@/components/lib/description-list-item";

const BlockExtraData = ({ extraData }: { extraData: Hex }) => (
  <DescriptionListItem title="Extra Data">
    <PreCard className="max-h-64 overflow-y-auto break-words whitespace-pre-wrap">
      {extraData}
    </PreCard>
  </DescriptionListItem>
);

export default BlockExtraData;
