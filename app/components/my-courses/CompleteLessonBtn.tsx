'use client';

import { Lesson, Section } from '@/types';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { CircleCheckBig, CircleXIcon } from 'lucide-react';
import {
  markLessonAsComplete,
  markLessonAsIncomplete,
} from '@/lib/actions/my-course/mutate-lesson';
import { toast } from 'react-hot-toast';
import { useTransition } from 'react';
import { cn, NestedOmit } from '@/lib/utils';
import useConfettiStore from '@/store/confetti-store';
import { Spinner } from '../ui/spinner';

const CompleteLessonBtn = ({
  lessonId,
  nextLesson,
  courseId,
  isCompleted,
  nextSection,
}: {
  lessonId: string;
  nextLesson: Omit<Lesson, 'muxData'> | null;
  courseId: string;
  isCompleted: boolean;
  nextSection: NestedOmit<Section, 'lessons.muxData'> | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const setShowConfetti = useConfettiStore((state) => state.setShowConfetti);

  const handleMarkLessonStatus = async () => {
    startTransition(async () => {
      if (!isCompleted) {
        const res = await markLessonAsComplete(lessonId);

        if (!res.success || !res.progress) {
          toast.error(res.message);
          return;
        }

        toast.success(res.message);

        if (Number(res.progress) === 100) {
          setShowConfetti(true);
          router.refresh();
          return;
        } else if (nextLesson) {
          router.push(
            `/my-courses/${courseId}/${nextLesson.sectionId}/${nextLesson.id}`,
          );
        } else if (nextSection) {
          router.push(
            `/my-courses/${courseId}/${nextSection.id}/${nextSection.lessons[0].id}`,
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
        ' text-white cursor-pointer text-xs min-w-32',
      )}
      disabled={isPending}
    >
      {isPending ? (
        <Spinner className='size-6 text-white' />
      ) : isCompleted ? (
        'Mark as incomplete'
      ) : (
        'Mark as complete'
      )}
      {!isPending &&
        (!isCompleted ? (
          <CircleXIcon className='size-3.5' />
        ) : (
          <CircleCheckBig className='size-3.5' />
        ))}
    </Button>
  );
};

export default CompleteLessonBtn;
