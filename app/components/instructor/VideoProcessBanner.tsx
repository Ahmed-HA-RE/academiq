'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

const VideoProcessBanner = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  return (
    pathname === '/instructor-dashboard/courses/new' &&
    isVisible && (
      <div className='bg-yellow-500 dark:bg-yellow-600 py-3'>
        <div className='mx-auto max-w-7xl px-4 lg:text-center text-sm text-white sm:px-6 lg:px-8 flex items-center justify-between gap-6'>
          <p>
            Note: Uploading video may take a few minutes depending on your
            internet connection or video size. Lesson will not be visible to
            students until processing is complete.
          </p>
          <Button
            variant={'ghost'}
            size='icon'
            onClick={() => setIsVisible(false)}
            className='cursor-pointer hover:bg-0 hover:text-white '
          >
            <X />
          </Button>
        </div>
      </div>
    )
  );
};

export default VideoProcessBanner;
