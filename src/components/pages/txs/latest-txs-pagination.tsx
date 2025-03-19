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
import { refresh } from "@/components/pages/txs/actions";

const LatestTxsPagination = ({
  start,
  page,
  totalPages,
}: {
  start: bigint;
  page: number;
  totalPages: number;
}) => (
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
          className="text-primary hover:bg-primary w-auto px-4 py-2 aria-disabled:pointer-events-none aria-disabled:text-inherit"
          href={`/txs?start=${start}`}
          aria-disabled={page === 1}
        >
          First
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationPrevious
          className="text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
          href={`/txs?start=${start}&page=${page - 1}`}
          aria-disabled={page === 1}
        />
      </PaginationItem>
      <PaginationItem className="text-sm">
        Page {page} of {totalPages}
      </PaginationItem>
      <PaginationItem>
        <PaginationNext
          className="text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
          href={`/txs?start=${start}&page=${page + 1}`}
          aria-disabled={page === totalPages}
        />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink
          className="text-primary hover:bg-primary w-auto px-4 py-2 aria-disabled:pointer-events-none aria-disabled:text-inherit"
          href={`/txs?start=${start}&page=${totalPages}`}
          aria-disabled={page === totalPages}
        >
          Last
        </PaginationLink>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);

export default LatestTxsPagination;
