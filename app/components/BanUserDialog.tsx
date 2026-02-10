'use client';
import { Ban } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { useState } from 'react';
import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { banAsAdmin } from '@/lib/actions/admin/user-mutation';

const BanUserDialog = ({
  userId,
  name,
  role,
  banned,
}: {
  userId: string;
  name: string;
  role: string;
  banned: boolean;
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleBanUser = () => {
    startTransition(async () => {
      const res = await banAsAdmin(userId, role);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setOpenDialog(false);
    });
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogTrigger asChild>
        <Button
          className='cursor-pointer'
          size={'icon'}
          variant={'ghost'}
          disabled={banned}
        >
          <Ban className='size-5' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className='items-center'>
          <div className='bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full'>
            <Ban className='text-destructive size-6' />
          </div>
          <AlertDialogTitle>Ban {name}</AlertDialogTitle>
          <AlertDialogDescription className='text-center'>
            {role === 'instructor'
              ? 'This will ban the instructor and all their courses will be unpublished. This action cannot be undone.'
              : 'This will ban the user and they will lose access to the app. This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>
            Cancel
          </AlertDialogCancel>
          <Button
            variant='destructive'
            className='bg-destructive dark:bg-destructive/60 hover:bg-destructive focus-visible:ring-destructive text-white cursor-pointer min-w-20'
            disabled={isPending}
            onClick={handleBanUser}
          >
            {isPending ? 'Banning...' : 'Ban User'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BanUserDialog;
