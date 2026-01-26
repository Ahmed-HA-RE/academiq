import MyCourseSideBarDetails from '@/app/components/my-courses/MyCourseSideBarDetails';
import CourseUserProgress from '@/app/components/shared/CourseUserProgress';
import ProfileDropdown from '@/app/components/shared/ProfileDropdown';
import Theme from '@/app/components/Theme';
import { Accordion } from '@/app/components/ui/accordion';
import { Button } from '@/app/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from '@/app/components/ui/sidebar';
import {
  getMyCourseBySlug,
  getUserCourseProgress,
} from '@/lib/actions/my-course/getMyCourse';
import { auth } from '@/lib/auth';
import { APP_NAME } from '@/lib/constants';
import { ArrowLeftIcon, Library } from 'lucide-react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CSSProperties } from 'react';

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;

  const course = await getMyCourseBySlug(slug);

  return {
    title: course.title,
    description: `Continue your learning journey with ${course.title} on ${APP_NAME}.`,
    openGraph: {
      title: course.title,
      description: `Continue your learning journey with ${course.title} on ${APP_NAME}.`,
      images: [
        {
          url: course.image,
          width: 800,
          height: 600,
          alt: course.title,
        },
      ],
      siteName: APP_NAME,
    },
  };
};

type CourseLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const CourseLayout = async ({ children, params }: CourseLayoutProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { slug } = await params;

  if (!slug) {
    return redirect('/my-courses');
  }

  const course = await getMyCourseBySlug(slug);

  if (!course) {
    return redirect('/my-courses');
  }

  const userProgress = await getUserCourseProgress(course.id);

  return (
    <div className='min-h-screen flex flex-col w-full relative overflow-hidden'>
      {/* Midnight Radial Glow Background */}
      <div
        className='absolute inset-0 z-0 hidden dark:block'
        style={{
          background: `
            radial-gradient(circle at 50% 50%, 
              rgba(226, 232, 240, 0.2) 0%, 
              rgba(226, 232, 240, 0.1) 25%, 
              rgba(226, 232, 240, 0.05) 35%, 
              transparent 50%
            )
          `,
        }}
      />
      <div className='flex min-h-dvh w-full'>
        <SidebarProvider
          style={
            {
              '--sidebar-width': '24rem',
            } as CSSProperties
          }
          mobileSidebarWidth='70%'
        >
          <Sidebar className='flex-1/2'>
            <SidebarHeader className='gap-4 border-b py-4 px-1 sm:p-4'>
              {/* Back to libray + Theme */}
              <div className='flex items-center justify-between w-full'>
                <Button
                  className='cursor-pointer text-sm'
                  variant='ghost'
                  asChild
                >
                  <Link href='/my-courses'>
                    <ArrowLeftIcon className='size-4' />
                    <Library className='size-5' />
                    Courses Library
                  </Link>
                </Button>
                <Theme />
              </div>
              {/* Course title */}
              <h3 className='text-xl font-bold px-3 text-left'>
                {course.title}
              </h3>
              {/* Course Progression */}
              <div className='px-3'>
                <CourseUserProgress userProgress={userProgress} />
              </div>
            </SidebarHeader>
            <SidebarContent className='py-3 px-2'>
              <Accordion type='multiple' className='w-full space-y-2'>
                {course.sections.map((section, index) => (
                  <MyCourseSideBarDetails
                    key={section.id}
                    section={section}
                    index={index}
                    courseSlug={course.slug}
                  />
                ))}
              </Accordion>
            </SidebarContent>
            <SidebarFooter className='px-4 py-3.5'>
              <div className='flex items-center gap-2'>
                <Image
                  className='[&_rect]:fill-sidebar [&_rect:first-child]:fill-primary size-6'
                  src={'/images/logo.png'}
                  alt='Logo'
                  width={24}
                  height={24}
                />
                <span className='text-sm font-medium'>{APP_NAME}</span>
              </div>
            </SidebarFooter>
          </Sidebar>
          <div className='flex flex-1 flex-col'>
            <header className='bg-card sticky top-0 z-50 h-14 border-b'>
              <div className='flex h-full  items-center justify-between gap-6 px-4 sm:px-6  w-full'>
                <SidebarTrigger className='[&_svg]:!size-5' />
                <ProfileDropdown session={session} />
              </div>
            </header>
            <main className='mx-auto size-full flex-1'>{children}</main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default CourseLayout;
