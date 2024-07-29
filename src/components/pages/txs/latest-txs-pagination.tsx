"use client";
import { useRouter } from "next/navigation";
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
import { l2PublicClient } from "@/lib/chains";

const LatestTxsPagination = ({
  page,
  previousStart,
  previousIndex,
  nextStart,
  nextIndex,
  latest,
}: {
  page: number;
  previousStart?: bigint;
  previousIndex?: number;
  nextStart?: bigint;
  nextIndex?: number;
  latest: bigint;
}) => {
  const router = useRouter();
  const txsPerPage = BigInt(process.env.NEXT_PUBLIC_TXS_PER_PAGE);
  const totalPages = BigInt(Math.ceil(500000 / Number(txsPerPage)));
  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            className="text-primary hover:bg-primary"
            onClick={async () => {
              const latestBlockNumber = await l2PublicClient.getBlockNumber();
              router.push(
                `/txs?start=${latestBlockNumber}&index=0&latest=${latestBlockNumber}`,
              );
            }}
          >
            <RotateCw className="size-4" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="w-auto px-4 py-2 text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
            href={`/txs?start=${latest}&index=0&latest=${latest}`}
            aria-disabled={!previousStart}
          >
            First
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            className="text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
            href={`/txs?start=${previousStart}&index=${previousIndex}&latest=${latest}`}
            aria-disabled={!previousStart}
          />
        </PaginationItem>
        <PaginationItem className="text-sm">
          Page {page} of {totalPages.toString()}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className="text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
            href={`/txs?start=${nextStart}&index=${nextIndex}&latest=${latest}`}
            aria-disabled={!nextStart}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default LatestTxsPagination;
