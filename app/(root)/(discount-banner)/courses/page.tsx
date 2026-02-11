import type { SearchParams } from 'nuqs/server';
import { Metadata } from 'next';
import CoursesList from '@/app/components/courses/courses-list';
import CoursesHero from '@/app/components/courses/courses-hero';
import { Suspense } from 'react';
import CoursesListSkeleton from '@/app/components/courses/courses-list-skeleton';
import CategoriesFilter from '@/app/components/courses/categories-filter';

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}): Promise<Metadata> => {
  const { q, category } = await searchParams;

  const filters: string[] = [];

  if (q) filters.push(`Search: ${q}`);
  if (category && category !== 'All') filters.push(`Category: ${category}`);

  if (filters.length > 0) {
    return {
      title: `${filters.join(' | ')}`,
      description:
        'Browse our wide range of online courses and find the perfect match for your learning goals. Filter by rating, price, difficulty, or search to discover courses that fit your needs.',
    };
  } else {
    return {
      title: 'Courses',
      description:
        'Browse our wide range of online courses and find the perfect match for your learning goals. Filter by rating, price, difficulty, or search to discover courses that fit your needs.',
    };
  }
};

const CoursesPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return (
    <>
      <CoursesHero />
      <section className='section-spacing'>
        <div className='container'>
          <h1 className='text-3xl md:text-4xl font-bold text-foreground mb-8'>
            Explore Courses
          </h1>
          <CategoriesFilter />
          <Suspense fallback={<CoursesListSkeleton />}>
            <CoursesList searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default CoursesPage;
