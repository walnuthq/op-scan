import DescriptionListItem from "@/components/lib/description-list-item";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const BlockHeight = ({ number }: { number: bigint }) => (
  <DescriptionListItem title="Block Height">
    <div className="flex items-center">
      {number.toString()}
      <Pagination className="ml-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={`/block/${number - BigInt(1)}`} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={`/block/${number + BigInt(1)}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </DescriptionListItem>
);

export default BlockHeight;
