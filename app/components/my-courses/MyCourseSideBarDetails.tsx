'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Section } from '@/types';
import { cn, NestedOmit } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { CirclePlayIcon } from 'lucide-react';
import Link from 'next/link';

const MyCourseSideBarDetails = ({
  section,
  index,
  courseSlug,
}: {
  section: NestedOmit<Section, 'lessons.muxData'>;
  index: number;
  courseSlug: string;
}) => {
  const pathname = usePathname();

  const isActive = (sectionId: string, lessonId: string) => {
    return pathname === `/my-courses/${courseSlug}/${sectionId}/${lessonId}`;
  };

  return (
    <AccordionItem
      key={index}
      value={section.id}
      className='rounded-md border-b-0 data-[state=open]:bg-gray-100 data-[state=open]:dark:bg-black/18 hover:bg-gray-100 hover:dark:bg-black/18 data-[state=open]:hover:bg-0 transition'
    >
      <AccordionTrigger className='px-3 pb-4 [&>svg]:rotate-180 [&[data-state=open]>svg]:rotate-0 hover:no-underline cursor-pointer'>
        <div className='flex items-center gap-5'>
          {/* Section number + Section Title + Lessons count */}
          <span className='text-muted-foreground'>
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </span>
          <div className='flex flex-col gap-1'>
            <span>{section.title}</span>
            <span className='text-muted-foreground text-xs'>
              {section.lessons.length}{' '}
              {section.lessons.length === 1 ? 'Lesson' : 'Lessons'}
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className='flex flex-col gap-1'>
        {section.lessons.map((lesson) => (
          <Link
            href={`/my-courses/${courseSlug}/${section.id}/${lesson.id}`}
            key={lesson.id}
            className={cn(
              'flex items-center gap-8 hover:bg-gray-200 hover:dark:bg-muted px-6 py-2 transition',
              isActive(section.id, lesson.id) &&
                'bg-gray-200 dark:bg-muted border-l-2 border-gray-500 dark:border-white',
            )}
          >
            <span className='text-muted-foreground'>{lesson.position}</span>
            <div className={cn('flex items-center gap-4')}>
              <CirclePlayIcon className='size-4' />
              <span className='text-sm'>{lesson.title}</span>
            </div>
          </Link>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default MyCourseSideBarDetails;
