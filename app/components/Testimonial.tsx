'use client';
import { Badge } from '@/app/components/ui/badge';

import { MotionPreset } from '@/app/components/ui/motion-preset';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import { testimonials } from '@/lib/constants';
import { Card, CardContent } from '@/app/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/app/components/ui/separator';
import { Rating } from '@/app/components/ui/rating';
import { cn } from '@/lib/utils';

const Testimonial = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleResize = () => {
      setCount(api.scrollSnapList().length);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    // ignore  eslint-disable-next-line react-hooks/exhaustive-deps
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [api]);
  return (
    <section className='bg-gray-50 dark:bg-accent py-4 mt-16'>
      <div className='container space-y-10 md:space-y-16 lg:space-y-24 lg:px-8'>
        {/* Left Content */}
        <div className='space-y-4 text-center'>
          <MotionPreset
            fade
            blur
            slide={{ direction: 'down', offset: 50 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant='outline' className='text-sm font-normal'>
              Student Feedback
            </Badge>
          </MotionPreset>

          <MotionPreset
            component='h2'
            className='text-2xl font-semibold sm:text-3xl lg:text-4xl'
            fade
            blur
            delay={0.2}
            slide={{ direction: 'down', offset: 50 }}
            transition={{ duration: 0.6 }}
          >
            What Our Students Say
          </MotionPreset>

          <MotionPreset
            component='p'
            className='text-muted-foreground text-xl'
            fade
            blur
            delay={0.4}
            slide={{ direction: 'down', offset: 50 }}
            transition={{ duration: 0.6 }}
          >
            Read experiences from students who have learned, grown, and
            succeeded with our courses.
          </MotionPreset>
        </div>

        <MotionPreset
          delay={0.8}
          slide={{ direction: 'down', offset: 50 }}
          fade
          blur
          transition={{ duration: 0.6 }}
        >
          <div className='space-y-10'>
            <Carousel
              opts={{
                align: 'start',
              }}
              setApi={setApi}
            >
              <CarouselContent className='sm:-ml-6'>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className='sm:pl-6 lg:basis-1/2'>
                    <Card className='h-full rounded-lg shadow-none'>
                      <CardContent className='flex items-center gap-6 max-sm:flex-col lg:max-xl:flex-col'>
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={0}
                          height={0}
                          sizes='100vw'
                          className='size-63.5 rounded-md object-cover'
                        />
                        <div className='flex-1 space-y-4'>
                          <div className='space-y-1'>
                            <h4 className='font-semibold'>
                              {testimonial.name}
                            </h4>
                            <p className='text-muted-foreground text-sm'>
                              {testimonial.role} at{' '}
                              <span className='text-card-foreground font-semibold'>
                                {testimonial.company}
                              </span>
                            </p>
                          </div>
                          <Separator />
                          <div className='space-y-2'>
                            <Rating
                              readOnly
                              variant='yellow'
                              size={24}
                              value={testimonial.rating}
                              precision={0.5}
                            />
                            <p className='text-muted-foreground'>
                              {testimonial.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                variant='default'
                className='disabled:bg-secondary disabled:text-primary absolute top-1/2 left-0 size-9 -translate-y-1/2 cursor-pointer rounded-full disabled:opacity-100 md:-left-4'
              />
              <CarouselNext
                variant='default'
                className='disabled:bg-secondary disabled:text-primary absolute top-1/2 right-0 size-9 -translate-y-1/2 cursor-pointer rounded-full disabled:opacity-100 md:-right-4'
              />
            </Carousel>

            <div className='flex items-center justify-center gap-1'>
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    'size-2.5 cursor-pointer rounded-full transition-colors',
                    index === current ? 'bg-primary' : 'bg-primary/20'
                  )}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </MotionPreset>
      </div>
    </section>
  );
};

export default Testimonial;
