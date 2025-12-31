'use client';
import { Suspense, useState, useTransition } from 'react';
import Image from 'next/image';
import { CircleIcon, EllipsisVerticalIcon, SearchIcon } from 'lucide-react';
import { InstructorApplication } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
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
import { cn, formatId } from '@/lib/utils';
import { Input } from '../../ui/input';
import { parseAsInteger, parseAsString, throttle, useQueryStates } from 'nuqs';
import DeleteDialog from '../../shared/DeleteDialog';
import { deleteSelectedUsers } from '@/lib/actions/user';
import { toast } from 'sonner';
import Link from 'next/link';
import ScreenSpinner from '../../ScreenSpinner';
import DataPagination from '../../shared/Pagination';
import { format } from 'date-fns';
import {
  deleteApplicationById,
  updateApplicationStatusById,
} from '@/lib/actions/instructor';

const columns: ColumnDef<InstructorApplication>[] = [
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
    header: 'ID',
    accessorKey: 'id',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {`#${formatId(row.getValue('id'))}`}
      </span>
    ),
  },
  {
    header: 'User',
    cell: ({ row }) => (
      <div className='flex items-center justify-start gap-2'>
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
    header: 'Submitted At',
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {format(row.original.createdAt, 'MM/dd/yyyy')}
      </span>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'emailVerified',
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          className={cn(
            status === 'rejected'
              ? 'bg-destructive/10 text-destructive'
              : status === 'approved'
                ? 'bg-green-600/10 text-green-600'
                : 'bg-amber-600/10 text-amber-600'
          )}
        >
          <span
            className={cn(
              'size-1.5 rounded-full',
              status === 'rejected'
                ? 'bg-destructive'
                : status === 'approved'
                  ? 'bg-green-600'
                  : 'bg-amber-600'
            )}
            aria-hidden='true'
          />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: () => 'Actions',
    cell: ({ row }) => <RowActions application={row.original} />,
    enableHiding: false,
  },
];

type ApplicationDataTableProps = {
  applications: InstructorApplication[];
  totalPages: number;
};

const ApplicationDataTable = ({
  applications,
  totalPages,
}: ApplicationDataTableProps) => {
  const [filters, setFilters] = useQueryStates(
    {
      status: parseAsString.withDefault('all').withOptions({
        limitUrlUpdates: throttle(500),
      }),
      submittedAt: parseAsString.withDefault('').withOptions({
        limitUrlUpdates: throttle(500),
      }),
      search: parseAsString
        .withDefault('')
        .withOptions({ limitUrlUpdates: throttle(500) }),
      page: parseAsInteger.withDefault(1),
    },
    { shallow: false }
  );

  const [selectApplications, setSelectApplications] = useState({});

  const table = useReactTable({
    data: applications,
    columns,
    state: {
      rowSelection: selectApplications,
    },
    onRowSelectionChange: setSelectApplications,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDeleteUsers = async () => {
    const res = await deleteSelectedUsers(Object.keys(selectApplications));
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    setSelectApplications({});
  };

  return (
    <div className='w-full col-span-4 border bg-card shadow-sm rounded-lg'>
      <div className='border-b'>
        <div className='flex flex-col gap-4 p-6'>
          <div className='flex flex-row justify-between items-center'>
            <span className='text-2xl font-semibold'>Applications</span>
            <DeleteDialog
              title='Delete Selected Applications?'
              description='Are you sure you want to delete the selected applications? this action can not be undone.'
              action={handleDeleteUsers}
              disabled={
                Object.keys(selectApplications).length > 0 ? false : true
              }
            />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
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
                  <SelectItem value='approved' className='cursor-pointer'>
                    <span className='flex items-center gap-2'>
                      <CircleIcon className='size-2 fill-green-500 text-green-500' />
                      <span className='truncate'>Approved</span>
                    </span>
                  </SelectItem>
                  <SelectItem value='rejected' className='cursor-pointer'>
                    <span className='flex items-center gap-2'>
                      <CircleIcon className='size-2 fill-destructive text-destructive' />
                      <span className='truncate'>Rejected</span>
                    </span>
                  </SelectItem>
                  <SelectItem value='pending' className='cursor-pointer'>
                    <span className='flex items-center gap-2'>
                      <CircleIcon className='size-2 fill-amber-400 text-amber-400' />
                      <span className='truncate'>Pending</span>
                    </span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Paid at calendar */}
            <Input
              type='date'
              className='col-span-1'
              value={filters.submittedAt}
              onChange={(e) => setFilters({ submittedAt: e.target.value })}
            />
            {/* Search Input  */}
            <div className='relative sm:col-span-2 lg:col-span-1'>
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

      {totalPages > 1 ? (
        <div className='flex items-center justify-between px-6 py-4 max-sm:flex-col md:max-lg:flex-col gap-6'>
          <p
            className='text-muted-foreground text-sm whitespace-nowrap'
            aria-live='polite'
          >
            Showing <span>{table.getRowCount().toString()} </span> of{' '}
            <span>{applications.length} applications</span>
          </p>
          <div>
            <DataPagination totalPages={totalPages} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ApplicationDataTable;

export const RowActions = ({
  application,
}: {
  application: InstructorApplication;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDeleteApplication = async () => {
    const res = await deleteApplicationById(application.id);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
  };

  const handleUpdateStatus = async (status: string) => {
    startTransition(async () => {
      const res = await updateApplicationStatusById(application.id, status);
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
      <div className='flex items-center justify-center'>
        <Tooltip>
          <TooltipTrigger asChild>
            <DeleteDialog
              title={`Delete ${application.user.name} application?`}
              description={`Are you sure you want to delete ${application.user.name} application? This action cannot be undone.`}
              action={handleDeleteApplication}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
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
                <Link href={`/admin-dashboard/users/${application.id}/view`}>
                  <span>View</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus('approved')}
                className='cursor-pointer'
                variant='success'
                disabled={
                  application.status === 'approved' ||
                  application.status === 'rejected'
                }
              >
                <span>Approve</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus('rejected')}
                className='cursor-pointer'
                variant='destructive'
                disabled={
                  application.status === 'approved' ||
                  application.status === 'rejected'
                }
              >
                <span>Reject</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
