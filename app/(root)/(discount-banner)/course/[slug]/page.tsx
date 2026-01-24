import { getCourseBySlug } from '@/lib/actions/course/getCourses';
import { notFound } from 'next/navigation';
import { getMyCart } from '@/lib/actions/cart';
import { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';
import { getCurrentLoggedUser } from '@/lib/actions/getUser';
import CourseTopSection from '@/app/components/course/CourseTopSection';
import CourseDetails from '@/app/components/course/CourseDetails';
import { SearchParams } from 'nuqs/server';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);

  if (!course) return { title: `${APP_NAME}` };

  return {
    title: course.title,
    description: course.description,
  };
};

const CourseDetailsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) => {
  const { slug } = await params;

  const [course, cart, user] = await Promise.all([
    getCourseBySlug(slug),
    getMyCart(),
    getCurrentLoggedUser(),
  ]);

  if (!course) notFound();

  return (
    <>
      <CourseTopSection course={course} user={user} cart={cart} />
      <CourseDetails
        course={course}
        user={user}
        searchParams={searchParams}
        slug={slug}
      />
    </>
  );
};

export default CourseDetailsPage;
