import { Course, Section, User } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import DOMPurify from 'isomorphic-dompurify';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Clock } from 'lucide-react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { COURSE_TABS_TRIGGER } from '@/lib/constants';
import CourseReviews from './CourseReviews';
import {
  getAverageCourseRating,
  getCourseReviews,
  getUserReview,
} from '@/lib/actions/course/getReview';
import { SearchParams } from 'nuqs/server';
import { loadSearchParams } from '@/lib/searchParams';

const CourseDetails = async ({
  course,
  user,
  searchParams,
}: {
  course: Course & { sections: Section };
  user?: User;
  searchParams: Promise<SearchParams>;
}) => {
  const { page } = await loadSearchParams(searchParams);

  const review = await getUserReview(course.id);
  const { reviews, totalPages } = await getCourseReviews(course.id, page);
  const avgReviewRating = await getAverageCourseRating(course.id);

  dayjs.extend(duration);

  const lessonDuration = (duration: number) => {
    const parseLessonDuration = dayjs.duration(duration, 'minute');
    const formatLessonDuration =
      Number(duration) < 60
        ? `${parseLessonDuration.minutes()} min`
        : `${parseLessonDuration.hours()} hr ${parseLessonDuration.minutes()} min`;
    return formatLessonDuration;
  };

  return (
    <section className='py-6 md:py-8'>
      <div className='container'>
        <Tabs className='items-start' defaultValue='about-course'>
          <TabsList className='h-auto gap-4 rounded-none border-b bg-transparent px-0 py-1 w-full'>
            {COURSE_TABS_TRIGGER.map((tab) => (
              <TabsTrigger
                key={tab.value}
                className='after:-mb-1 relative after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:!bg-transparent data-[state=active]:shadow-none data-[state=active]:hover:bg-accent data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500 data-[state=active]:dark:text-amber-500 data-[state=active]:dark:after:bg-amber-500 cursor-pointer text-muted-foreground text-lg font-normal border-0'
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent className='w-full' value='about-course'>
            <div className='py-10 md:py-12 space-y-4'>
              <h2 className='font-bold text-2xl'>Description</h2>
              <p
                className='text-muted-foreground'
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(course.description),
                }}
              />
            </div>
          </TabsContent>
          <TabsContent className='w-full' value='course-content'>
            <div className='py-10 md:py-12'>
              <Accordion type='multiple' className='space-y-3'>
                {course.sections.map((section, index) => (
                  <AccordionItem
                    value={section.id}
                    className='bg-white dark:bg-muted rounded-xl border border-gray-200 last:border-b dark:border-muted overflow-hidden'
                    key={section.id}
                  >
                    <AccordionTrigger className='cursor-pointer px-6 py-4 text-base font-semibold hover:no-underline hover:bg-transparent transition-colors [&>svg]:size-5 [&>svg]:text-blue-500 dark:[&>svg]:text-amber-500'>
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-amber-500 text-blue-600 dark:text-white text-sm font-bold'>
                          {index + 1}
                        </div>
                        <span className='text-gray-900 dark:text-white'>
                          {section.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='px-6'>
                      <div className='space-y-2 pt-2'>
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className='flex items-center justify-between py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 transition-all duration-200 group'
                          >
                            <div className='flex items-center gap-3 flex-1 min-w-0'>
                              <span className='font-medium text-base text-gray-700 dark:text-gray-300 truncate'>
                                {lessonIndex + 1}. {lesson.title}
                              </span>
                            </div>
                            <div className='flex items-center gap-1.5 text-gray-500 dark:text-gray-400  ml-4 flex-shrink-0'>
                              <Clock className='size-5' />
                              <span className='font-medium text-base'>
                                {lessonDuration(lesson.duration)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
          <TabsContent className='w-full' value='reviews'>
            <div className='py-10 md:py-12 w-full'>
              <CourseReviews
                course={course}
                user={user}
                review={review}
                reviews={reviews}
                totalPages={totalPages}
                avgReviewRating={avgReviewRating.toFixed(1)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default CourseDetails;
