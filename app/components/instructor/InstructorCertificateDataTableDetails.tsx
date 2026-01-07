'use client';
import { Suspense, useState, useTransition } from 'react';
import Image from 'next/image';
import {
  CheckIcon,
  CircleIcon,
  Plus,
  PlusIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { InstructorCertificate } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
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
import { Input } from '../ui/input';
import { parseAsInteger, parseAsString, throttle, useQueryStates } from 'nuqs';
import { toast } from 'sonner';
import Link from 'next/link';
import DataPagination from '../shared/Pagination';
import { format } from 'date-fns';
import { Switch } from '../ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const columns: ColumnDef<InstructorCertificate>[] = [
  {
    header: 'User',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Avatar className='size-9'>
          <Suspense
            fallback={
              <AvatarFallback className='text-xs font-bold'>
                {row.original.user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            }
          >
            <Image
              src={row.original.user.image}
              alt={row.original.user.name}
              width={36}
              height={36}
              className='object-cover rounded-full'
            />
          </Suspense>
        </Avatar>

        <span className='font-medium'>{row.original.user.name}</span>
      </div>
    ),
    size: 360,
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.original.user.email}</span>
    ),
  },
  {
    header: 'Course',
    accessorKey: 'course',
    cell: ({ row }) => {
      return (
        <span className='text-muted-foreground'>
          {row.original.course.title}
        </span>
      );
    },
  },
  {
    header: 'Issued At',
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {format(new Date(row.original.createdAt), 'MM/dd/yyyy')}
      </span>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'published',
    cell: ({ row }) => {
      return (
        <div>
          <div className='relative inline-grid h-7 grid-cols-[1fr_1fr] items-center text-sm font-medium'>
            <Switch
              checked={row.original.published}
              className='peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-14 [&_span]:z-10 [&_span]:size-6.5 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-7 [&_span]:data-[state=checked]:rtl:-translate-x-7'
              aria-label='Switch with permanent icon indicators'
            />
            <span className='pointer-events-none relative ml-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-6 peer-data-[state=unchecked]:rtl:-translate-x-6'>
              <XIcon className='size-4' aria-hidden='true' />
            </span>
            <span className='peer-data-[state=checked]:text-background pointer-events-none relative flex min-w-8 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full'>
              <CheckIcon className='size-4' aria-hidden='true' />
            </span>
          </div>
        </div>
      );
    },
  },
];

type InstructorDataTableDetailsProps = {
  certificates: InstructorCertificate[];
  // totalPages: number;
};

const InstructorDataTableDetails = ({
  certificates,
  // totalPages,
}: InstructorDataTableDetailsProps) => {
  const [filters, setFilters] = useQueryStates(
    {
      status: parseAsString.withDefault('all').withOptions({
        limitUrlUpdates: throttle(500),
      }),
      q: parseAsString
        .withDefault('')
        .withOptions({ limitUrlUpdates: throttle(500) }),
      page: parseAsInteger.withDefault(1),
    },
    { shallow: false }
  );

  const table = useReactTable({
    data: certificates,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='w-full col-span-4'>
      <div className='flex flex-col gap-6 p-6 px-4'>
        <div className='flex flex-row justify-between items-center'>
          <span className='text-2xl font-semibold'>Certificates</span>
          <Tooltip>
            <TooltipTrigger>
              <Button asChild variant={'outline'} size='icon'>
                <Link href='/instructor-dashboard/certificates/new'>
                  <PlusIcon />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add New Certificate</TooltipContent>
          </Tooltip>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Select Status */}
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ status: value })}
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
                <SelectItem value='verified' className='cursor-pointer'>
                  <span className='flex items-center gap-2'>
                    <CircleIcon className='size-2 fill-green-600 text-green-600' />
                    <span className='truncate'>Published</span>
                  </span>
                </SelectItem>
                <SelectItem value='unverified' className='cursor-pointer'>
                  <span className='flex items-center gap-2'>
                    <CircleIcon className='size-2 fill-red-600 text-red-600' />
                    <span className='truncate'>Unpublished</span>
                  </span>
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
              placeholder='Search...'
              className='peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none input text-sm'
              value={filters.q}
              onChange={(e) => setFilters({ q: e.target.value })}
            />
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className='h-14 border-t'>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className='text-muted-foreground first:pl-4 last:px-4 last:text-center'
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
                    className='h-14 first:w-12.5 first:pl-4 last:w-29 last:px-4'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* {pathname === '/admin-dashboard/users' && totalPages > 1 ? (
        <div className='flex items-center justify-between px-6 py-4 max-sm:flex-col md:max-lg:flex-col gap-6'>
          <p
            className='text-muted-foreground text-sm whitespace-nowrap'
            aria-live='polite'
          >
            Showing <span>{table.getRowCount().toString()} </span> of{' '}
            <span>{users.length} users</span>
          </p>
          <div>
            <DataPagination totalPages={totalPages} />
          </div>
        </div>
      ) : null} */}
    </div>
  );
};

export default InstructorDataTableDetails;
