import ConfettiWrapper from '@/app/components/confetti-wrapper';
import CompleteLessonBtn from '@/app/components/my-courses/CompleteLessonBtn';
import LessonVideoPlayer from '@/app/components/my-courses/LessonVideoPlayer';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  getCourseLessonById,
  getCourseNextSection,
  getLessonProgress,
} from '@/lib/actions/my-course/course-content';
import { formatDuration } from '@/lib/utils';
import { CircleCheckBig, Clock4 } from 'lucide-react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

type GenerateMetadataProps = {
  params: Promise<{ lessonId: string }>;
};

export const generateMetadata = async ({
  params,
}: GenerateMetadataProps): Promise<Metadata> => {
  const { lessonId } = await params;

  const lesson = await getCourseLessonById(lessonId);

  return {
    title: lesson.lesson?.title,
  };
};

const CourseLessonPage = async ({
  params,
}: {
  params: Promise<{ id: string; sectionId: string; lessonId: string }>;
}) => {
  const { id, sectionId, lessonId } = await params;

  const [{ lesson, nextLesson }, isCompleted, nextSection] = await Promise.all([
    getCourseLessonById(lessonId),
    getLessonProgress(lessonId),
    getCourseNextSection(sectionId),
  ]);

  if (!lesson || !lesson.muxData) {
    return redirect('/my-courses');
  }

  return (
    <section className='min-h-screen'>
      <ConfettiWrapper />
      {/* Banner */}
      {isCompleted && (
        <div className='bg-emerald-700 px-4 py-3 text-white'>
          <p className='text-center text-sm flex items-center justify-center gap-2'>
            <CircleCheckBig aria-hidden='true' size={16} />
            You have completed this lesson
          </p>
        </div>
      )}
      <div className='w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8'>
        {/* Lesson Title */}
        <div className='space-y-2'>
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
            {lesson.title}
          </h1>
        </div>

        {/* Video Player Container */}
        <LessonVideoPlayer
          lessonId={lessonId}
          muxData={lesson.muxData}
          courseId={id}
          nextLesson={nextLesson}
          isCompleted={isCompleted}
        />

        {/* Lesson Info Card */}
        <Card>
          <CardContent className='flex flex-row items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='bg-muted p-2 rounded-lg'>
                <Clock4 size={16} />
              </div>
              <span className='font-medium'>
                {formatDuration(lesson.duration)}
              </span>
            </div>
            <CompleteLessonBtn
              nextLesson={nextLesson}
              lessonId={lessonId}
              courseId={id}
              isCompleted={isCompleted}
              nextSection={nextSection}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CourseLessonPage;
