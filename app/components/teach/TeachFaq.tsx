import QuestionMark from '@/public/svg/question-mark';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import { MotionPreset } from '@/app/components/ui/motion-preset';
import { faqItems, SERVER_URL } from '@/lib/constants';
import Link from 'next/link';
import { getApplicationByUserId } from '@/lib/actions/instructor';
import { getCurrentLoggedUser } from '@/lib/actions/user';

const TeachFaq = async () => {
  const user = await getCurrentLoggedUser();

  const application = await getApplicationByUserId(user?.id);

  return (
    <section className='from-primary/10 relative overflow-hidden bg-linear-to-b to-transparent to-90% section-spacing'>
      <div className='relative container'>
        <MotionPreset
          fade
          motionProps={{
            animate: {
              y: [0, -16, 0],
              opacity: 1,
            },
            transition: {
              y: {
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 1,
              },
              opacity: {
                duration: 0.5,
                delay: 1,
              },
            },
          }}
          className='text-primary absolute left-0 rotate-15 opacity-70'
        >
          <QuestionMark className='h-27' />
        </MotionPreset>

        <MotionPreset
          fade
          motionProps={{
            animate: {
              y: [0, -20, 0],
              opacity: 1,
            },
            transition: {
              y: {
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 1,
              },
              opacity: {
                duration: 0.5,
                delay: 1,
              },
            },
          }}
          className='text-primary absolute right-5 -rotate-40'
        >
          <QuestionMark />
        </MotionPreset>

        <MotionPreset
          fade
          motionProps={{
            animate: {
              y: [0, -12, 0],
              opacity: 1,
            },
            transition: {
              y: {
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 1.3,
              },
              opacity: {
                duration: 0.5,
                delay: 1.3,
              },
            },
          }}
          className='text-primary absolute bottom-0 left-[20%] -rotate-30 opacity-70 pointer-events-none'
        >
          <QuestionMark className='h-25' />
        </MotionPreset>

        <MotionPreset
          fade
          motionProps={{
            animate: {
              y: [0, -12, 0],
              opacity: 1,
            },
            transition: {
              y: {
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 1.3,
              },
              opacity: {
                duration: 0.5,
                delay: 1.3,
              },
            },
          }}
          className='text-primary absolute right-[30%] bottom-0 pointer-events-none'
        >
          <QuestionMark />
        </MotionPreset>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-24'>
          <MotionPreset
            component='h2'
            className='text-2xl font-semibold sm:text-3xl lg:text-4xl'
            fade
            slide={{ direction: 'up', offset: 50 }}
            transition={{ duration: 0.7 }}
          >
            <span className='relative z-10'>
              Frequently Asked
              <span className='bg-primary absolute bottom-1 left-0 -z-10 h-px w-full'></span>
            </span>
            <span> Questions</span>
          </MotionPreset>
          <MotionPreset
            component='p'
            className='text-muted-foreground text-base sm:text-lg md:text-xl mx-auto max-w-2xl'
            fade
            slide={{ direction: 'up', offset: 50 }}
            delay={0.3}
            transition={{ duration: 0.7 }}
          >
            Find clear answers to common questions about teaching on our
            platform, the application process, and how everything works for
            instructors.
          </MotionPreset>
        </div>

        {/* FAQ Carousel */}
        <MotionPreset
          fade
          slide={{ direction: 'up', offset: 50 }}
          delay={0.6}
          transition={{ duration: 0.7 }}
        >
          <Carousel
            opts={{
              align: 'start',
              slidesToScroll: 1,
              loop: true,
            }}
          >
            <div className='flex items-center gap-6'>
              <CarouselPrevious
                variant='outline'
                className='disabled:bg-primary/10 disabled:text-primary dark:hover:bg-foreground hover:bg-foreground hover:text-primary-foreground static size-9 translate-y-0 rounded-full disabled:opacity-100 cursor-pointer'
              />
              <CarouselContent>
                {faqItems.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className='pl-6 md:basis-1/2 lg:basis-1/3'
                  >
                    <Card className='hover:border-border hover:bg-muted/80 h-full border-transparent bg-transparent shadow-none transition-all duration-300'>
                      <CardContent className='space-y-5 text-center'>
                        <div className='space-y-2'>
                          <h3 className='text-xl font-semibold'>
                            {item.question}
                          </h3>
                          <p className='text-muted-foreground leading-relaxed'>
                            {item.answer}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext
                variant='outline'
                className='disabled:bg-primary/10 disabled:text-primary dark:hover:bg-foreground hover:bg-foreground hover:text-primary-foreground static size-9 translate-y-0 rounded-full disabled:opacity-100 cursor-pointer'
              />
            </div>
          </Carousel>
        </MotionPreset>

        {/* Call to Action */}
        <MotionPreset
          className='relative mt-12 text-center sm:mt-16 z-50'
          fade
          slide={{ direction: 'up', offset: 50 }}
          delay={1.2}
          transition={{ duration: 0.7 }}
        >
          <Button asChild size='lg' className='cursor-pointer'>
            <Link
              href={
                !user
                  ? `/login?callbackUrl=${SERVER_URL}/teach/apply`
                  : application &&
                      application.userId === user.id &&
                      user.role !== 'instructor'
                    ? '/application/status'
                    : application &&
                        application.userId === user.id &&
                        user.role === 'instructor'
                      ? '/instructor-dashboard'
                      : '/teach/apply'
              }
            >
              {!user
                ? 'Please log in to apply'
                : application &&
                    application.userId === user.id &&
                    user.role !== 'instructor'
                  ? 'View Application Status'
                  : application &&
                      application.userId === user.id &&
                      user.role === 'instructor'
                    ? 'Go to Instructor Dashboard'
                    : 'Apply Now'}
            </Link>
          </Button>
        </MotionPreset>
      </div>
    </section>
  );
};

export default TeachFaq;
