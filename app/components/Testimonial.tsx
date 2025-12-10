'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './ui/carousel';
import { cn } from '@/lib/utils';
import { Rating } from './ui/rating';
import { testimonials } from '@/lib/constants';
import Image from 'next/image';
import { Suspense } from 'react';
import { MotionPreset } from './ui/motion-preset';

const Testimonial = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    // ignore  eslint-disable-next-line react-hooks/exhaustive-deps
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className='bg-gray-50 dark:bg-accent py-4 my-16 md:my-25'>
      <MotionPreset
        component='div'
        className='container space-y-10'
        fade
        slide={{ direction: 'up', offset: 50 }}
        blur
        transition={{ duration: 0.8 }}
      >
        {/* Header Content */}
        <div className='space-y-4 text-center'>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            {' '}
            What Our Students Say
          </h2>
          <p className='text-muted-foreground text-xl'>
            Read experiences from students who have learned, grown, and
            succeeded with our courses.
          </p>
        </div>
        {/* Users Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: 'center',
            loop: true,
          }}
          className='relative flex items-center justify-center gap-6'
        >
          {/* Carousel Previous Button */}
          <CarouselPrevious
            variant='ghost'
            className='static size-9 translate-y-0'
          />

          {/* Carousel Content */}
          <CarouselContent className='ml-0 h-18 items-center'>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className='flex basis-1/2 justify-center pl-0'
              >
                <Avatar
                  className={cn(
                    'size-13 rounded-lg transition-all duration-300',
                    {
                      'size-18': current === index,
                      'size-15.5':
                        current === 0
                          ? index === testimonials.length - 1 ||
                            current + 1 === index
                          : current === testimonials.length - 1
                            ? current - 1 === index || index === 0
                            : current - 1 === index || current + 1 === index,
                    }
                  )}
                >
                  <Suspense
                    fallback={
                      <AvatarFallback className='rounded-lg text-sm'>
                        {testimonial.name
                          .split(' ', 2)
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    }
                  >
                    <Image
                      width={80}
                      height={80}
                      src={testimonial.image}
                      alt={testimonial.name}
                      className='object-cover'
                    />
                  </Suspense>
                  <AvatarImage />
                </Avatar>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Carousel Next Button */}
          <CarouselNext
            variant='ghost'
            className='static size-9 translate-y-0'
          />
        </Carousel>

        {/* Testimonial Details */}
        <Card className='shadow-none'>
          <CardContent className='flex gap-6 max-sm:flex-col sm:items-center'>
            <Avatar className='size-44 rounded-lg'>
              <Suspense
                fallback={
                  <AvatarFallback className='rounded-lg'>
                    {testimonials[current].name
                      .split(' ', 2)
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                }
              ></Suspense>
              <Image
                src={testimonials[current].image}
                alt={testimonials[current].name}
                width={176}
                height={176}
                className='object-cover'
              />
            </Avatar>
            <div className='flex-1 space-y-4'>
              <h3 className='text-xl font-semibold'>
                {testimonials[current].title}
              </h3>
              <p className='text-muted-foreground'>
                {testimonials[current].description}
              </p>
              <hr className='w-20' />
              <div className='flex items-center justify-between gap-6'>
                <div className='space-y-3'>
                  <h4 className='font-medium'>{testimonials[current].name}</h4>
                  <p className='text-muted-foreground text-sm'>
                    {testimonials[current].role} at{' '}
                    <span className='text-card-foreground font-medium'>
                      {testimonials[current].company}
                    </span>
                  </p>
                </div>

                <Rating
                  readOnly
                  variant='yellow'
                  size={24}
                  value={testimonials[current].rating}
                  precision={0.5}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionPreset>
    </section>
  );
};

export default Testimonial;
