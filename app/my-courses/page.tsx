import { Button } from '../components/ui/button';
import Link from 'next/link';
import { ArrowLeftIcon, InfoIcon } from 'lucide-react';
import { getUserEnrolledCourses } from '@/lib/actions/my-course/getMyCourse';
import MyCoursesCard from '../components/my-courses/MyCoursesCard';
import { Metadata } from 'next';
import type { SearchParams } from 'nuqs/server';
import { loadSearchParams } from '@/lib/searchParams';
import Header from '../components/my-courses/Header';

export const metadata: Metadata = {
  title: 'My Courses',
  description: 'View and manage your courses.',
};

const MyCoursesPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { search } = await loadSearchParams(searchParams);

  const enrolledCourses = await getUserEnrolledCourses(search);

  return (
    <div className='min-h-screen flex flex-col w-full overflow-hidden'>
      <Header />
      <main className='w-full flex-grow z-20'>
        <section>
          <div className='max-w-5xl mx-auto p-6 space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-semibold mb-2.5'>My Courses</h1>
                <p className='text-sm text-secondary-foreground'>
                  All the courses you are currently enrolled in.
                </p>
              </div>
              <Button className='group' variant='ghost' asChild>
                <Link href='/'>
                  <ArrowLeftIcon
                    aria-hidden='true'
                    className='-ms-1 group-hover:-translate-x-0.5 opacity-60 transition-transform'
                    size={16}
                  />
                  Back to Home
                </Link>
              </Button>
            </div>
            {/* Display courses */}
            {enrolledCourses.length === 0 ? (
              <div className='mt-10 max-w-md mx-auto rounded-md border border-blue-500/50 px-4 py-3 text-blue-600'>
                <p className='text-sm'>
                  <InfoIcon
                    aria-hidden='true'
                    className='-mt-0.5 me-3 inline-flex opacity-60'
                    size={16}
                  />
                  Ready to start learning? Browse{' '}
                  <Link
                    href='/courses'
                    className='underline underline-offset-4 hover:text-blue-700'
                  >
                    courses
                  </Link>{' '}
                  and get started.
                </p>
              </div>
            ) : (
              <div className='mt-6 grid grid-cols-1 gap-6'>
                {enrolledCourses.map((course) => (
                  <MyCoursesCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyCoursesPage;
