"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { refresh } from "@/components/pages/blocks/actions";

const LatestBlocksPagination = ({
  start,
  latest,
}: {
  start: bigint;
  latest: bigint;
}) => {
  const blocksPerPage = BigInt(process.env.NEXT_PUBLIC_BLOCKS_PER_PAGE);
  const totalBlocks = latest + BigInt(1);
  const page = (latest - start) / blocksPerPage + BigInt(1);
  const totalPages = BigInt(
    Math.ceil(Number(totalBlocks) / Number(blocksPerPage)),
  );
  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            className="text-primary hover:bg-primary"
            onClick={() => refresh()}
          >
            <RotateCw className="size-4" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="w-auto px-4 py-2 text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
            href={`/blocks?start=${latest}&latest=${latest}`}
            aria-disabled={page === BigInt(1)}
          >
            First
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            className="text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
            href={`/blocks?start=${start + blocksPerPage}&latest=${latest}`}
            aria-disabled={page === BigInt(1)}
          />
        </PaginationItem>
        <PaginationItem className="text-sm">
          Page {page.toString()} of {totalPages.toString()}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className="text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
            href={`/blocks?start=${start - blocksPerPage}&latest=${latest}`}
            aria-disabled={page === totalPages}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="w-auto px-4 py-2 text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
            href={`/blocks?start=${latest - (totalPages - BigInt(1)) * blocksPerPage}&latest=${latest}`}
            aria-disabled={page === totalPages}
          >
            Last
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default LatestBlocksPagination;
