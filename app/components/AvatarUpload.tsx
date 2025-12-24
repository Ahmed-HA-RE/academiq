'use client';

import { CircleUserRoundIcon, XIcon } from 'lucide-react';

import { useFileUpload } from '@/hooks/use-file-upload';
import { Button } from './ui/button';
import Image from 'next/image';
import { useEffect } from 'react';

const AvatarUpload = ({
  userImage,
  onChange,
}: {
  userImage: string;
  onChange: (file: File | undefined) => void;
}) => {
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: 'image/*',
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const previewUrl = files[0]?.preview;
  const file = files[0]?.file;

  useEffect(() => {
    if (file) {
      onChange(file as File);
    } else {
      onChange(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div className='flex flex-col items-center'>
      <div className='relative inline-flex'>
        {/* Drop area */}
        <button
          aria-label={previewUrl ? 'Change image' : 'Upload image'}
          className='relative flex size-24 items-center justify-center overflow-hidden rounded-full border border-black/60 dark:border-white outline-none transition-colors hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-disabled:pointer-events-none has-[img]:border-none has-disabled:opacity-50 data-[dragging=true]:bg-accent/50 cursor-pointer'
          data-dragging={isDragging || undefined}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          type='button'
        >
          {previewUrl ? (
            <Image
              alt={files[0]?.file?.name || 'Uploaded image'}
              className='size-full object-cover'
              height={64}
              src={previewUrl}
              style={{ objectFit: 'cover' }}
              width={64}
              loading='eager'
            />
          ) : userImage ? (
            <Image
              alt='User image'
              className='size-full object-cover'
              height={64}
              src={userImage}
              style={{ objectFit: 'cover' }}
              width={64}
              loading='eager'
            />
          ) : (
            <div aria-hidden='true'>
              <CircleUserRoundIcon className='size-6 opacity-75' />
            </div>
          )}
        </button>
        {previewUrl && (
          <Button
            aria-label='Remove image'
            className='-top-1 -right-1 absolute size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background cursor-pointer'
            onClick={() => removeFile(files[0]?.id)}
            size='icon'
            type='button'
          >
            <XIcon className='size-3.5' />
          </Button>
        )}
        <input
          {...getInputProps()}
          aria-label='Upload image file'
          className='sr-only'
          tabIndex={-1}
        />
      </div>
    </div>
  );
};
export default AvatarUpload;
