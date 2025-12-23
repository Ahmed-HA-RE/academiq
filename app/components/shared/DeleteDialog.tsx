'use client';

import { Trash2Icon, TriangleAlertIcon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Spinner } from '../ui/spinner';
import { useTransition } from 'react';

type DeleteDialogProps = {
  title: string;
  description: string;
  action: () => void;
  disabled?: boolean;
};

const DeleteDialog = ({
  title,
  description,
  action,
  disabled,
}: DeleteDialogProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='cursor-pointer'
          disabled={disabled}
        >
          <Trash2Icon className='size-5' />
          <span className='sr-only'>Delete Item</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className='items-center'>
          <div className='bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full'>
            <TriangleAlertIcon className='text-destructive size-6' />
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className='text-center'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={() => {
              startTransition(() => {
                action();
                setOpenDialog(false);
              });
            }}
            className='bg-destructive dark:bg-destructive/60 hover:bg-destructive focus-visible:ring-destructive text-white cursor-pointer min-w-20'
            disabled={isPending}
          >
            {isPending ? <Spinner className='size-6' /> : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
