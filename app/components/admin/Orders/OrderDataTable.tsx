'use client';

import { CircleIcon, EllipsisVerticalIcon, SearchIcon } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Order } from '@/types';
import { cn, formatDate, formatId } from '@/lib/utils';
import Link from 'next/link';
import { deleteOrderByIdAsAdmin } from '@/lib/actions/order/delete-order-as-admin';
import { createRefund } from '@/lib/actions/order/create-refund';
import { toast } from 'react-hot-toast';
import DeleteDialog from '../../shared/DeleteDialog';
import DataPagination from '../../shared/Pagination';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { parseAsInteger, parseAsString, throttle, useQueryStates } from 'nuqs';
import { useTransition } from 'react';
import ScreenSpinner from '../../ScreenSpinner';

export const columns: ColumnDef<
  Order & { user: { email: string; name: string } }
>[] = [
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
    accessorKey: 'user.name',
    header: 'Buyer',
    cell: ({ row }) => {
      return <span>{row.original.user.name}</span>;
    },
  },
  {
    accessorKey: 'user.email',
    header: 'Buyer Email',
    cell: ({ row }) => <span>{row.original.user.email}</span>,
  },
  {
    accessorKey: 'paymentResult.amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div className='flex flex-row items-center gap-1'>
        <span className='dirham-symbol !text-base'>&#xea;</span>
        <span className='text-base'>{row.original.totalPrice}</span>
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.original.status === 'expired'
            ? 'bg-destructive/10 text-destructive'
            : row.original.status === 'paid'
              ? 'bg-green-600/10 text-green-600'
              : row.original.status === 'refunded'
                ? 'bg-fuchsia-500/10 text-fuchsia-500'
                : 'bg-amber-600/10 text-amber-600',
        )}
      >
        <span
          className={cn(
            'size-1.5 rounded-full',
            row.original.status === 'expired'
              ? 'bg-destructive'
              : row.original.status === 'paid'
                ? 'bg-green-600'
                : row.original.status === 'refunded'
                  ? 'bg-fuchsia-500'
                  : 'bg-amber-600',
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
    cell: ({ row }) => <RowActions order={row.original} />,
    size: 60,
    enableHiding: false,
  },
];

const OrderDataTable = ({
  orders,
  totalPages,
}: {
  orders: (Order & { user: { email: string; name: string } })[];
  totalPages: number;
}) => {
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [filters, setFilters] = useQueryStates(
    {
      status: parseAsString.withDefault('all').withOptions({
        limitUrlUpdates: throttle(500),
      }),
      q: parseAsString
        .withDefault('')
        .withOptions({ limitUrlUpdates: throttle(500) }),
      paidAt: parseAsString.withDefault('').withOptions({
        limitUrlUpdates: throttle(500),
      }),
      page: parseAsInteger.withDefault(1),
    },
    { shallow: false },
  );

  return (
    <div className='w-full col-span-4'>
      <div className='flex flex-col gap-6 p-6 px-4'>
        <h2 className='text-2xl font-bold'>All Orders</h2>
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
                  <span className='flex items-center gap-2'>
                    <CircleIcon className='size-2 fill-blue-500 text-blue-500' />
                    <span className='truncate'>All</span>
                  </span>
                </SelectItem>
                <SelectItem value='pending' className='cursor-pointer'>
                  <span className='flex items-center gap-2'>
                    <CircleIcon className='size-2 fill-amber-400 text-amber-400' />
                    <span className='truncate'>Pending</span>
                  </span>
                </SelectItem>
                <SelectItem value='paid' className='cursor-pointer'>
                  <span className='flex items-center gap-2'>
                    <CircleIcon className='size-2 fill-green-600 text-green-600' />
                    <span className='truncate'>Paid</span>
                  </span>
                </SelectItem>
                <SelectItem value='expired' className='cursor-pointer'>
                  <span className='flex items-center gap-2'>
                    <CircleIcon className='size-2 fill-destructive text-destructive' />
                    <span className='truncate'>Expired</span>
                  </span>
                </SelectItem>
                <SelectItem value='refunded' className='cursor-pointer'>
                  <span className='flex items-center gap-2'>
                    <CircleIcon className='size-2 fill-fuchsia-500 text-fuchsia-500' />
                    <span className='truncate'>Refunded</span>
                  </span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Paid at calendar */}
          <Input
            type='date'
            className='col-span-1'
            value={filters.paidAt}
            onChange={(e) => setFilters({ paidAt: e.target.value })}
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
              value={filters.q}
              onChange={(e) => setFilters({ q: e.target.value })}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className='h-14 border-t' key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='text-muted-foreground px-6 last:text-center md:last:text-left'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='px-6'>
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
                  className='h-24 text-center px-6'
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
            <span>{orders.length} orders</span>
          </p>
          <div>
            <DataPagination totalPages={totalPages} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDataTable;

function RowActions({ order }: { order: Omit<Order, 'discount'> }) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteOrder = async () => {
    const res = await deleteOrderByIdAsAdmin(order.id);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
  };

  const handleRefundOrder = () => {
    startTransition(async () => {
      const res = await createRefund(order.id);

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  return isPending ? (
    <ScreenSpinner mutate={true} text='Processing refund…' />
  ) : (
    <div className='flex items-center'>
      <DeleteDialog
        action={handleDeleteOrder}
        title='Delete Order'
        description='Are you sure you want to delete this order. It can not be undone.'
      />
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
              <Link href={`/order/${order.id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={order.status === 'refunded'}
              className='cursor-pointer'
              onClick={handleRefundOrder}
            >
              <span>{order.status === 'refunded' ? 'Refunded' : 'Refund'}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
