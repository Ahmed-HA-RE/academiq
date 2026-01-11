'use client';
import { Suspense, useState, useTransition } from 'react';
import Image from 'next/image';
import {
  CircleIcon,
  EllipsisVerticalIcon,
  GraduationCap,
  PlusIcon,
  SearchIcon,
  ShieldUser,
  User as UserIcon,
  Users,
} from 'lucide-react';
import { Course } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { Input } from '../../ui/input';
import { parseAsInteger, parseAsString, throttle, useQueryStates } from 'nuqs';
import DeleteDialog from '../../shared/DeleteDialog';
import { deleteSelectedUsers } from '@/lib/actions/user';
import { toast } from 'sonner';
import Link from 'next/link';
import ScreenSpinner from '../../ScreenSpinner';
import DataPagination from '../../shared/Pagination';
import { format } from 'date-fns';

const columns: ColumnDef<Course & { studentsCount: number }>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
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
    header: 'Course',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Avatar className='size-9'>
          <Suspense
            fallback={
              <AvatarFallback className='text-xs font-bold'>
                {row.original.title.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            }
          >
            <Image
              src={row.original.image}
              alt={row.original.title}
              width={36}
              height={36}
              className='object-cover rounded-full'
            />
          </Suspense>
        </Avatar>

        <span className='font-medium'>{row.original.title}</span>
      </div>
    ),
    size: 360,
  },
  {
    header: 'Category',
    accessorKey: 'category',
    cell: ({ row }) => {
      const category = row.original.category as string;

      return (
        <span className='capitalize text-muted-foreground'>{category}</span>
      );
    },
  },
  {
    header: 'Students',
    accessorKey: 'studentsCount',
    cell: ({ row }) => (
      <span className='text-base'>
        <Users /> {row.original.studentsCount}
      </span>
    ),
  },
  {
    header: 'Price',
    accessorKey: 'price',
    cell: ({ row }) => (
      <div className='flex flex-row items-center gap-1'>
        <span className='dirham-symbol !text-base'>&#xea;</span>
        <span className='text-base'>{row.original.price}</span>
      </div>
    ),
  },
  {
    header: 'Published At',
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {format(new Date(row.original.createdAt), 'MM/dd/yyyy')}
      </span>
    ),
  },
  {
    id: 'actions',
    header: () => 'Actions',
    cell: ({ row }) => <RowActions course={row.original} />,
    enableHiding: false,
  },
];

type CoursesDataTableDetailsProps = {
  courses: (Course & { studentsCount: number })[];
  // totalPages: number;
};

const CoursesDataTableDetails = ({
  courses,
  // totalPages,
}: CoursesDataTableDetailsProps) => {
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

  const [selectUsers, setSelectUsers] = useState({});

  const table = useReactTable({
    data: courses,
    columns,
    state: {
      rowSelection: selectUsers,
    },
    onRowSelectionChange: setSelectUsers,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDeleteUsers = async () => {
    const res = await deleteSelectedUsers(Object.keys(selectUsers));
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    setSelectUsers({});
  };

  return (
    <div className='w-full col-span-4'>
      <div className='flex flex-col gap-6 p-6 px-4'>
        <div className='flex flex-row justify-between items-center'>
          <span className='text-2xl font-semibold'>Your Courses</span>
          <Tooltip>
            <TooltipTrigger>
              <Button asChild variant={'outline'} size='icon'>
                <Link href='/instructor-dashboard/courses/new'>
                  <PlusIcon />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Course</TooltipContent>
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
                    className='text-muted-foreground px-4 last:text-center  nth-of-type-[2]:pl-3'
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

      {/* {totalPages > 1 ? (
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

export default CoursesDataTableDetails;

export const RowActions = ({ course }: { course: Course }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      {isPending && <ScreenSpinner mutate={true} text='Applying changes…' />}
      <div className='flex'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex'>
              <Button
                size='icon'
                variant='ghost'
                className='rounded-full p-2 cursor-pointer'
                aria-label='Open menu'
              >
                <EllipsisVerticalIcon className='size-4.5' aria-hidden='true' />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className='cursor-pointer'>
                <Link href={`/instructor-dashboard/courses/${course.id}/view`}>
                  <span>View</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer' asChild>
                <Link href={`/instructor-dashboard/courses/${course.id}/edit`}>
                  edit
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
