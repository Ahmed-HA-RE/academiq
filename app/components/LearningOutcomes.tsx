import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Image from 'next/image';
import { MotionPreset } from '@/app/components/ui/motion-preset';
import Link from 'next/link';
import { LEARNING_OUTCOMES } from '@/lib/constants';

const LearningOutcomes = () => {
  return (
    <section className='section-spacing bg-blue-50 dark:bg-blue-900/30'>
      <div className='container'>
        <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-24'>
          {/* Left content */}
          <div className='space-y-12 lg:space-y-24'>
            <div className='space-y-4'>
              <MotionPreset
                component='h2'
                className='text-2xl font-semibold md:text-3xl lg:text-4xl'
                fade
                slide={{ direction: 'up', offset: 50 }}
                transition={{ duration: 0.45 }}
              >
                Meet your learning platform, built for real skills and real
                progress
              </MotionPreset>
              <MotionPreset
                component='p'
                className='text-muted-foreground text-xl'
                fade
                slide={{ direction: 'up', offset: 50 }}
                delay={0.2}
                transition={{ duration: 0.45 }}
              >
                Using modern technology to make learning clearer, practical, and
                career focused.
              </MotionPreset>
              <MotionPreset
                fade
                slide={{ direction: 'up', offset: 50 }}
                delay={0.4}
                transition={{ duration: 0.45 }}
              >
                <Button
                  className='group rounded-lg text-base has-[>svg]:px-6'
                  size='lg'
                  asChild
                >
                  <Link href='/courses'>
                    View Courses
                    <ArrowRightIcon className='transition-transform duration-200 group-hover:translate-x-0.5' />
                  </Link>
                </Button>
              </MotionPreset>
            </div>
            <div className='space-y-3.5'>
              {LEARNING_OUTCOMES.map((outcome, index) => (
                <MotionPreset
                  key={index}
                  className='flex gap-3'
                  fade
                  slide={{ direction: 'up', offset: 50 }}
                  delay={1}
                  transition={{ duration: 0.45 }}
                >
                  <CheckIcon className='text-primary mt-1 size-6 shrink-0' />
                  <p className='text-muted-foreground text-lg'>
                    <span className='text-foreground font-medium'>
                      {outcome.title}
                    </span>
                    : {outcome.description}
                  </p>
                </MotionPreset>
              ))}
            </div>
          </div>

          {/* Right content */}
          <div className='relative flex justify-center max-lg:overflow-hidden max-lg:py-22'>
            {/* Learning Outcome 2 */}
            <MotionPreset
              fade
              motionProps={{
                animate: {
                  y: [0, -16, 0],
                  opacity: 1,
                },
                transition: {
                  y: {
                    duration: 2.1,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: 1.6,
                  },
                  opacity: {
                    duration: 0.5,
                    delay: 1.6,
                  },
                },
              }}
              className='absolute top-0 right-[10%] z-1 w-100 origin-top-right scale-45 max-lg:top-[15%] max-sm:hidden'
            >
              <Image
                src='https://res.cloudinary.com/ahmed--dev/image/upload/v1768549285/ztcivgs3rtvsvyjadbjn.svg'
                alt='learning outcome 2 illustration'
                width={0}
                height={0}
                sizes='100vw'
                className='w-full object-cover'
              />
            </MotionPreset>

            {/* Learning Outcome 1 */}
            <MotionPreset
              fade
              motionProps={{
                animate: {
                  y: [0, -16, 0],
                  opacity: 1,
                },
                transition: {
                  y: {
                    duration: 2.1,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: 1.4,
                  },
                  opacity: {
                    duration: 0.5,
                    delay: 1.4,
                  },
                },
              }}
              className='absolute right-[10%] bottom-0 z-1 w-72 origin-bottom-right scale-60 max-lg:bottom-[15%]'
            >
              <Image
                src='https://res.cloudinary.com/ahmed--dev/image/upload/v1768549285/eyanx5bkmpjzdqaml6en.svg'
                alt='learning outcome 1 illustration'
                width={0}
                height={0}
                sizes='100vw'
                className='z-1 mx-auto w-full'
              />
            </MotionPreset>

            {/* Main Image */}
            <MotionPreset
              className='group relative rounded-full'
              fade
              delay={0.6}
              transition={{ duration: 0.9 }}
            >
              <Image
                src='https://res.cloudinary.com/ahmed--dev/image/upload/v1768549285/vjkrqt2scama00lhf3dh.svg'
                alt='Success illustration'
                width={0}
                height={0}
                sizes='100vw'
                className='z-1 mx-auto w-full h-110 rounded-full lg:h-130'
              />
            </MotionPreset>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningOutcomes;
