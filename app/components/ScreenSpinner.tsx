'use client';
import ClipLoader from 'react-spinners/ClipLoader';
import PulseLoader from 'react-spinners/PulseLoader';
import { RemoveScroll } from 'react-remove-scroll';

const ScreenSpinner = ({ mutate }: { mutate?: boolean }) => {
  return mutate ? (
    <RemoveScroll>
      <div className='fixed z-10 inset-0 backdrop-blur-lg flex items-center justify-center'>
        <PulseLoader color='currentColor' margin={8} size={27} />
      </div>
    </RemoveScroll>
  ) : (
    <div className='flex flex-col items-center justify-center min-h-[100vh]'>
      <ClipLoader
        color='currentColor'
        size={170}
        cssOverride={{
          borderWidth: '3px',
        }}
      />
    </div>
  );
};

export default ScreenSpinner;
