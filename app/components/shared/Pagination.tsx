'use client';

import { parseAsInteger, useQueryState } from 'nuqs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '../ui/pagination';
import { Button } from '../ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const DataPagination = ({ totalPages }: { totalPages: number }) => {
  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1),
  );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className=''>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={'ghost'}
            onClick={() =>
              setCurrentPage(currentPage <= 1 ? currentPage : currentPage - 1)
            }
            className={`rounded-md ${currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined} cursor-pointer hover:bg-accent`}
            aria-disabled={currentPage <= 1}
          >
            <ChevronLeftIcon />
            <span className='hidden md:block'>Previous</span>
          </Button>
        </PaginationItem>
        <PaginationItem>
          {pages.map((page) => (
            <Button
              key={page}
              variant={'ghost'}
              onClick={() => setCurrentPage(page)}
              className={
                page === currentPage
                  ? `border-primary! rounded-none border-0 border-b-2 bg-transparent! !shadow-none`
                  : 'rounded-none  cursor-pointer'
              }
            >
              {page}
            </Button>
          ))}
        </PaginationItem>
        <PaginationItem>
          <Button
            variant={'ghost'}
            onClick={() =>
              setCurrentPage(
                currentPage >= totalPages ? totalPages : currentPage + 1,
              )
            }
            className={`rounded-md ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : undefined} cursor-pointer hover:bg-accent`}
            aria-disabled={currentPage >= totalPages}
          >
            <span className='hidden md:block'>Next</span>
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DataPagination;
