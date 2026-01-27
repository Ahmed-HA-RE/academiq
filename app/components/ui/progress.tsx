'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const progressVariants = cva('bg-primary h-full w-full flex-1 transition-all', {
  variants: {
    variant: {
      default: 'bg-primary/20',
      success: 'bg-emerald-700 dark:bg-emerald-600',
    },
  },
});

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants>) {
  return (
    <ProgressPrimitive.Root
      data-slot='progress'
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className={cn(progressVariants({ variant: props.variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
