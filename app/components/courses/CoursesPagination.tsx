'use client';

import { parseAsInteger, useQueryState } from 'nuqs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

const CoursesPagination = ({ totalPages }: { totalPages: number }) => {
  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className='mt-10'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`/courses?page=${currentPage <= 1 ? 1 : currentPage - 1}`}
            className={`rounded-none ${currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined}`}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>
        <PaginationItem>
          {pages.map((page) => (
            <PaginationLink
              key={page}
              href={`/courses?page=${page}`}
              isActive={page === currentPage}
              className={
                page === currentPage
                  ? `border-primary! rounded-none border-0 border-b-2 bg-transparent! !shadow-none`
                  : 'rounded-none'
              }
            >
              {page}
            </PaginationLink>
          ))}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={`/courses?page=${currentPage >= totalPages ? totalPages : currentPage + 1}`}
            className={`rounded-none ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : undefined}`}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CoursesPagination;
