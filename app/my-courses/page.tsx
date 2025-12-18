import { Button } from '../components/ui/button';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { getUserById } from '@/lib/actions/user';
import { redirect } from 'next/navigation';
import MyCoursesCard from '../components/my-courses/MyCoursesCard';

const MyCoursesPage = async () => {
  const user = await getUserById();

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
        <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {user.courses.length === 0 ? (
            <p>You are not enrolled in any courses yet.</p>
          ) : (
            user.courses.map((course) => (
              <MyCoursesCard key={course.id} course={course} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default MyCoursesPage;
