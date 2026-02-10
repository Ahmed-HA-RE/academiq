import { getCourseById } from '@/lib/actions/course/getCourses';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';
import { getCurrentLoggedUser } from '@/lib/actions/getUser';
import CourseTopSection from '@/app/components/course/CourseTopSection';
import CourseDetails from '@/app/components/course/CourseDetails';
import { SearchParams } from 'nuqs/server';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const { id } = await params;

  const course = await getCourseById(id);
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
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) => {
  const { id } = await params;

  const [course, user] = await Promise.all([
    getCourseById(id),
    getCurrentLoggedUser(),
  ]);

  if (!course) notFound();

  return (
    <>
      <CourseTopSection course={course} user={user} />
      <CourseDetails course={course} user={user} searchParams={searchParams} />
    </>
  );
};

export default CourseDetailsPage;
