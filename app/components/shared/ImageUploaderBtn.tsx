'use client';

import { UploadButton } from '@/lib/uploadthing';
import { UpdateAccountDetails } from '@/types';
import { UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';

type ImageUploaderBtnProps = {
  form: UseFormReturn<UpdateAccountDetails>;
};

const ImageUploaderBtn = ({ form }: ImageUploaderBtnProps) => {
  return (
    <UploadButton
      endpoint={'imageUploader'}
      appearance={{
        button:
          'bg-primary hover:bg-primary-hover text-white font-semibold px-6 ut-ready:rounded-full transition-all duration-200 ease-in-out shadow-sm hover:shadow-md ut-uploading:cursor-not-allowed ut-uploading:rounded-full ut-uploading:opacity-70 text-sm',
        container:
          'flex flex-col gap-2 items-start justify-start w-full max-w-md',
        allowedContent:
          'text-sm text-secondary-foreground mt-1 font-normal leading-relaxed',
      }}
      onUploadError={(error) => {
        toast.error(`Upload error: ${error.message}`);
      }}
      onClientUploadComplete={(res) => {
        toast.success('Image uploaded successfully!');
        form.setValue('image', res[0].ufsUrl);
        form.setValue('imageKey', res[0].key);
      }}
      content={{
        button({ ready, isUploading }) {
          if (isUploading) return <div>Uploading...</div>;
          if (ready) return <div>Upload Image</div>;
          return <div>Getting ready...</div>;
        },
        allowedContent({ ready, fileTypes, isUploading }) {
          if (!ready) return 'Checking...';
          if (isUploading) return 'Upload in progress...';
          return `Supported files: ${fileTypes.join(', ')}`;
        },
      }}
    />
  );
};

export default ImageUploaderBtn;
