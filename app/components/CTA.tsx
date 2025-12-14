import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { MotionPreset } from './ui/motion-preset';

const CTA = () => {
  return (
    <section className=' bg-blue-50 dark:bg-zinc-900 py-8'>
      <MotionPreset
        component='div'
        className='container'
        fade
        slide={{ direction: 'right', offset: 50 }}
        blur
        transition={{ duration: 0.8 }}
      >
        <Card className='rounded-3xl border-none py-8 shadow-lg sm:py-16 lg:py-24 bg-muted'>
          <CardContent className='flex flex-col lg:flex-row items-start md:items-center justify-between gap-8 px-8 sm:px-16 xl:px-24'>
            <div className='lg:max-w-lg flex-1/2'>
              <h2 className='mb-4 text-2xl md:text-3xl font-bold'>
                Start Learning Anytime, Anywhere
              </h2>
              <p className='text-muted-foreground text-base md:text-lg font-medium'>
                Browse our courses and pricing, and learn at your own pace from
                any device, whenever it fits your schedule.
              </p>
            </div>
            <div className='flex items-start lg:items-center gap-6 lg:justify-end w-full flex-1/3'>
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
