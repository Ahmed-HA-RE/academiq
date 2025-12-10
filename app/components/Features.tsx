import {
  CalendarRangeIcon,
  NotebookPen,
  MessageCircleMore,
  MessagesSquare,
  Clock4,
  Pencil,
} from 'lucide-react';
import { MotionPreset } from './ui/motion-preset';
import Image from 'next/image';

const leftSection = [
  {
    icon: CalendarRangeIcon,
    title: 'Easy Learning Onboarding',
    description:
      'Guide students step by step from their first signup to their first lesson with a smooth, simple onboarding experience.',
  },
  {
    icon: NotebookPen,
    title: 'Interactive Lessons',
    description:
      'Step-by-step lessons designed to help students grasp concepts fully and retain knowledge effectively.',
  },
  {
    icon: MessageCircleMore,
    title: 'Mentor Support',
    description:
      'Direct communication with mentors to clarify doubts and ensure complete understanding.',
  },
];

const rightSection = [
  {
    icon: MessagesSquare,
    title: 'Student Group Support',
    description:
      'Join WhatsApp groups to connect, share, and learn together with peers.',
  },
  {
    icon: Clock4,
    title: 'Updated Courses',
    description:
      'Access courses with the latest curriculum to stay current and ahead.',
  },
  {
    icon: Pencil,
    title: 'Quizzes & Tests',
    description:
      'Take quizzes to ensure you fully understand and master each course.',
  },
];

const Features = () => {
  return (
    <section className='my-16 md:my-25'>
      <div className='flex flex-col gap-16 container'>
        {/* Top content */}
        <div className='space-y-4 text-center'>
          <MotionPreset
            component='h2'
            className='text-2xl font-semibold md:text-3xl lg:text-4xl'
            fade
            slide={{ direction: 'up', offset: 50 }}
            blur
            transition={{ duration: 0.5 }}
          >
            Structured learning for{' '}
            <span className='relative z-10'>
              real understanding
              <span
                className='bg-primary absolute bottom-0 left-0 -z-10 h-px w-full max-sm:hidden'
                aria-hidden='true'
              />
            </span>{' '}
            solution!
          </MotionPreset>
          <MotionPreset
            component='p'
            className='text-muted-foreground text-xl'
            fade
            slide={{ direction: 'up', offset: 50 }}
            blur
            delay={0.3}
            transition={{ duration: 0.5 }}
          >
            Step-by-step lessons focused on clarity, consistency, and real
            understanding.
          </MotionPreset>
        </div>
        {/* Content */}
        <div className='grid grid-cols-1 items-center gap-16 max-md:gap-9 md:grid-cols-2 lg:grid-cols-3'>
          <div className='max-md:rotatat w-full space-y-9 max-lg:order-2 max-lg:mx-auto max-lg:max-w-100'>
            {leftSection.map((items, index) => {
              const IconComponent = items.icon;

              return (
                <MotionPreset
                  component='div'
                  key={items.title}
                  className='flex items-center gap-4 max-lg:justify-end'
                  fade
                  slide={{ direction: 'down', offset: 50 }}
                  blur
                  delay={0.4 * index + 1.5}
                  transition={{ duration: 0.5 }}
                >
                  <div className='border-primary/60 dark:border-primary bg-primary/2 flex size-16 shrink-0 items-center justify-center rounded-md border lg:hidden'>
                    <IconComponent className='size-8 stroke-[1.5]' />
                  </div>
                  <div className='space-y-2 lg:text-right'>
                    <h4 className='text-lg font-semibold text-nowrap'>
                      {items.title}
                    </h4>
                    <p className='text-muted-foreground text-sm'>
                      {items.description}
                    </p>
                  </div>
                  <div className='border-primary/60 dark:border-primary bg-primary/2 flex size-16 shrink-0 items-center justify-center rounded-md border max-lg:hidden'>
                    <IconComponent className='size-8 stroke-[1.5]' />
                  </div>
                </MotionPreset>
              );
            })}
          </div>
          <MotionPreset
            component='div'
            className='max-lg:order-1 md:max-lg:col-span-2'
            fade
            blur
            delay={0.6}
            transition={{ duration: 0.9 }}
          >
            <Image
              src='https://res.cloudinary.com/ahmed--dev/image/upload/v1765132165/kid_1_ri2lbc.jpg'
              alt='kid studying'
              width={0}
              height={0}
              sizes='100vw'
              loading='eager'
              className='mx-auto size-110 md:h-147.5 rounded-2xl object-cover'
            />
          </MotionPreset>
          <div className='w-full space-y-9 max-lg:order-3 max-lg:mx-auto max-lg:max-w-100'>
            {rightSection.map((items, index) => {
              const IconComponent = items.icon;
              const leftSectionDelay =
                0.4 * (leftSection.length - 1) + 1.5 + 0.5;

              return (
                <MotionPreset
                  component='div'
                  key={items.title}
                  className='flex items-center gap-4'
                  fade
                  slide={{ direction: 'down', offset: 50 }}
                  blur
                  delay={leftSectionDelay + 0.4 * index}
                  transition={{ duration: 0.5 }}
                >
                  <div className='border-primary/60 dark:border-primary bg-primary/2 flex size-16 shrink-0 items-center justify-center rounded-md border'>
                    <IconComponent className='size-8 stroke-[1.5]' />
                  </div>
                  <div className='space-y-2'>
                    <h4 className='text-lg font-semibold'>{items.title}</h4>
                    <p className='text-muted-foreground text-sm'>
                      {items.description}
                    </p>
                  </div>
                </MotionPreset>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
