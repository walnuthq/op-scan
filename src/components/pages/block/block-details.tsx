import Link from "next/link";
import { formatGas } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import DescriptionListItem from "@/components/lib/description-list-item";
import TimestampListItem from "@/components/lib/timestamp-list-item";
import { Block } from "@/lib/types";
import BlockHeight from "@/components/pages/block/block-height";
import BlockExtraData from "@/components/pages/block/block-extra-data";

const BlockDetails = ({ block }: { block: Block }) => (
  <dl>
    <BlockHeight number={block.number} />
    <TimestampListItem timestamp={block.timestamp} />
    <DescriptionListItem border title="Transactions">
      <Link
        href={`/block/${block.number}/txs`}
        className="mr-1 text-primary hover:brightness-150"
      >
        {block.transactions.length} transaction
        {block.transactions.length === 1 ? "" : "s"}
      </Link>
      in this block
    </DescriptionListItem>
    <Separator />
    <DescriptionListItem title="Gas Used">
      {formatGas(block.gasUsed).value}{" "}
      <span className="ml-1 text-muted-foreground">
        ({formatGas(block.gasUsed, block.gasLimit).percentage})
      </span>
    </DescriptionListItem>
    <DescriptionListItem title="Gas Limit">
      {formatGas(block.gasLimit).value}
    </DescriptionListItem>
    <BlockExtraData extraData={block.extraData} />
    <Separator />
    <DescriptionListItem title="Hash">{block.hash}</DescriptionListItem>
    <DescriptionListItem title="Parent Hash">
      <Link
        href={`/block/${block.parentHash}`}
        className="text-primary hover:brightness-150"
      >
        {block.parentHash}
      </Link>
    </DescriptionListItem>
  </dl>
);

export default BlockDetails;
