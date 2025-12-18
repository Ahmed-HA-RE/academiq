'use client';

import { SearchIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { parseAsString, throttle, useQueryState } from 'nuqs';

const Search = () => {
  const [search, seSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({
      shallow: false,
      limitUrlUpdates: throttle(500),
    })
  );

  return (
    <div className='*:not-first:mt-2 flex-1/2 sm:w-full sm:max-w-xs md:max-w-md'>
      <div className='relative'>
        <Input
          className='peer ps-9 h-9 input rounded-full placeholder:text-sm text-sm'
          placeholder='Search for a course'
          type='search'
          value={search}
          onChange={(e) => seSearch(e.target.value)}
        />
        <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50'>
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
};

export default Search;
