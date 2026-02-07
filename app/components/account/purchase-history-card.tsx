import { ChevronDownIcon, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { format, isBefore, subWeeks } from 'date-fns';
import Image from 'next/image';
import { Button } from '../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { Badge } from '../ui/badge';
import { capitalizeFirstLetter } from '@/lib/utils';
import { Separator } from '../ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { getOrderReceipt } from '@/lib/actions/order/get-order-receipt';
import { Order } from '@/types';
import Link from 'next/link';
import { getUserRefundEligibility } from '@/lib/actions/user/get-user-refund-eligibility';
import RefundDialog from './refund-dialog';

const PurchaseHistoryCard = async ({
  order,
}: {
  order: Omit<Order, 'billingDetails' | 'paymentResult'>;
}) => {
  const [receiptUrl, refundEligibility] = await Promise.all([
    getOrderReceipt(order.stripePaymentIntentId as string),
    getUserRefundEligibility(order.userId),
  ]);

  const createdAt = order.createdAt;
  const oneWeekAgo = subWeeks(new Date(), 1);
  const hasPassedOneWeek = isBefore(createdAt, oneWeekAgo);

  const isEligibleForRefund =
    refundEligibility &&
    Number(refundEligibility.progress) < 10 &&
    !hasPassedOneWeek && // 7 days and less than 10% progress
    order.status !== 'refunded';

  return (
    <Card className='pt-0 gap-0 overflow-hidden mb-4 relative' key={order.id}>
      {/* Refunded Badge */}
      {order.status === 'refunded' ? (
        <Badge
          variant='default'
          className={`bg-fuchsia-500 dark:bg-fuchsia-600 text-white gap-1.5 absolute top-0 right-0 z-10 shadow-lg rounded-md px-3 py-1.5 font-medium`}
        >
          Refunded
        </Badge>
      ) : (
        <Badge
          variant={isEligibleForRefund ? 'default' : 'destructive'}
          className={`${
            isEligibleForRefund
              ? 'bg-green-600 dark:bg-green-700'
              : 'bg-red-600 dark:bg-red-700'
          } text-white gap-1.5 absolute top-0 right-0 z-10 shadow-lg rounded-md px-3 py-1.5 font-medium`}
        >
          {isEligibleForRefund ? 'Refund Eligible' : 'Not Eligible'}
        </Badge>
      )}

      <CardHeader className='p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-row items-center justify-between gap-8'>
        <div className='flex flex-row items-center gap-8'>
          <div className='flex flex-col gap-2'>
            <span className='text-slate-700 dark:text-slate-300 text-base'>
              Purchased on
            </span>
            <span className='text-lg text-black dark:text-white'>
              {format(new Date(order.createdAt), 'MMMM d, yyyy')}
            </span>
          </div>
          <div className='flex flex-col gap-2'>
            <span className='text-slate-700 dark:text-slate-300 text-base'>
              Order Total
            </span>
            <div className='flex flex-row items-center gap-1'>
              <span className='dirham-symbol !text-lg'>&#xea;</span>
              <span className='text-lg'>{order.totalPrice}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-3 px-0 pt-4'>
        {order.orderItem.map((item) => (
          <div
            key={item.id}
            className='flex items-start gap-4 pb-3 px-4 last:border-b-0'
          >
            <div className='relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700'>
              <Image
                src={item.image}
                alt={item.name}
                width={0}
                height={0}
                sizes='100vw'
                fill
                className='object-cover'
              />
            </div>
            <div className='flex-1 space-y-4'>
              <h4 className='font-semibold text-base line-clamp-2'>
                {item.name}
              </h4>
              <div className='flex flex-row items-center gap-1'>
                <span className='dirham-symbol !text-base'>&#xea;</span>
                <span className='text-base'>{item.price}</span>
              </div>
            </div>
          </div>
        ))}
        <Separator className='my-4' />
        <div className='px-4'>
          <Collapsible>
            <div className='flex items-center justify-between gap-4 px-3'>
              <div className='text-base font-semibold'>
                View Payment History
              </div>
              <CollapsibleTrigger asChild className='group'>
                <Button
                  className='cursor-pointer'
                  variant='ghost'
                  size='icon-sm'
                >
                  <ChevronDownIcon className='text-muted-foreground transition-transform group-data-[state=open]:rotate-180' />
                  <span className='sr-only'>Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className='mt-4 px-2'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className=''>Transaction date</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Receipt actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className='font-medium'>
                      {' '}
                      {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-row items-center gap-1'>
                        <span className='dirham-symbol !text-base'>&#xea;</span>
                        <span className='text-base'>{order.taxPrice}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className='bg-green-600 dark:bg-green-700 text-white'>
                        {capitalizeFirstLetter(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href={receiptUrl as string}
                        rel='noopener noreferrer'
                        target='_blank'
                        className='underline'
                      >
                        View
                      </a>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
      <Separator className='my-4' />
      <CardFooter className='items-end justify-end'>
        <div className='flex items-center justify-end w-full gap-3'>
          <Button
            variant={'outline'}
            asChild
            className='gap-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-950 border-gray-300 dark:border-gray-700 transition-all duration-200 group'
          >
            <Link href={`/order/${order.id}`}>
              View Order Summary
              <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </Button>
          {isEligibleForRefund && <RefundDialog order={order} />}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PurchaseHistoryCard;
