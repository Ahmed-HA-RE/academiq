import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { MotionPreset } from './ui/motion-preset';

const CTA = () => {
  return (
    <section className='mb-16'>
      <MotionPreset
        component='div'
        className='container'
        fade
        slide={{ direction: 'right', offset: 50 }}
        blur
        transition={{ duration: 0.8 }}
      >
        <Card className='rounded-3xl border-none py-8 shadow-lg sm:py-16 lg:py-24 bg-muted'>
          <CardContent className='flex flex-wrap items-center justify-between gap-8 px-8 sm:flex-nowrap sm:px-16 lg:px-24'>
            <div className='max-w-xs lg:max-w-lg'>
              <h2 className='mb-4 text-3xl font-bold'>
                Start Learning Anytime, Anywhere
              </h2>
              <p className='text-muted-foreground text-lg font-medium'>
                Browse our courses and pricing, and learn at your own pace from
                any device, whenever it fits your schedule.
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-6 md:justify-end'>
              <Button asChild size={'lg'} className='p-6 text-base'>
                <Link href={'/prices'}>View Prices</Link>
              </Button>
              <Button
                asChild
                size={'lg'}
                className='px-6 py-6 text-base'
                variant='outline'
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
