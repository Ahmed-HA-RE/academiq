'use client';

import useConfettiStore from '@/store/confetti-store';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const ConfettiWrapper = () => {
  const { width, height } = useWindowSize();
  const showConfetti = useConfettiStore((state) => state.showConfetti);
  const setShowConfetti = useConfettiStore((state) => state.setShowConfetti);

  if (!showConfetti) return null;

  return (
    <ReactConfetti
      numberOfPieces={700}
      className='z-50 pointer-events-none'
      width={width}
      recycle={false}
      onConfettiComplete={() => {
        setShowConfetti(false);
      }}
      height={height}
    />
  );
};

export default ConfettiWrapper;
