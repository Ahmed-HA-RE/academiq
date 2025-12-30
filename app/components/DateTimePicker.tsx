'use client';
import { cn, formatDate } from '@/lib/utils';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area';
import { CalendarDays } from 'lucide-react';

export function DateTimePickerForm({
  dateValue,
  onValueChange,
}: {
  dateValue: Date;
  onValueChange: (date: Date) => void;
}) {
  function handleDateSelect(date: Date | undefined) {
    if (date) {
      onValueChange(date);
    }
  }

  function handleTimeChange(type: 'hour' | 'minute' | 'ampm', value: string) {
    const currentDate = dateValue || new Date();
    const newDate = new Date(currentDate);

    if (type === 'hour') {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === 'ampm') {
      const hours = newDate.getHours();
      if (value === 'AM' && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === 'PM' && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    onValueChange(newDate);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full pl-3 text-left font-normal cursor-pointer hover:bg-0',
            !dateValue && 'text-muted-foreground'
          )}
        >
          {dateValue ? (
            formatDate(dateValue, 'dateTime')
          ) : (
            <span>MM/DD/YYYY hh:mm aa</span>
          )}
          <CalendarDays className='ml-auto h-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <div className='sm:flex'>
          <Calendar
            mode='single'
            selected={dateValue}
            onSelect={handleDateSelect}
            autoFocus
          />
          <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
            <ScrollArea className='w-64 sm:w-auto'>
              <div className='flex sm:flex-col p-2'>
                {Array.from({ length: 12 }, (_, i) => i + 1)
                  .reverse()
                  .map((hour) => (
                    <Button
                      key={hour}
                      size='icon'
                      variant={
                        dateValue && dateValue.getHours() % 12 === hour % 12
                          ? 'default'
                          : 'ghost'
                      }
                      className='sm:w-full shrink-0 aspect-square'
                      onClick={() => handleTimeChange('hour', hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation='horizontal' className='sm:hidden' />
            </ScrollArea>
            <ScrollArea className='w-64 sm:w-auto'>
              <div className='flex sm:flex-col p-2'>
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size='icon'
                    variant={
                      dateValue && dateValue.getMinutes() === minute
                        ? 'default'
                        : 'ghost'
                    }
                    className='sm:w-full shrink-0 aspect-square'
                    onClick={() =>
                      handleTimeChange('minute', minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation='horizontal' className='sm:hidden' />
            </ScrollArea>
            <ScrollArea className=''>
              <div className='flex sm:flex-col p-2'>
                {['AM', 'PM'].map((ampm) => (
                  <Button
                    key={ampm}
                    size='icon'
                    variant={
                      dateValue &&
                      ((ampm === 'AM' && dateValue.getHours() < 12) ||
                        (ampm === 'PM' && dateValue.getHours() >= 12))
                        ? 'default'
                        : 'ghost'
                    }
                    className='sm:w-full shrink-0 aspect-square'
                    onClick={() => handleTimeChange('ampm', ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
