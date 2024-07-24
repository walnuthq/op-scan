"use client";
import { Block } from "@/lib/types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGlobalContext from "@/components/lib/context/hook";
import LatestBlocksTableRow from "@/components/pages/blocks/latest-blocks-table-row";

const LatestBlocksTable = ({ blocks }: { blocks: Block[] }) => {
  const {
    state: { timestampFormattedAsDate },
    toggleTimestampFormattedAsDate,
  } = useGlobalContext();
  return (
    <Table className="table-auto">
      <TableHeader>
        <TableRow>
          <TableHead>Block</TableHead>
          <TableHead>
            <a
              className="cursor-pointer text-primary hover:brightness-150"
              role="button"
              onClick={toggleTimestampFormattedAsDate}
            >
              {timestampFormattedAsDate ? "Date Time (UTC)" : "Age"}
            </a>
          </TableHead>
          <TableHead>Txn</TableHead>
          <TableHead>Gas Used</TableHead>
          <TableHead>Gas Limit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blocks.map((block) => (
          <LatestBlocksTableRow
            key={block.hash}
            block={block}
            timestampFormattedAsDate={timestampFormattedAsDate}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default LatestBlocksTable;
