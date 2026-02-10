'use client';

import { CircleAlertIcon, CheckCircle2, XCircle } from 'lucide-react';
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
import { createRefund } from '@/lib/actions/order/create-refund';
import toast from 'react-hot-toast';
import { Order } from '@/types';
import { Spinner } from '../ui/spinner';
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { useRouter } from 'next/navigation';

const RefundDialog = ({
  order,
}: {
  order: Omit<Order, 'billingDetails' | 'paymentResult'>;
}) => {
  const id = useId();
  const [acknowledged, setAcknowledged] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleRefund = () => {
    startTransition(async () => {
      const res = await createRefund(order.id);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setOpen(false);
      setAcknowledged(false);
      router.refresh();
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
        <DialogHeader className='space-y-3'>
          <div className='mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center'>
            <CircleAlertIcon className='w-6 h-6 text-destructive' />
          </div>
          <DialogTitle className='text-2xl text-center'>
            Request Refund
          </DialogTitle>
          <DialogDescription className='text-center text-base'>
            Please review our refund policy before proceeding
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className='space-y-4'>
          <div>
            <h4 className='font-semibold text-sm mb-3 text-foreground'>
              Refund Eligibility Requirements:
            </h4>
            <div className='space-y-3'>
              <div className='flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900'>
                <CheckCircle2 className='w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='text-sm font-medium text-green-900 dark:text-green-100'>
                    Course Progress
                  </p>
                  <p className='text-xs text-green-700 dark:text-green-300 mt-1'>
                    Your course completion must be less than 10%
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900'>
                <CheckCircle2 className='w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='text-sm font-medium text-blue-900 dark:text-blue-100'>
                    Purchase Date
                  </p>
                  <p className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
                    Refund must be requested within 7 days of purchase
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900'>
            <XCircle className='w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-amber-900 dark:text-amber-100'>
                Important Notice
              </p>
              <p className='text-xs text-amber-700 dark:text-amber-300 mt-1'>
                Once processed, this refund cannot be reversed. You will lose
                access to all course materials immediately.
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-3 p-4 rounded-lg border bg-muted/50'>
            <Checkbox
              id={id}
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
            />
            <Label htmlFor={id} className='leading-relaxed cursor-pointer'>
              I acknowledge that I meet the eligibility requirements and
              understand the refund policy
            </Label>
          </div>
        </div>

        <Separator />

        <DialogFooter className='flex-col sm:flex-row gap-3'>
          <div className='w-full text-center sm:text-left order-3 sm:order-1'>
            <p className='text-xs text-muted-foreground'>
              Have questions?{' '}
              <Link
                href='/contact'
                className='text-primary hover:underline font-medium'
                onClick={() => setOpen(false)}
              >
                Contact Support
              </Link>
            </p>
          </div>
          <div className='flex gap-2 w-full sm:w-auto order-1 sm:order-2'>
            <DialogClose asChild>
              <Button
                className='flex-1 sm:flex-none'
                type='button'
                variant='outline'
                onClick={() => setAcknowledged(false)}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className='flex-1 sm:flex-none cursor-pointer'
              variant='destructive'
              disabled={!acknowledged || isPending}
              type='button'
              onClick={handleRefund}
            >
              {isPending ? <Spinner className='size-5' /> : 'Confirm Refund'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;
