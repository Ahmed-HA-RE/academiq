import Image from 'next/image';
import { Card, CardContent, CardFooter } from '../ui/card';
import { ImQuotesLeft } from 'react-icons/im';
import { Suspense } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { APP_NAME } from '@/lib/constants';

const AboutCEOWords = () => {
  return (
    <div className='absolute -bottom-70 md:-bottom-62 lg:-bottom-47 left-1/2 -translate-x-1/2 w-full max-w-sm z-10 max-sm:px-4'>
      <Card className='shadow-xl relative rounded-xs gap-8'>
        <div className='absolute -top-10 left-2 '>
          <ImQuotesLeft className='size-20 text-lime-400 dark:text-lime-500' />
        </div>
        <CardContent className='mt-8 px-4'>
          <h4 className='text-slate-700 dark:text-white font-light text-xl'>
            I founded Academiq to make learning accessible and meaningful,
            connecting instructors and learners worldwide to share knowledge and
            grow skills.
          </h4>
        </CardContent>
        <CardFooter className='flex items-center gap-4 font-normal'>
          <div>
            <Avatar className='size-12 rounded-full object-cover'>
              <Suspense fallback={<AvatarFallback>CEO</AvatarFallback>}>
                <Image
                  src={'/images/team/ceo.jpg'}
                  alt='Logo'
                  width={90}
                  height={90}
                  className='object-cover'
                />
              </Suspense>
            </Avatar>
          </div>
          <div className='flex flex-1 flex-col items-start'>
            <span className='text-slate-700 dark:text-white text-sm font-semibold'>
              Alex Johnson
            </span>
            <span className='text-muted-foreground text-xs'>
              Founder of {APP_NAME}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AboutCEOWords;
