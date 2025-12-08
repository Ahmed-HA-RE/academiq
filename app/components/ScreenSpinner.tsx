'use client';
import ClipLoader from 'react-spinners/ClipLoader';

const ScreenSpinner = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[75vh]'>
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
