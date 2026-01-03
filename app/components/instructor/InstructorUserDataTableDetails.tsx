'use client';
import { Suspense } from 'react';
import Image from 'next/image';
import { EnrolledStudents } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
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
import DataPagination from '../shared/Pagination';
import { format } from 'date-fns';
import { Progress } from '../ui/progress';
import { SearchIcon } from 'lucide-react';

const columns: ColumnDef<EnrolledStudents>[] = [
  {
    header: 'User',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Avatar className='size-9'>
          <Suspense
            fallback={
              <AvatarFallback className='text-xs font-bold'>
                {row.original.studentName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            }
          >
            <Image
              src={row.original.studentImage}
              alt={row.original.studentName}
              width={36}
              height={36}
              className='object-cover rounded-full'
            />
          </Suspense>
        </Avatar>

        <span className='font-medium'>{row.original.studentName}</span>
      </div>
    ),
    size: 360,
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.getValue('email')}</span>
    ),
  },
  {
    header: 'Course',
    accessorKey: 'course',
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-2'>{row.original.courseName}</div>
      );
    },
  },
  {
    header: 'Enrolled At',
    accessorKey: '',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {format(row.original.enrolledAt, 'MM/dd/yyyy')}
      </span>
    ),
  },
  {
    header: 'Progress',
    accessorKey: 'progress',
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <Progress value={Number(row.original.progress)} className='w-43' />
        <span className='text-muted-foreground'>{row.original.progress}%</span>
      </div>
    ),
  },
];

type UserDatatableProps = {
  enrolledStudents: EnrolledStudents[];
  totalPages: number;
};

const UserDatatable = ({
  enrolledStudents,
  totalPages,
}: UserDatatableProps) => {
  const pathname = usePathname();

  const [filters, setFilters] = useQueryStates(
    {
      q: parseAsString
        .withDefault('')
        .withOptions({ limitUrlUpdates: throttle(500) }),
      page: parseAsInteger.withDefault(1),
    },
    { shallow: false }
  );

  const table = useReactTable({
    data: enrolledStudents,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='w-full col-span-4'>
      <div className='flex flex-col gap-6 p-6 px-4'>
        <div className='flex flex-row justify-between items-center'>
          <span className='text-2xl font-semibold'>
            {pathname === '/instructor-dashboard/users'
              ? 'All Students'
              : 'Latest Enrollments'}
          </span>
        </div>
        {pathname === '/instructor-dashboard' ? null : (
          <div className='relative max-w-md'>
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
        )}
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

      {pathname === '/instructor-dashboard/users' && totalPages > 1 ? (
        <div className='flex items-center justify-between px-6 py-4 max-sm:flex-col md:max-lg:flex-col gap-6'>
          <p
            className='text-muted-foreground text-sm whitespace-nowrap'
            aria-live='polite'
          >
            Showing <span>{table.getRowCount().toString()} </span> of{' '}
            <span>{enrolledStudents.length} students</span>
          </p>
          <div>
            <DataPagination totalPages={totalPages} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserDatatable;
