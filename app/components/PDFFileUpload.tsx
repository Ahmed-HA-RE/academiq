'use client';

import { PaperclipIcon, UploadIcon, XIcon } from 'lucide-react';

import { formatBytes, useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/app/components/ui/button';
import { useEffect } from 'react';

type PDFFileUploadProps = {
  onChange: (file: File | undefined) => void;
};

const PDFFileUpload = ({ onChange }: PDFFileUploadProps) => {
  const maxSize = 8 * 1024 * 1024; // 8MB default

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
    accept: 'application/pdf',
    maxFiles: 1,
    maxSize,
  });

  const file = files[0];

  useEffect(() => {
    if (file) {
      onChange(file.file as File);
    } else {
      onChange(undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div className='flex flex-col gap-2'>
      {/* Drop area */}
      <div
        className='flex min-h-90 flex-col items-center justify-center rounded-xl border cursor-pointer p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-[input:focus]:border-ring has-disabled:opacity-50 has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50'
        data-dragging={isDragging || undefined}
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role='button'
        tabIndex={-1}
      >
        <input
          {...getInputProps()}
          aria-label='Upload file'
          className='sr-only input'
          disabled={Boolean(file)}
        />

        <div className='flex flex-col items-center justify-center text-center'>
          <div
            aria-hidden='true'
            className='mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background'
          >
            <UploadIcon className='size-4 opacity-100' />
          </div>
          <p className='mb-1.5 font-medium text-sm'>Upload file</p>
          <p className='text-muted-foreground text-xs'>
            Drag & drop or click to browse (max. {formatBytes(maxSize)})
          </p>
        </div>
      </div>

      {/* File list */}
      {file && (
        <div className='space-y-2'>
          <div
            className='flex items-center justify-between gap-2 rounded-xl border px-4 py-2'
            key={file.id}
          >
            <div className='flex items-center gap-3 overflow-hidden'>
              <PaperclipIcon
                aria-hidden='true'
                className='size-4 shrink-0 opacity-60'
              />
              <div className='min-w-0'>
                <p className='truncate font-medium text-[13px]'>
                  {file.file.name}
                </p>
              </div>
            </div>

            <Button
              aria-label='Remove file'
              className='-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground'
              onClick={() => removeFile(files[0]?.id)}
              size='icon'
              variant='ghost'
            >
              <XIcon aria-hidden='true' className='size-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFFileUpload;
