'use client';
import { Suspense, useTransition } from 'react';
import Image from 'next/image';
import { CircleIcon, EllipsisVerticalIcon, SearchIcon } from 'lucide-react';
import { Instructor } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
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
import { cn, formatId } from '@/lib/utils';
import { Input } from '../../ui/input';
import { parseAsInteger, parseAsString, throttle, useQueryStates } from 'nuqs';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import DataPagination from '../../shared/Pagination';
import { formatDate } from 'date-fns';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { banAsAdmin, unbanAsAdmin } from '@/lib/actions/admin/user-mutation';
import ScreenSpinner from '../../ScreenSpinner';

const columns: ColumnDef<Instructor>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {`#${formatId(row.original.id)}`}
      </span>
    ),
  },
  {
    header: 'Instructor',
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
    header: 'Contact',
    accessorKey: 'contact',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.original.phone}</span>
    ),
  },
  {
    header: 'Courses',
    accessorKey: 'coursesCount',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.original.coursesCount}</span>
    ),
  },

  {
    header: 'Registered At',
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {formatDate(row.original.createdAt, 'MM/dd/yyyy')}
      </span>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'emailVerified',
    cell: ({ row }) => {
      const status = row.original.user.banned ? 'Banned' : 'Active';

      return (
        <Badge
          className={cn(
            'rounded-full text-xs  border-none capitalize focus-visible:outline-none',
            status === 'Active'
              ? 'bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400'
              : 'bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive',
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: () => 'Actions',
    cell: ({ row }) => <RowActions instructor={row.original} />,
    enableHiding: false,
  },
];

type InstructorDataTableProps = {
  instructors: Instructor[];
  totalPages: number;
};

const InstructorDataTable = ({
  instructors,
  totalPages,
}: InstructorDataTableProps) => {
  const [filters, setFilters] = useQueryStates(
    {
      status: parseAsString.withDefault('all').withOptions({
        limitUrlUpdates: throttle(500),
      }),
      search: parseAsString
        .withDefault('')
        .withOptions({ limitUrlUpdates: throttle(500) }),
      page: parseAsInteger.withDefault(1),
    },
    { shallow: false },
  );

  const table = useReactTable({
    data: instructors,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='w-full col-span-4'>
      <div className='flex flex-col gap-6 p-6 px-4'>
        <span className='text-2xl font-semibold'>Instructors</span>

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
                <SelectItem value='active' className='cursor-pointer'>
                  <span className='flex items-center gap-2'>
                    <CircleIcon className='size-2 fill-green-600 text-green-600' />
                    <span className='truncate'>Active</span>
                  </span>
                </SelectItem>
                <SelectItem value='banned' className='cursor-pointer'>
                  <span className='flex items-center gap-2'>
                    <CircleIcon className='size-2 fill-destructive text-destructive' />
                    <span className='truncate'>Banned</span>
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
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className='h-16 border-t'>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className='text-muted-foreground px-4 last:text-center  nth-of-type-[2]:pl-3'
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
                    className='px-4 nth-of-type-[2]:pl-3 nth-of-type-[6]:text-center'
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

      {totalPages > 1 ? (
        <div className='flex items-center justify-between px-6 py-4 max-sm:flex-col md:max-lg:flex-col gap-6'>
          <p
            className='text-muted-foreground text-sm whitespace-nowrap'
            aria-live='polite'
          >
            Showing <span>{table.getRowCount().toString()} </span> of{' '}
            <span>{instructors.length} instructors</span>
          </p>
          <div>
            <DataPagination totalPages={totalPages} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InstructorDataTable;

export const RowActions = ({ instructor }: { instructor: Instructor }) => {
  const [isPending, startTransition] = useTransition();

  const handleBanUser = () => {
    startTransition(async () => {
      const res = await banAsAdmin(instructor.user.id, instructor.user.role);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  const handleUnbanUser = () => {
    startTransition(async () => {
      const res = await unbanAsAdmin(instructor.user.id, instructor.user.role);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  return (
    <>
      {isPending && <ScreenSpinner mutate={true} text='Applying changes…' />}

      <div className='flex items-center justify-center '>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex'>
              <Button
                size='icon'
                variant='ghost'
                className='rounded-full p-2 cursor-pointer'
                aria-label='Edit User'
              >
                <EllipsisVerticalIcon className='size-4.5' aria-hidden='true' />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className='cursor-pointer'>
                <Link
                  href={`/admin-dashboard/instructors/${instructor.id}/edit`}
                >
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={
                  instructor.user.banned ? handleUnbanUser : handleBanUser
                }
                className='cursor-pointer'
                variant='destructive'
              >
                <span>
                  {instructor.user.banned
                    ? 'Unban Instructor'
                    : 'Ban Instructor'}
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
