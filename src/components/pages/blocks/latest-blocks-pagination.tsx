import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LatestBlocksPaginationProps {
  currentPage: number;
  totalPages: number;
  latestBlockNumber: string;
}

export default function LatestBlocksPagination({
  currentPage,
  totalPages,
  latestBlockNumber,
}: LatestBlocksPaginationProps) {
  return (
    <section className="flex justify-center items-center space-x-1 mt-4 w-fit">
      <Button asChild className="bg-transparent text-xs text-primary hover:text-white border border-border w-fit h-fit p-2">
        <Link href={`/blocks?page=1&latest=${latestBlockNumber}`}>First</Link>
      </Button>
      {currentPage > 1 && (
        <Button asChild className="bg-transparent text-primary hover:text-white border border-border w-fit h-fit p-2">
          <Link href={`/blocks?page=${currentPage - 1}&latest=${latestBlockNumber}`}>
            <ChevronLeft size={16} />
          </Link>
        </Button>
      )}
      <Button asChild className="bg-transparent text-xs text-primary cursor-default hover:bg-transparent hover:brightness-150 border border-border w-fit h-fit p-2">
        <span>Page {currentPage} of {totalPages}</span>
      </Button>
      {currentPage < totalPages && (
        <Button asChild className="bg-transparent text-primary hover:text-white border border-border w-fit h-fit p-2">
          <Link href={`/blocks?page=${currentPage + 1}&latest=${latestBlockNumber}`}>
            <ChevronRight size={16} />
          </Link>
        </Button>
      )}
      <Button asChild className="bg-transparent text-xs text-primary hover:text-white border border-border w-fit h-fit p-2">
        <Link href={`/blocks?page=${totalPages}&latest=${latestBlockNumber}`}>Last</Link>
      </Button>
    </section>
  );
}