'use client';

import { markLessonAsComplete } from '@/lib/actions/my-course/mutate-lesson';
import { MuxData } from '@/lib/generated/prisma/client';

import useConfettiStore from '@/store/confetti-store';
import { Lesson } from '@/types';

import MuxPlayer from '@mux/mux-player-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type LessonVideoPlayerProps = {
  lessonId: string;
  muxData: MuxData;
  courseId: string;
  nextLesson: Omit<Lesson, 'muxData'> | null;
  isCompleted: boolean;
};

const LessonVideoPlayer = ({
  lessonId,
  muxData,
  courseId,
  nextLesson,
  isCompleted,
}: LessonVideoPlayerProps) => {
  const router = useRouter();
  const setShowConfetti = useConfettiStore((state) => state.setShowConfetti);

  const onEnd = async () => {
    if (isCompleted) return;
    const res = await markLessonAsComplete(lessonId);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setShowConfetti(true);
    if (nextLesson) {
      router.push(
        `/my-courses/${courseId}/${nextLesson.sectionId}/${nextLesson.id}`,
      );
    } else {
      setShowConfetti(true);
      router.refresh();
    }
  };

  return (
    <div className='aspect-video w-full'>
      <MuxPlayer
        playbackId={muxData.muxPlaybackId}
        className='w-full h-full'
        streamType='on-demand'
        autoPlay={false}
        onEnded={onEnd}
      />
    </div>
  );
};

export default LessonVideoPlayer;
