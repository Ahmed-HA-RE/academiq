'use client';
import { TEACHING_CATEGORIES } from '@/lib/constants';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { throttle, useQueryState } from 'nuqs';

const CategoriesFilter = () => {
  const [, setCategory] = useQueryState('category', {
    shallow: false,
    defaultValue: 'All',
    limitUrlUpdates: throttle(300),
  });

  return (
    <Tabs className='w-full mb-8' defaultValue='all'>
      <TabsList className='w-full h-auto border-b-2 border-[#BACAC7] rounded-none bg-transparent p-0 flex gap-4'>
        {TEACHING_CATEGORIES.map((category) => (
          <TabsTrigger
            key={category}
            className='relative text-primary rounded-none py-2 after:absolute after:inset-x-0 after:-bottom-[2.5px] after:h-[3px] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary text-base'
            value={category.toLowerCase()}
            onClick={() => setCategory(category)}
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoriesFilter;
