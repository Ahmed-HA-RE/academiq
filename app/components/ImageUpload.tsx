'use client';

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react';

import { useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/app/components/ui/button';
import Image from 'next/image';
import { ControllerFieldState } from 'react-hook-form';
import { Input } from './ui/input';
import { useEffect } from 'react';

const ImageUpload = ({
  onChange,
  fieldState,
}: {
  onChange: (file: File | undefined) => void;
  fieldState: ControllerFieldState;
}) => {
  const maxSizeMB = 10;
  const maxSize = maxSizeMB * 1024 * 1024; // 10MB default

  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: 'image/png,image/jpeg,image/jpg image/webp',
    maxSize,
  });
  const previewUrl = files[0]?.preview || null;
  const _fileName = files[0]?.file.name || null;

  useEffect(() => {
    if (files[0]?.file) {
      onChange(files[0]?.file as File);
    } else {
      onChange(undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <div className='relative'>
      {/* Drop area */}
      <div
        className='relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50 aria-invalid:border-destructive aria-invalid:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40'
        data-dragging={isDragging || undefined}
        aria-invalid={fieldState.invalid || undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Input
          {...getInputProps()}
          aria-label='Upload image file '
          className='sr-only'
        />
        {previewUrl ? (
          <div className='absolute inset-0 flex items-center justify-center p-4'>
            <Image
              alt={files[0]?.file?.name || 'Uploaded image'}
              className='mx-auto max-h-full w-full rounded object-contain'
              width={0}
              height={0}
              sizes='100vw'
              src={previewUrl}
            />
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
            <div
              aria-hidden='true'
              className='mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background'
            >
              <ImageIcon className='size-4 opacity-60' />
            </div>
            <p className='mb-1.5 font-medium text-sm'>Drop your image here</p>
            <p className='text-muted-foreground text-xs'>
              PNG, JPG, WEBP (max. {maxSizeMB}MB)
            </p>
            <Button
              className='mt-4 hover:text-0 cursor-pointer'
              onClick={openFileDialog}
              variant='outline'
              type='button'
            >
              <UploadIcon
                aria-hidden='true'
                className='-ms-1 size-4 opacity-60'
              />
              Select image
            </Button>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className='absolute top-4 right-4'>
          <button
            aria-label='Remove image'
            className='z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'
            onClick={() => removeFile(files[0]?.id)}
            type='button'
          >
            <XIcon aria-hidden='true' className='size-4' />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
