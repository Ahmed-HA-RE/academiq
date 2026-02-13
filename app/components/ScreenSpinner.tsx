'use client';
import { RemoveScroll } from 'react-remove-scroll';

const ScreenSpinner = ({
  mutate,
  text,
}: {
  mutate?: boolean;
  text?: string;
}) => {
  return mutate ? (
    <RemoveScroll>
      <div className='fixed z-50 inset-0 flex items-center justify-center backdrop-blur-lg dark:bg-gray-900/80 text-black dark:text-white'>
        <div className='mutate-loader'>{text}</div>
      </div>
    </RemoveScroll>
  ) : (
    <div className='flex flex-col items-center justify-center h-[100vh] w-screen bg-white fixed inset-0 z-50'>
      <div className='loader'></div>
    </div>
  );
};

export default ScreenSpinner;
