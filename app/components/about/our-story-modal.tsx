'use client';
import { Button } from '../ui/button';
import { PlayIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { VisuallyHidden } from 'radix-ui';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

const AboutOurStoryModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='icon-lg'
          className='bg-lime-500 dark:bg-lime-500 text-primary rounded-full cursor-pointer hover:bg-lime-600 dark:hover:bg-lime-600 focus:ring-2 focus:ring-lime-400'
          aria-label='Play video'
        >
          <PlayIcon className='text-white' />
        </Button>
      </DialogTrigger>
      <DialogContent className='gap-8 p-0 border-0 flex h-[calc(50vh-2rem)] min-w-[calc(50vw-2rem)] flex-col justify-between'>
        <DialogHeader className='hidden'>
          <VisuallyHidden.Root>
            <DialogTitle> Our Story </DialogTitle>
            <DialogDescription></DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        <MediaPlayer
          className='h-full'
          title='Meet Our CEO'
          src='/videos/our-story-intro.mp4'
        >
          <MediaProvider />
          <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
      </DialogContent>
    </Dialog>
  );
};

export default AboutOurStoryModal;
