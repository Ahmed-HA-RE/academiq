'use client';

import { CircleAlertIcon } from 'lucide-react';
import { useId, useState, useTransition } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { createRefund } from '@/lib/actions/order/create-refund';
import toast from 'react-hot-toast';
import { Order } from '@/types';
import { Spinner } from '../ui/spinner';

const RefundDialog = ({
  order,
}: {
  order: Omit<Order, 'billingDetails' | 'paymentResult'>;
}) => {
  const id = useId();
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const OrderLast7 = order.id?.slice(-7);

  const handleRefund = () => {
    startTransition(async () => {
      const res = await createRefund(order.id);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer' variant='destructive'>
          Request Refund
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className='flex flex-col items-center gap-2'>
          <div
            aria-hidden='true'
            className='flex size-9 shrink-0 items-center justify-center rounded-full border'
          >
            <CircleAlertIcon className='opacity-80' size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className='sm:text-center'>
              Final confirmation
            </DialogTitle>
            <DialogDescription className='sm:text-center'>
              This action cannot be undone. To confirm, please enter the order
              ID <span className='text-foreground'>{OrderLast7}</span>
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className='*:not-first:mt-2'>
          <Label htmlFor={id}>Order ID</Label>
          <Input
            id={id}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type ${OrderLast7} to confirm`}
            type='text'
            value={inputValue}
            className='input'
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className='flex-1' type='button' variant='outline'>
              Cancel
            </Button>
          </DialogClose>
          <Button
            className='flex-1 cursor-pointer'
            disabled={inputValue !== OrderLast7 || isPending}
            type='button'
            onClick={handleRefund}
          >
            {isPending ? <Spinner className='size-6' /> : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;
