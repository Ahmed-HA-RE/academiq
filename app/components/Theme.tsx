'use client';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toggle } from './ui/toggle';

const Theme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Toggle
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className='group size-9 data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted mr-2'
      onPressedChange={() =>
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
      }
      pressed={theme === 'dark'}
      variant='default'
    >
      <MoonIcon
        aria-hidden='true'
        className='shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100'
        size={16}
      />
      <SunIcon
        aria-hidden='true'
        className='absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0'
        size={16}
      />
    </Toggle>
  );
};

export default Theme;
