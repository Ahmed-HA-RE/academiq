import { ChevronDownIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { format } from 'date-fns';
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

const PurchaseHistory = async ({
  order,
}: {
  order: Omit<Order, 'billingDetails' | 'paymentResult'>;
}) => {
  const receiptUrl = await getOrderReceipt(
    order.stripePaymentIntentId as string,
  );

  return (
    <Card className='pt-0 overflow-hidden mb-4' key={order.id}>
      <CardHeader className='p-4 bg-gray-200 dark:bg-gray-800 flex flex-row items-center gap-8'>
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
      </CardHeader>
      <CardContent className='space-y-3'>
        {order.orderItems.map((item) => (
          <div
            key={item.id}
            className='flex items-start gap-4 pb-3 border-b last:border-b-0'
          >
            <div className='relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0'>
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
      </CardContent>
      <Separator />
      <div className='px-4'>
        <Collapsible>
          <div className='flex items-center justify-between gap-4 px-3'>
            <div className='text-base font-semibold'>View Payment History</div>
            <CollapsibleTrigger asChild className='group'>
              <Button className='cursor-pointer' variant='ghost' size='icon-sm'>
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
    </Card>
  );
};

export default PurchaseHistory;
