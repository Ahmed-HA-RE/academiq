import React from 'react';
import { Button } from '../components/ui/button';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

const MyCoursesPage = () => {
  return (
    <section>
      <div className='container'>
        <Button className='group' asChild>
          <Link href='/'>
            <ArrowLeftIcon
              aria-hidden='true'
              className='-me-1 opacity-60 transition-transform group-hover:-translate-x-0.5'
              size={16}
            />
            Back to Home
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default MyCoursesPage;
