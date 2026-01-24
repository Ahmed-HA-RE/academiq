'use client';
import { Suspense, useState, useTransition } from 'react';
import Image from 'next/image';
import {
  EllipsisVerticalIcon,
  GraduationCap,
  SearchIcon,
  ShieldUser,
  User as UserIcon,
} from 'lucide-react';
import { User } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { usePathname } from 'next/navigation';
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
import { cn, formatDate } from '@/lib/utils';
import { Input } from '../../ui/input';
import { parseAsInteger, parseAsString, throttle, useQueryStates } from 'nuqs';
import DeleteDialog from '../../shared/DeleteDialog';
import { toast } from 'sonner';
import Link from 'next/link';
import ScreenSpinner from '../../ScreenSpinner';
import DataPagination from '../../shared/Pagination';
import {
  banAsAdmin,
  deleteSelectedUsers,
  deleteUserById,
  unbanAsAdmin,
} from '@/lib/actions/admin/user-mutation';

const columns: ColumnDef<User & { ordersCount: number }>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) =>
      row.original.ordersCount === 0 && (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
    size: 50,
  },
  {
    header: 'User',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Avatar className='size-9'>
          <Suspense
            fallback={
              <AvatarFallback className='text-xs font-bold'>
                {row.original.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            }
          >
            <Image
              src={row.original.image}
              alt={row.original.name}
              width={36}
              height={36}
              className='object-cover rounded-full'
            />
          </Suspense>
        </Avatar>

        <span className='font-medium'>{row.original.name}</span>
      </div>
    ),
    size: 360,
  },
  {
    header: 'Role',
    accessorKey: 'role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;

      const roles = {
        admin: (
          <ShieldUser className='size-4 text-green-600 dark:text-green-400' />
        ),
        instructor: <GraduationCap className='size-4 text-orange-500' />,
        user: <UserIcon className='text-black dark:text-white size-4' />,
      }[role];

      return (
        <div className='flex items-center gap-2'>
          {roles}
          <span className='capitalize'>{role}</span>
        </div>
      );
    },
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.getValue('email')}</span>
    ),
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {formatDate(new Date(row.getValue('createdAt')), 'date')}
      </span>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'emailVerified',
    cell: ({ row }) => {
      const status = row.getValue('emailVerified') ? 'verified' : 'unverified';

      return (
        <Badge
          className={cn(
            'rounded-full text-xs  border-none capitalize focus-visible:outline-none',
            status === 'verified'
              ? 'bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400'
              : 'bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive',
          )}
        >
          {row.getValue('emailVerified') ? 'verified' : 'unverified'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: () => 'Actions',
    cell: ({ row }) => <RowActions user={row.original} />,
    enableHiding: false,
  },
];

type UserDatatableProps = {
  users: (User & { ordersCount: number })[];
  totalPages: number;
};

const UserDatatable = ({ users, totalPages }: UserDatatableProps) => {
  const pathname = usePathname();

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
    { shallow: false },
  );

  const [selectUsers, setSelectUsers] = useState({});

  const table = useReactTable({
    data: users,
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
          <span className='text-2xl font-semibold'>
            {pathname === '/admin-dashboard/users'
              ? 'All Users'
              : pathname === '/admin-dashboard/users/banned-users'
                ? 'Banned Users'
                : 'Latest Users'}
          </span>
          <DeleteDialog
            title='Delete Selected Users'
            description='Are you sure you want to delete the selected users? this action can not be undone.'
            action={handleDeleteUsers}
            disabled={Object.keys(selectUsers).length > 0 ? false : true}
          />
        </div>
        {pathname === '/admin-dashboard' ? null : (
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
                    Verified
                  </SelectItem>
                  <SelectItem value='unverified' className='cursor-pointer'>
                    Unverified
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

      {pathname === '/admin-dashboard/users' && totalPages > 1 ? (
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
      ) : null}
    </div>
  );
};

export default UserDatatable;

export const RowActions = ({
  user,
}: {
  user: User & { ordersCount: number };
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDeleteUser = async () => {
    const res = await deleteUserById(user.id);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
  };

  const handleBanUser = () => {
    startTransition(async () => {
      const res = await banAsAdmin(user.id, user.role);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  const handleUnbanUser = () => {
    startTransition(async () => {
      const res = await unbanAsAdmin(user.id, user.role);
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
        {user.ordersCount === 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <DeleteDialog
                title={`Delete ${user.name}?`}
                description={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
                action={handleDeleteUser}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        )}
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
                <Link href={`/admin-dashboard/users/${user.id}/edit`}>
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={user.banned ? handleUnbanUser : handleBanUser}
                className='cursor-pointer'
                variant='destructive'
              >
                <span>{user.banned ? 'Unban User' : 'Ban User'}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
