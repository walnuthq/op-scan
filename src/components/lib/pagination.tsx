import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Pagination = ({
  pathname,
  page,
  totalPages,
}: {
  pathname: string;
  page: number;
  totalPages: number;
}) => (
  <PaginationRoot className="mx-0 w-auto">
    <PaginationContent>
      <PaginationItem>
        <PaginationLink
          className="text-primary hover:bg-primary w-auto px-4 py-2 aria-disabled:pointer-events-none aria-disabled:text-inherit"
          href={pathname}
          aria-disabled={page === 1}
        >
          First
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationPrevious
          className="text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
          href={`${pathname}?page=${page - 1}`}
          aria-disabled={page === 1}
        />
      </PaginationItem>
      <PaginationItem className="text-sm">
        Page {page} of {totalPages}
      </PaginationItem>
      <PaginationItem>
        <PaginationNext
          className="text-primary hover:bg-primary aria-disabled:pointer-events-none aria-disabled:text-inherit"
          href={`${pathname}?page=${page + 1}`}
          aria-disabled={page === totalPages}
        />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink
          className="text-primary hover:bg-primary w-auto px-4 py-2 aria-disabled:pointer-events-none aria-disabled:text-inherit"
          href={`${pathname}?page=${totalPages}`}
          aria-disabled={page === totalPages}
        >
          Last
        </PaginationLink>
      </PaginationItem>
    </PaginationContent>
  </PaginationRoot>
);

export default Pagination;
