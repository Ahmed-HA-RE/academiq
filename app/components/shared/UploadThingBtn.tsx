'use client';

import { UploadButton } from '@/lib/uploadthing';
import { Json } from '@uploadthing/shared';
import toast from 'react-hot-toast';
import { EndpointArg, FileRoute } from 'uploadthing/types';

type UploadThingBtnProps = {
  endpoint: EndpointArg<
    {
      videoUploader: FileRoute<{
        input: undefined;
        output: {
          uploadedBy: string;
        };
        errorShape: Json;
      }>;
      imageUploader: FileRoute<{
        input: undefined;
        output: {
          uploadedBy: string;
        };
        errorShape: Json;
      }>;
    },
    'imageUploader' | 'videoUploader'
  >;
  // @ts-error: Type definition for onChange
  onChange: (...event: unknown[]) => void;
};

const UploadThingBtn = ({ endpoint, onChange }: UploadThingBtnProps) => {
  return (
    <UploadButton
      endpoint={endpoint}
      appearance={{
        button:
          'bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md ut-uploading:cursor-not-allowed ut-uploading:opacity-70',
        container:
          'flex flex-col gap-2 items-start justify-start w-full max-w-md',
        allowedContent:
          'text-sm text-muted-foreground mt-1 font-normal leading-relaxed',
      }}
      onUploadError={(error) => {
        toast.error(`Upload error: ${error.message}`);
      }}
      onClientUploadComplete={(res) => {
        toast.success('Image uploaded successfully!');
        onChange(res[0].ufsUrl);
      }}
      content={{
        button({ ready, isUploading }) {
          if (isUploading) return <div>Uploading...</div>;
          if (ready) return <div>Upload File</div>;
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

export default UploadThingBtn;
