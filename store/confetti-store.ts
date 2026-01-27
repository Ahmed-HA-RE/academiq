import { create } from 'zustand';

type ConfettiStore = {
  showConfetti: boolean;
  setShowConfetti: (value: boolean) => void;
};

const useConfettiStore = create<ConfettiStore>((set) => ({
  showConfetti: false,
  setShowConfetti: (value) => set(() => ({ showConfetti: value })),
}));

export default useConfettiStore;
