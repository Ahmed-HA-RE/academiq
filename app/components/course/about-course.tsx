'use client';
import DOMPurify from 'isomorphic-dompurify';
const AboutCourse = ({ description }: { description: string }) => {
  return (
    <div className='py-10 md:py-12 space-y-4'>
      <h2 className='font-bold text-2xl'>Description</h2>
      <p
        className='text-secondary-foreground prose'
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(description),
        }}
      />
    </div>
  );
};

export default AboutCourse;
