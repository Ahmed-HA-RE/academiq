'use client';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Discount } from '@/types';
import {
  FileSpreadsheetIcon,
  FileTextIcon,
  PlusIcon,
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
import { Checkbox } from '@/app/components/ui/checkbox';
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

import { cn, formatDate, formatId } from '@/lib/utils';
import {
  deleteDiscountById,
  deleteMultipleDiscounts,
} from '@/lib/actions/discount';
import { toast } from 'sonner';
import Link from 'next/link';
import DataPagination from '../../shared/Pagination';
import DeleteDialog from '../../shared/DeleteDialog';
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  throttle,
  useQueryStates,
} from 'nuqs';
import { useState } from 'react';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select';
  }
}

const columns: ColumnDef<Discount>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className='mr-0.5'
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    size: 50,
  },
  {
    header: 'ID',
    accessorKey: 'id',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{`#${formatId(row.original.id)}`}</span>
    ),
    size: 260,
  },
  {
    header: 'Name',
    accessorKey: 'code',
    cell: ({ row }) => {
      return <span className='text-muted-foreground'>{row.original.code}</span>;
    },
    size: 180,
  },
  {
    header: 'Type',
    accessorKey: 'type',
    cell: ({ row }) => <span className='capitalize'>{row.original.type}</span>,
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ row }) => {
      return row.original.type === 'percentage' ? (
        <p className='text-base text-center md:text-left'>
          {row.original.amount}%
        </p>
      ) : (
        <div className='flex flex-row items-center justify-center md:justify-start gap-1 '>
          <span className='dirham-symbol !text-base'>&#xea;</span>
          <span className='text-base'>{row.original.amount}</span>
        </div>
      );
    },
  },

  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      return (
        <Badge
          className={cn(
            'rounded-sm border-none capitalize focus-visible:outline-none',
            row.original.validUntil > new Date()
              ? 'bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5'
              : 'bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive'
          )}
        >
          {row.original.validUntil > new Date() ? 'active' : 'expired'}
        </Badge>
      );
    },
  },
  {
    header: 'Expiry Date',
    accessorKey: 'validUntil',
    cell: ({ row }) => (
      <span className='capitalize'>
        {formatDate(row.original.validUntil, 'dateTime')}
      </span>
    ),
  },
  {
    id: 'actions',
    header: () => 'Actions',
    cell: ({ row }) => (
      <div>
        <RowActions id={row.original.id} />
      </div>
    ),
    size: 60,
    enableHiding: false,
  },
];

const DiscountsDataTable = ({
  discounts,
  totalPages,
}: {
  discounts: Discount[];
  totalPages: number;
}) => {
  const [selectDiscounts, setSelectDiscounts] = useState({});

  const table = useReactTable({
    data: discounts,
    columns,
    state: {
      rowSelection: selectDiscounts,
    },
    onRowSelectionChange: setSelectDiscounts,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault('').withOptions({
        limitUrlUpdates: throttle(500),
      }),
      type: parseAsStringLiteral(['percentage', 'fixed', 'all']).withDefault(
        'all'
      ),
      expiry: parseAsString.withDefault(''),
      limit: parseAsInteger.withDefault(10),
    },
    { shallow: false }
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
      `payments-export-${new Date().toISOString().split('T')[0]}.csv`
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
      `discounts-export-${new Date().toISOString().split('T')[0]}.xlsx`
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
      `discounts-export-${new Date().toISOString().split('T')[0]}.json`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteDiscounts = async () => {
    const res = await deleteMultipleDiscounts(Object.keys(selectDiscounts));
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    setSelectDiscounts({});
  };

  return (
    <div className='w-full col-span-4'>
      <div className='border-b'>
        <div className='flex flex-col gap-6 border-b pb-6'>
          <div className='flex flex-row justify-between items-center'>
            <span className='text-2xl font-semibold'>Discounts</span>
            <DeleteDialog
              title='Delete Selected Discounts'
              description='Are you sure you want to delete the selected discounts? this action can not be undone.'
              action={handleDeleteDiscounts}
              disabled={Object.keys(selectDiscounts).length > 0 ? false : true}
            />
          </div>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 w-full '>
            {/* Select Status */}
            <Select
              value={filters.type}
              onValueChange={(value) =>
                setFilters({ type: value as 'percentage' | 'fixed' | 'all' })
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
                  <SelectLabel>Code Type</SelectLabel>
                  <SelectItem value='all' className='cursor-pointer'>
                    All
                  </SelectItem>
                  <SelectItem value='percentage' className='cursor-pointer'>
                    Percentage (%)
                  </SelectItem>
                  <SelectItem value='fixed' className='cursor-pointer'>
                    Fixed Amount (AED)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Expiry calendar */}
            <Input
              type='date'
              className='cursor-pointer input'
              value={filters.expiry}
              onChange={(e) => setFilters({ expiry: e.target.value })}
            />

            {/* Search Input  */}
            <div className='relative sm:col-span-2 md:col-span-1'>
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
                <SearchIcon className='size-4' />
                <span className='sr-only'>Search</span>
              </div>
              <Input
                type='text'
                placeholder='Search Code '
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
            <Button asChild>
              <Link href='/admin-dashboard/discounts/create'>
                <PlusIcon />
                Add Discount
              </Link>
            </Button>
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
                      style={{ width: `${header.getSize()}px` }}
                      className='text-muted-foreground first:pl-0'
                    >
                      {flexRender(
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
                  className='hover:bg-transparent'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className='h-16 last:w-29 last:px-4 first:pl-0'
                    >
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
            <span>{discounts && discounts.length} discounts</span>
          </p>
          <div>
            <DataPagination totalPages={totalPages} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountsDataTable;

function RowActions({ id }: { id: string }) {
  const handleDeleteDiscount = async () => {
    const res = await deleteDiscountById(id);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
  };

  return (
    <DeleteDialog
      action={handleDeleteDiscount}
      title='Delete Discount Code'
      description='This action will permanently delete the discount code. It will no longer be available for future purchases and cannot be restored. Existing orders will not be affected.'
    />
  );
}
