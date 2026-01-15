'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { MotionPreset } from './ui/motion-preset';

const CTA = () => {
  return (
    <section className='section-spacing'>
      <MotionPreset
        component='div'
        className='container'
        fade
        slide={{ direction: 'up', offset: 50 }}
        blur
        transition={{ duration: 0.8 }}
      >
        <Card className='rounded-3xl border-none py-10 shadow-none sm:py-16 lg:py-24 bg-[url(/images/cta-image.png)] bg-cover bg-center bg-no-repeat 2xl:scale-130'>
          <CardContent className='flex flex-col items-center justify-between gap-8 px-8 sm:px-16 xl:px-24'>
            <div className='flex-1/2'>
              <h2 className='text-3xl text-center md:text-5xl font-bold text-black'>
                Start Learning Anytime, Anywhere
              </h2>
            </div>
            <div className='flex flex-col md:flex-row items-center justify-center gap-x-6 gap-y-3 w-full'>
              <Button
                asChild
                size={'lg'}
                className='p-6 rounded-full w-full md:w-[150px] max-w-xs text-base bg-black text-white hover:bg-0'
              >
                <Link href={'/prices'}>View Prices</Link>
              </Button>
              <Button
                asChild
                size={'lg'}
                className='px-6 py-6 hover:bg-0 rounded-full w-full max-w-xs text-base md:w-[150px] bg-rose-400 text-white hover:bg-0'
              >
                <Link href={'/courses'}>View Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </MotionPreset>
    </section>
  );
};

export default CTA;
