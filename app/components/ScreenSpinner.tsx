'use client';
import { RotatingLines } from 'react-loader-spinner';

const ScreenSpinner = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[75vh]'>
      <RotatingLines
        visible={true}
        height='170'
        width='170'
        color='currentColor'
        strokeWidth='5'
        animationDuration='0.75'
        ariaLabel='rotating-lines-loading'
        wrapperStyle={{}}
        wrapperClass=''
      />
    </div>
  );
};

export default ScreenSpinner;
