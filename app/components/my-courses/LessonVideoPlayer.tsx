'use client';

import { markLessonAsComplete } from '@/lib/actions/my-course/mutate-lesson';
import { MuxData } from '@/lib/generated/prisma';
import { Lesson } from '@/types';

import MuxPlayer from '@mux/mux-player-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type LessonVideoPlayerProps = {
  lessonId: string;
  muxData: MuxData;
  slug: string;
  nextLesson: Omit<Lesson, 'muxData'> | null;
  isCompleted: boolean;
};

const LessonVideoPlayer = ({
  lessonId,
  muxData,
  slug,
  nextLesson,
  isCompleted,
}: LessonVideoPlayerProps) => {
  const router = useRouter();

  const onEnd = async () => {
    if (isCompleted) return;
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
