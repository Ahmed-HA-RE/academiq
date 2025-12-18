import { Button } from '../components/ui/button';
import Link from 'next/link';
import { ArrowLeftIcon, InfoIcon } from 'lucide-react';
import { getUserById } from '@/lib/actions/user';
import { redirect } from 'next/navigation';
import MyCoursesCard from '../components/my-courses/MyCoursesCard';
import { Metadata } from 'next';
import type { SearchParams } from 'nuqs/server';
import { loadSearchParams } from '@/lib/searchParams';

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

  const user = await getUserById(search);

  if (!user) redirect('/');

  return (
    <section>
      <div className='container'>
        <Button className='group' asChild>
          <Link href='/'>
            <ArrowLeftIcon
              aria-hidden='true'
              className='-me-1 opacity-60 transition-transform group-hover:-translate-x-0.5'
              size={16}
            />
            Back to Home
          </Link>
        </Button>
        {/* Display courses */}
        {user.courses.length === 0 ? (
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
          <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {user.courses.map((course) => (
              <MyCoursesCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyCoursesPage;
