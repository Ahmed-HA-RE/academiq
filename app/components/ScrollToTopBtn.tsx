'use client';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ArrowUpIcon } from 'lucide-react';

const ScrollToTopBtn = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <Button
      className='cursor-pointer fixed bottom-5 right-[2%] z-40'
      size={'icon-lg'}
      onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUpIcon className='size-5' />
    </Button>
  );
};

export default ScrollToTopBtn;
