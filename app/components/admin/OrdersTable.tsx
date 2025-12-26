'use client';

import { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from 'lucide-react';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '../ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

import { usePagination } from '@/hooks/use-pagination';
import { Order } from '@/types';
import { cn, formatDate, formatId } from '@/lib/utils';
import Link from 'next/link';

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Order ID',
    cell: ({ row }) => (
      <span className='text-card-foreground font-medium'>
        {`#${formatId(row.original.id)}`}
      </span>
    ),
  },
  {
    accessorKey: 'billingDetails.fullName',
    header: 'Buyer',
    cell: ({ row }) => {
      return <span>{row.original.billingDetails.fullName}</span>;
    },
  },
  {
    accessorKey: 'billingDetails.email',
    header: 'Buyer Email',
    cell: ({ row }) => <span>{row.original.billingDetails.email}</span>,
  },
  {
    accessorKey: 'paymentResult.amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div className='flex flex-row items-center gap-1'>
        <span className='dirham-symbol !text-base'>&#xea;</span>
        <span className='text-base'>
          {row.original.paymentResult?.amount || row.original.totalPrice}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'paidAt',
    header: 'Paid At',
    cell: ({ row }) => (
      <span>
        {row.original.paidAt === null
          ? 'N/A'
          : formatDate(new Date(row.original.paidAt), 'date')}
      </span>
    ),
  },
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.original.status === 'unpaid'
            ? 'bg-destructive/10 text-destructive'
            : row.original.status === 'paid'
              ? 'bg-green-600/10 text-green-600'
              : 'bg-amber-600/10 text-amber-600'
        )}
      >
        <span
          className={cn(
            'size-1.5 rounded-full',
            row.original.status === 'unpaid'
              ? 'bg-destructive'
              : row.original.status === 'paid'
                ? 'bg-green-600'
                : 'bg-amber-600'
          )}
          aria-hidden='true'
        />
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </Badge>
    ),
  },

  {
    id: 'actions',
    header: () => 'Actions',
    cell: ({ row }) => <RowActions orderId={row.original.id} />,
    size: 60,
    enableHiding: false,
  },
];

const OrdersDataTable = ({ orders }: { orders: Order[] }) => {
  const pageSize = 5;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 2,
  });

  return (
    <div className='w-full col-span-4 border bg-card shadow-sm rounded-lg'>
      <div className='border-b'>
        <div className='flex flex-col gap-4 p-6'>
          <h2 className='text-2xl font-bold'>All Orders</h2>
          {/* Filters */}
          <div></div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className='h-14 border-t' key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='text-muted-foreground px-6'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='px-6'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center px-6'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col'>
        <p
          className='text-muted-foreground text-sm whitespace-nowrap'
          aria-live='polite'
        >
          Showing{' '}
          <span>
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{' '}
            to{' '}
            {Math.min(
              Math.max(
                table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize,
                0
              ),
              table.getRowCount()
            )}
          </span>{' '}
          of <span>{table.getRowCount().toString()} entries</span>
        </p>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  className='disabled:pointer-events-none disabled:opacity-50'
                  variant={'ghost'}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label='Go to previous page'
                >
                  <ChevronLeftIcon aria-hidden='true' />
                  Previous
                </Button>
              </PaginationItem>

              {showLeftEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {pages.map((page) => {
                const isActive =
                  page === table.getState().pagination.pageIndex + 1;

                return (
                  <PaginationItem key={page}>
                    <Button
                      size='icon'
                      className={`${!isActive && 'bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40'}`}
                      onClick={() => table.setPageIndex(page - 1)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                );
              })}

              {showRightEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <Button
                  className='disabled:pointer-events-none disabled:opacity-50'
                  variant={'ghost'}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label='Go to next page'
                >
                  Next
                  <ChevronRightIcon aria-hidden='true' />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default OrdersDataTable;

function RowActions({ orderId }: { orderId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex'>
          <Button
            size='icon'
            variant='ghost'
            className='rounded-full p-2 cursor-pointer'
            aria-label='Edit item'
          >
            <EllipsisVerticalIcon className='size-5' aria-hidden='true' />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuGroup>
          <DropdownMenuItem className='cursor-pointer' asChild>
            <Link href={`/order/${orderId}`}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer'>
            <span>Refund</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer' variant='destructive'>
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
