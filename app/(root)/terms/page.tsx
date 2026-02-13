import { Metadata } from 'next';
import Terms from '@/app/markdown/terms.mdx';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Read the terms and conditions for using our online learning platform. Understand your rights and responsibilities as a user.',
};

const TermsAndConditionsPage = () => {
  return (
    <section className='section-after-header'>
      <div className='prose prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white container'>
        <Terms />
      </div>
    </section>
  );
};

export default TermsAndConditionsPage;
