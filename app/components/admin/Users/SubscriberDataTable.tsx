'use client';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Subscription } from '@/types';
import {
  FileSpreadsheetIcon,
  FileTextIcon,
  SearchIcon,
  UploadIcon,
} from 'lucide-react';

import type { ColumnDef, RowData } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

import { capitalizeFirstLetter, cn } from '@/lib/utils';
import DataPagination from '../../shared/Pagination';
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  throttle,
  useQueryStates,
} from 'nuqs';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Suspense } from 'react';
import { format } from 'date-fns';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select';
  }
}

const columns: ColumnDef<Subscription>[] = [
  {
    header: 'Instructor',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Avatar className='size-9'>
          <Suspense
            fallback={
              <AvatarFallback className='text-xs font-bold'>
                {row.original.user?.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            }
          >
            <Image
              src={row.original.user?.image as string}
              alt={row.original.user?.name as string}
              width={36}
              height={36}
              className='object-cover rounded-full'
            />
          </Suspense>
        </Avatar>

        <span className='font-medium'>{row.original.user?.name}</span>
      </div>
    ),
    size: 360,
  },

  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.original.user?.email}</span>
    ),
  },

  {
    header: 'Plan',
    accessorKey: 'plan',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {capitalizeFirstLetter(row.original.plan)}
      </span>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={cn(
            status === 'active'
              ? 'bg-green-600/10 text-green-600'
              : status === 'canceled'
                ? 'bg-muted text-muted'
                : status === 'past_due'
                  ? 'bg-amber-500 text-amber-600'
                  : '',
          )}
        >
          {capitalizeFirstLetter(
            status.includes('past_due') ? 'past due' : status,
          )}
        </Badge>
      );
    },
  },

  {
    header: 'Period Start',
    accessorKey: 'periodStart',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {format(row.original.periodStart as Date, 'MM/dd/yyyy')}
      </span>
    ),
  },
  {
    header: 'Period End',
    accessorKey: 'periodEnd',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {format(row.original.periodEnd as Date, 'MM/dd/yyyy')}
      </span>
    ),
  },
  {
    header: 'Cancel At',
    accessorKey: 'cancelAt',
    cell: ({ row }) => {
      const cancelAt = row.original.cancelAt;

      return (
        <span className='text-muted-foreground'>
          {cancelAt ? format(cancelAt, 'MM/dd/yyyy') : 'N/A'}
        </span>
      );
    },
  },
];

const SubscriberDataTable = ({
  subscribers,
  totalPages,
}: {
  subscribers: Subscription[];
  totalPages: number;
}) => {
  const table = useReactTable({
    data: subscribers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault('').withOptions({
        limitUrlUpdates: throttle(500),
      }),
      status: parseAsStringLiteral([
        'active',
        'past_due',
        'canceled',
        'all',
      ]).withDefault('all'),
      limit: parseAsInteger.withDefault(10),
    },
    { shallow: false },
  );

  const exportToCSV = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : table.getFilteredRowModel().rows.map((row) => row.original);

    const csv = Papa.unparse(dataToExport, {
      header: true,
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `payments-export-${new Date().toISOString().split('T')[0]}.csv`,
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : table.getFilteredRowModel().rows.map((row) => row.original);

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Discounts');

    const cols = [
      { wch: 10 },
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
    ];

    worksheet['!cols'] = cols;

    XLSX.writeFile(
      workbook,
      `discounts-export-${new Date().toISOString().split('T')[0]}.xlsx`,
    );
  };

  const exportToJSON = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : table.getFilteredRowModel().rows.map((row) => row.original);

    const json = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `subscribers-export-${new Date().toISOString().split('T')[0]}.json`,
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='w-full col-span-4'>
      <div className='border-b'>
        <div className='flex flex-col gap-6 border-b pb-6'>
          <div className='flex flex-row justify-between items-center'>
            <span className='text-2xl font-semibold'>Subscribers</span>
          </div>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 w-full '>
            {/* Select Status */}
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({
                  status: value as 'active' | 'past_due' | 'canceled' | 'all',
                })
              }
            >
              <SelectTrigger
                id={'status'}
                className='w-full cursor-pointer input'
              >
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value='all' className='cursor-pointer'>
                    All
                  </SelectItem>
                  <SelectItem value='active' className='cursor-pointer'>
                    Active
                  </SelectItem>
                  <SelectItem value='canceled' className='cursor-pointer'>
                    Canceled
                  </SelectItem>
                  <SelectItem value='past_due' className='cursor-pointer'>
                    Past Due
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Search Input  */}
            <div className='relative'>
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
                <SearchIcon className='size-4' />
                <span className='sr-only'>Search</span>
              </div>
              <Input
                type='text'
                placeholder='Search by instructor name or email...'
                className='peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none input text-sm'
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className='flex gap-4 py-6 flex-col md:flex-row md:items-center md:justify-between'>
          {/* Filter */}
          <div className='flex flex-row items-center justify-start gap-4 '>
            <div className='flex items-center gap-2'>
              <Label htmlFor='#rowSelect' className='sr-only'>
                Show
              </Label>
              <Select
                value={filters.limit.toString()}
                onValueChange={(value) => setFilters({ limit: Number(value) })}
              >
                <SelectTrigger
                  id='rowSelect'
                  className='w-fit whitespace-nowrap cursor-pointer'
                >
                  <SelectValue placeholder='Select number of results' />
                </SelectTrigger>
                <SelectContent className='[&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2 [&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto '>
                  {[1, 5, 10, 50].map((pageSize) => (
                    <SelectItem
                      key={pageSize}
                      value={pageSize.toString()}
                      className='cursor-pointer'
                    >
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40 cursor-pointer'>
                  <UploadIcon />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={exportToCSV}
                >
                  <FileTextIcon className='mr-2 size-4' />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={exportToExcel}
                >
                  <FileSpreadsheetIcon className='mr-2 size-4' />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={exportToJSON}
                >
                  <FileTextIcon className='mr-2 size-4' />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='h-14 border-t '>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='text-muted-foreground'
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
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
                  className='hover:bg-transparent'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className='h-16 last:w-29 last:px-4'
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className='flex items-center justify-between px-6 py-4 max-sm:flex-col md:max-lg:flex-col gap-6'>
          <p
            className='text-muted-foreground text-sm whitespace-nowrap'
            aria-live='polite'
          >
            Showing <span>{table.getRowCount().toString()} </span> of{' '}
            <span>{subscribers && subscribers.length} subscribers</span>
          </p>
          <div>
            <DataPagination totalPages={totalPages} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriberDataTable;
