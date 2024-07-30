"use client";
import { useRouter } from "next/navigation";
import { Hash } from "viem";
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
import { l1PublicClient } from "@/lib/chains";

const LatestTxsEnqueuedPagination = ({
  page,
  previousStart,
  previousHash,
  nextStart,
  nextHash,
  latest,
}: {
  page: number;
  previousStart?: bigint;
  previousHash?: Hash;
  nextStart?: bigint;
  nextHash?: Hash;
  latest: bigint;
}) => {
  const router = useRouter();
  const txsEnqueuedPerPage = BigInt(
    process.env.NEXT_PUBLIC_TXS_ENQUEUED_PER_PAGE,
  );
  const totalPages = BigInt(Math.ceil(100000 / Number(txsEnqueuedPerPage)));
  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            className="text-primary hover:bg-primary"
            onClick={async () => {
              const latestBlockNumber = await l1PublicClient.getBlockNumber();
              router.push(
                `/txs-enqueued?start=${latestBlockNumber}&hash=0x&latest=${latestBlockNumber}`,
              );
            }}
          >
            <RotateCw className="size-4" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="w-auto px-4 py-2 text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
            href={`/txs-enqueued?start=${latest}&hash=0x&latest=${latest}`}
            aria-disabled={!previousStart}
          >
            First
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            className="text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
            href={`/txs-enqueued?start=${previousStart}&hash=${previousHash}&latest=${latest}`}
            aria-disabled={!previousStart}
          />
        </PaginationItem>
        <PaginationItem className="text-sm">
          Page {page} of {totalPages.toString()}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className="text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
            href={`/txs-enqueued?start=${nextStart}&hash=${nextHash}&latest=${latest}`}
            aria-disabled={!nextStart}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default LatestTxsEnqueuedPagination;
