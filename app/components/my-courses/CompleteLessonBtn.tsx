'use client';

import { Lesson } from '@/types';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { CircleCheckBig, CircleXIcon } from 'lucide-react';
import {
  markLessonAsComplete,
  markLessonAsIncomplete,
} from '@/lib/actions/my-course/mutate-lesson';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

const CompleteLessonBtn = ({
  lessonId,
  nextLesson,
  slug,
  isCompleted,
}: {
  lessonId: string;
  nextLesson: Omit<Lesson, 'muxData'> | null;
  slug: string;
  isCompleted: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleMarkLessonStatus = async () => {
    startTransition(async () => {
      if (!isCompleted) {
        const res = await markLessonAsComplete(lessonId);

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success(res.message);
        if (nextLesson) {
          router.push(
            `/my-courses/${slug}/${nextLesson.sectionId}/${nextLesson.id}`,
          );
        } else {
          router.refresh();
        }
      } else {
        const res = await markLessonAsIncomplete(lessonId);

        if (!res.success) {
          toast.error(res.message);
          return;
        }
        toast.success(res.message);
        router.refresh();
      }
    });
  };

  return (
    <Button
      onClick={handleMarkLessonStatus}
      className={cn(
        isCompleted
          ? 'bg-slate-600 text-white hover:bg-slate-700'
          : 'bg-emerald-600 hover:bg-emerald-800',
        ' text-white cursor-pointer text-xs',
      )}
      disabled={isPending}
    >
      {isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      {isCompleted ? (
        <CircleXIcon className='size-3.5' />
      ) : (
        <CircleCheckBig className='size-3.5' />
      )}
    </Button>
  );
};

export default CompleteLessonBtn;
