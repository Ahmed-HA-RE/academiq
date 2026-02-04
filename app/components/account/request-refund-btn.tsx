'use client';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { useTransition } from 'react';
import { createRefund } from '@/lib/actions/order/create-refund';

const RequestRefundButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleRefund = () => {
    startTransition(async () => {
      const res = await createRefund(orderId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      window.location.reload();
    });
  };

  return (
    <Button
      variant={'destructive'}
      size={'sm'}
      className='gap-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer'
      onClick={handleRefund}
      disabled={isPending}
    >
      Request Refund
    </Button>
  );
};

export default RequestRefundButton;
