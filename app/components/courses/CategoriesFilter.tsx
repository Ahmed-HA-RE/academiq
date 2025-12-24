'use client';

import { useEffect, useState } from 'react';
import { ArrowUpDown, FilterIcon, SearchIcon } from 'lucide-react';
import { useMedia } from 'react-use';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet';
import { Slider } from '@/app/components/ui/slider';
import {
  cn,
  DIFFICULTY_LEVELS,
  PRICE_RANGE,
  SORTING_OPTIONS,
} from '@/lib/utils';
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  throttle,
  useQueryStates,
} from 'nuqs';
import { IoStarSharp } from 'react-icons/io5';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const FilterContent = () => {
  const [filters, setFilters] = useQueryStates(
    {
      q: parseAsString
        .withDefault('')
        .withOptions({ limitUrlUpdates: throttle(300) }),
      rating: parseAsArrayOf(parseAsInteger, '-')
        .withDefault([1, 5])
        .withOptions({
          limitUrlUpdates: throttle(300),
          clearOnDefault: false,
        }),
      price: parseAsString
        .withDefault('')
        .withOptions({ limitUrlUpdates: throttle(300) }),
      difficulty: parseAsArrayOf(parseAsString).withDefault([]),
      sortBy: parseAsString
        .withDefault('')
        .withOptions({ limitUrlUpdates: throttle(300) }),
    },
    {
      shallow: false,
    }
  );

  return (
    <>
      {/* Search */}
      <div className='mt-2 w-full space-y-4 px-4'>
        <Label htmlFor={'search'}>Search</Label>
        <div className='relative'>
          <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
            <SearchIcon className='size-4' />
          </div>
          <Input
            id='search'
            type='search'
            placeholder='Search...'
            className='peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none input'
            value={filters.q}
            onChange={(e) => setFilters({ q: e.target.value })}
          />
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div className='space-y-4 px-4'>
        <Label className='text-xl font-medium'>Rating</Label>
        <div>
          <Slider
            value={filters.rating}
            onValueChange={(e) => setFilters({ rating: e })}
            min={1}
            max={5}
            aria-label='Rating slider'
          />
          <span
            className='mt-4 flex w-full items-center justify-between gap-1'
            aria-hidden='true'
          >
            <span className='flex items-center gap-1'>
              1 <IoStarSharp className='size-4 text-amber-400' />
            </span>
            <span className='flex items-center gap-1'>
              2 <IoStarSharp className='size-4 text-amber-400' />
            </span>
            <span className='flex items-center gap-1'>
              3 <IoStarSharp className='size-4 text-amber-400' />
            </span>
            <span className='flex items-center gap-1'>
              4 <IoStarSharp className='size-4 text-amber-400' />
            </span>
            <span className='flex items-center gap-1'>
              5 <IoStarSharp className='size-4 text-amber-400' />
            </span>
          </span>
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className='space-y-4 px-4'>
        <Select
          value={filters.price}
          onValueChange={(value) => setFilters({ price: value })}
        >
          <Label className='text-xl font-medium'>Price</Label>
          <SelectTrigger
            id={'priceRange'}
            className='w-full cursor-pointer input'
          >
            <SelectValue placeholder='Select a price range' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Price</SelectLabel>
              {PRICE_RANGE.map((price) => (
                <SelectItem
                  key={price.label}
                  value={price.value}
                  className='cursor-pointer'
                >
                  {price.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Difficulty */}
      <div className='space-y-4 px-4'>
        <Label className='text-xl font-medium'>Difficulty</Label>
        {DIFFICULTY_LEVELS.map((level) => (
          <div key={level.value} className='flex items-center gap-2'>
            <Checkbox
              id={level.value}
              className='size-5'
              checked={filters.difficulty.includes(level.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilters({
                    difficulty: [...filters.difficulty, level.value],
                  });
                } else {
                  setFilters({
                    difficulty: filters.difficulty.filter(
                      (lvl) => lvl !== level.value
                    ),
                  });
                }
              }}
            />
            <Label htmlFor={level.value}>{level.label}</Label>
          </div>
        ))}
      </div>

      <Separator />

      {/* Battery */}
      <div className='w-full space-y-2 px-4'>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => setFilters({ sortBy: value })}
        >
          <Label className='text-xl font-medium'>Sort By</Label>

          <SelectTrigger
            id={'sortBy'}
            className='relative w-full pl-9 input cursor-pointer'
          >
            <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 group-has-[select[disabled]]:opacity-50'>
              <ArrowUpDown size={16} aria-hidden='true' />
            </div>
            <SelectValue placeholder='Sort By' />
          </SelectTrigger>
          <SelectContent>
            {SORTING_OPTIONS.map((option) => (
              <SelectItem
                className='cursor-pointer'
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

const CategoriesFilter = () => {
  const [open, setOpen] = useState(false);
  const isCompactScreen = useMedia('(max-width: 767px)', false);

  useEffect(() => {
    if (!isCompactScreen) {
      // ignore eslint-disable-next-line react-hooks/exhaustive-deps
      setOpen(false);
    }
  }, [isCompactScreen]);

  const [filters, setFilters] = useQueryStates(
    {
      q: parseAsString
        .withDefault('')
        .withOptions({ limitUrlUpdates: throttle(300) }),
      rating: parseAsInteger.withDefault(0),
      price: parseAsString
        .withDefault('')
        .withOptions({ limitUrlUpdates: throttle(300) }),
      difficulty: parseAsArrayOf(parseAsString).withDefault([]),
      sortBy: parseAsString
        .withDefault('')
        .withOptions({ limitUrlUpdates: throttle(300) }),
    },
    {
      shallow: false,
    }
  );

  return (
    <>
      {/* Mobile Filter Trigger */}
      <div className='mb-4 md:hidden w-full col-span-7'>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant='outline'
              className='w-full text-base md:hidden cursor-pointer'
            >
              <FilterIcon />
              Filter
            </Button>
          </SheetTrigger>

          <SheetContent
            side='left'
            className='w-[300px] gap-6 overflow-y-auto sm:w-[400px]'
          >
            <SheetHeader className='pb-0'>
              <SheetTitle className='text-xl flex flex-row justify-between items-center mt-10'>
                <p>Filter</p>
                <Button
                  onClick={() => setFilters(null)}
                  variant='link'
                  className='p-0 text-base cursor-pointer'
                  disabled={
                    filters.q === '' &&
                    filters.rating === 0 &&
                    filters.price === '' &&
                    filters.difficulty.length === 0 &&
                    filters.sortBy === ''
                  }
                >
                  Clear All
                </Button>
              </SheetTitle>
            </SheetHeader>
            <div className='space-y-6 px-0'>
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <aside className='col-span-3 lg:col-span-2 w-full'>
        {/* Desktop Filter Card */}
        <Card className={cn('w-full hidden py-4 shadow-none md:inline-flex')}>
          <CardHeader className='gap-0 px-4'>
            <CardTitle className='text-2xl flex flex-row items-center justify-between gap-2'>
              <div className='flex flex-row items-center gap-2'>
                <FilterIcon />
                Filter
              </div>
              <Button
                onClick={() => setFilters(null)}
                variant='link'
                className='p-0 text-base cursor-pointer'
                disabled={
                  filters.q === '' &&
                  filters.rating === 0 &&
                  filters.price === '' &&
                  filters.difficulty.length === 0 &&
                  filters.sortBy === ''
                }
              >
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6 px-0'>
            <FilterContent />
          </CardContent>
        </Card>
      </aside>
    </>
  );
};

export default CategoriesFilter;
