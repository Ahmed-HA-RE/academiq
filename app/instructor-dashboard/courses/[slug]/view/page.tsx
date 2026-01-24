import InstructorViewCoursePageDetails from '@/app/components/instructor/InstructorViewCoursePageDetails';
import { getCourseBySlug } from '@/lib/actions/course/getCourses';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  getTotalStudentsCompletedCourseForInstructor,
  getTotalStudentsUncompletedCourseForInstructor,
  getTotalStudentsNotStartedCourseForInstructor,
} from '@/lib/actions/instructor/analytics';
import UserCourseReview from '@/app/components/shared/UserCourseReview';
import { getCourseReviews } from '@/lib/actions/course/getReview';

export const metadata: Metadata = {
  title: 'Course View',
  description: 'View your course as an instructor on Academiq.',
};

const InstructorViewCoursePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const [
    course,
    completedCourseCount,
    notStartedCourseCount,
    notCompletedCourseCount,
    courseReviews,
  ] = await Promise.all([
    getCourseBySlug(slug),
    getTotalStudentsCompletedCourseForInstructor(slug),
    getTotalStudentsNotStartedCourseForInstructor(slug),
    getTotalStudentsUncompletedCourseForInstructor(slug),
    getCourseReviews(slug, 1, 5),
  ]);

  if (!course) redirect('/instructor-dashboard/courses');

  return (
    <div className='col-span-4 space-y-8 sm:space-y-10'>
      <h1 className='text-3xl lg:text-4xl font-bold text-center'>
        Course Preview
      </h1>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-5'>
        {/* Left side */}
        <div className='lg:col-span-3 border-b-2 pb-6 lg:border-r-2 lg:border-b-0 lg:pr-6 lg:pb-0'>
          <InstructorViewCoursePageDetails course={course} />
        </div>
        {/* Right side */}
        <div className='space-y-4 lg:col-span-2'>
          <h2>Enrollment Statistics</h2>
          <div className='space-y-3'>
            {/* Finished */}
            <span className='flex items-center gap-6'>
              <h4 className='text-4xl font-light text-emerald-600'>
                {completedCourseCount}
              </h4>
              <h5 className='text-sm'>Students Finished</h5>
            </span>
            {/* Not Completed */}
            <span className='flex items-center gap-6'>
              <h4 className='text-4xl font-light text-yellow-800'>
                {notCompletedCourseCount}
              </h4>
              <h5 className='text-sm'>Haven&apos;t Finished</h5>
            </span>
            {/* Not Started */}
            <span className='flex items-center gap-6'>
              <h4 className='text-4xl font-light text-red-700'>
                {notStartedCourseCount}
              </h4>
              <h5 className='text-sm'>Not Started</h5>
            </span>
          </div>

          {/* Latest Reviews */}
          <div className='mt-8 space-y-4'>
            <h2>Latest Reviews</h2>
            {courseReviews && courseReviews.reviews.length > 0 ? (
              <div className='space-y-4 max-h-[500px] overflow-y-auto pr-2'>
                {courseReviews.reviews.map((review) => (
                  <UserCourseReview key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/30'>
                <svg
                  className='w-16 h-16 text-muted-foreground/40 mb-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                  />
                </svg>
                <h3 className='text-lg font-medium text-muted-foreground mb-2'>
                  No Reviews Yet
                </h3>
                <p className='text-sm text-muted-foreground/70 text-center max-w-xs'>
                  There are no reviews currently for this course. Reviews will
                  appear here once students start sharing their feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorViewCoursePage;
