'use client';

import { APP_NAME } from '@/lib/constants';
import { Input } from '../ui/input';
import { SearchIcon } from 'lucide-react';
import Image from 'next/image';
import { throttle, useQueryState } from 'nuqs';

const CoursesHero = () => {
  const [q, setQ] = useQueryState('q', {
    defaultValue: '',
    shallow: false,
    limitUrlUpdates: throttle(300),
  });

  return (
    <section className='bg-secondary hero-section-spacing px-6'>
      <div className='hero-container flex flex-col items-center justify-center gap-6 bg-foreground rounded-xl relative'>
        <h4 className='text-base uppercase tracking-[3.5px] text-white/95'>
          {APP_NAME}
        </h4>
        <h1 className='text-4xl md:text-4xl lg:text-6xl font-bold text-white'>
          Our Courses
        </h1>
        <p className='text-white/95 max-w-lg text-center'>
          {APP_NAME} offers a variety of courses to help you grow your skills
          and knowledge.
        </p>
        <div className='relative'>
          <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
            <SearchIcon className='size-4 md:size-5' />
            <span className='sr-only'>Search</span>
          </div>
          <Input
            type='search'
            placeholder='Search Courses'
            className='peer px-10 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none border-0 focus-visible:ring-0 shadow-none rounded-md bg-secondary w-full md:w-[400px] h-10 text-base md:h-13 md:!text-lg text-muted-foreground'
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className='absolute top-6 left-10 hidden md:block'>
          <Image
            src={'/svg/courses-hero-icon.svg'}
            alt='Learning'
            width={100}
            height={100}
          />
        </div>
        <div className='absolute bottom-6 right-10 hidden md:block'>
          <Image
            src={'/svg/learning-hero-icon.svg'}
            alt='Learning'
            width={100}
            height={100}
            className='rotate-340'
          />
        </div>
      </div>
    </section>
  );
};

export default CoursesHero;
