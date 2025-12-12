import { getCourseBySlug } from '@/lib/actions/course';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Rating } from '@/app/components/ui/rating';
import { sampleInstructors } from '@/sampleData';
import InstructorInfoDialog from '@/app/components/course/InstructorInfoDialog';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import {
  ArrowLeftIcon,
  ChartNoAxesColumn,
  ClipboardClock,
  TimerIcon,
  Users,
} from 'lucide-react';
import { Separator } from '@/app/components/ui/separator';
import EnrollCourseBtn from '@/app/components/shared/EnrollCourseBtn';
import { getMyCart } from '@/lib/actions/cart';

const CourseDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const cart = await getMyCart();
  return (
    <section className='mb-10'>
      <div className='container'>
        <Button className='group mb-6' variant='ghost' asChild>
          <Link href={'/courses'}>
            <ArrowLeftIcon
              aria-hidden='true'
              className='-ms-1 group-hover:-translate-x-0.5 opacity-60 transition-transform'
              size={16}
            />
            Back to Courses
          </Link>
        </Button>

        <div className='grid grid-cols-1 md:grid-cols-5 md:gap-20'>
          {/* Left side */}
          <div className='md:col-span-3'>
            {/* image */}
            <div className='relative'>
              <Image
                src={course.image}
                alt={course.title}
                width={0}
                height={0}
                sizes='100vw'
                className='w-full max-h-[400px] rounded-2xl object-cover'
              />
              {/* rating + num reviews */}
              <div className='absolute bottom-4 right-5 z-10 flex flex-col items-start gap-1'>
                <p className='text-white text-sm font-semibold'>
                  {course.numReviews} reviews
                </p>
                <Rating
                  value={Number(course.rating)}
                  precision={0.5}
                  readOnly
                  variant='yellow'
                />
              </div>
            </div>
            {/* course info */}
            <div className='space-y-6 mt-10'>
              <h3 className='text-3xl md:text-4xl max-w-md font-medium '>
                {course.title}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 max-w-2xl'>
                {course.description}
              </p>
              {/* Sections & Lessons */}
            </div>
            <Separator
              orientation='horizontal'
              className='block md:hidden my-6'
            />
          </div>
          {/* Right side */}
          <aside className='md:col-span-2 md:pt-2 space-y-6'>
            {/* Price */}
            <div className='flex flex-row items-center justify-start gap-1 font-semibold mb-8'>
              <span className='dirham-symbol !text-3xl '>&#xea;</span>
              <span className='text-3xl md:text-4xl'>
                {course.salePrice ? course.salePrice : course.price}
              </span>
            </div>
            <div className='flex flex-row items-center gap-3 text-sm'>
              <ClipboardClock size={18} />
              <span className='text-gray-400'>Lessons:</span>
              <p className='font-medium'>12</p>
            </div>
            <div className='flex flex-row items-center gap-3 text-sm'>
              <ChartNoAxesColumn size={18} />
              <span className='text-gray-400'>Difficulty:</span>
              <p className='font-medium'>{course.difficulty}</p>
            </div>
            <div className='flex flex-row items-center gap-3 text-sm'>
              <Users size={18} />
              <span className='text-gray-400'>Students:</span>
              <p className='font-medium'>{course.users.length}</p>
            </div>
            <div className='flex flex-row items-center gap-3 text-sm'>
              <TimerIcon size={18} />
              <span className='text-gray-400'>Duration:</span>
              <p className='font-medium'>
                {`${(course.duration / 60).toFixed(0)}h`}{' '}
                {`${course.duration % 60}m`}
              </p>
            </div>
            <div className='flex flex-row items-center gap-3'>
              <EnrollCourseBtn course={course} cart={cart} />
              {/* Instructor */}
              <InstructorInfoDialog instructor={sampleInstructors[0]} />
            </div>
            <Separator orientation='horizontal' className=' my-6' />
            <div className='flex flex-col gap-2'>
              <h4 className='text-xs text-gray-400  font-medium'>
                PREREQUISITES
              </h4>
              <p>{course.prequisites}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default CourseDetailsPage;
