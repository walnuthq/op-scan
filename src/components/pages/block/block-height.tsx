import DescriptionListItem from "@/components/lib/description-list-item";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const BlockHeight = ({
  number,
  latestBlockNumber,
}: {
  number: bigint;
  latestBlockNumber: bigint;
}) => (
  <DescriptionListItem title="Block Height">
    <div className="flex items-center">
      {number.toString()}
      <Pagination className="ml-4">
        <PaginationContent>
          {number > BigInt(0) && (
            <PaginationItem>
              <PaginationPrevious href={`/block/${number - BigInt(1)}`} />
            </PaginationItem>
          )}
          {number < latestBlockNumber && (
            <PaginationItem>
              <PaginationNext href={`/block/${number + BigInt(1)}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  </DescriptionListItem>
);

export default BlockHeight;
