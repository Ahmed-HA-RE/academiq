import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';

import { FAQ_TABS } from '@/lib/utils';
import Link from 'next/link';

const TeachFaq = () => {
  return (
    <section className='section-spacing'>
      <div className='container'>
        {/* Header */}
        <div className='mb-12 text-center sm:mb-16 lg:mb-24'>
          <h1 className='mb-4 text-2xl font-semibold md:text-3xl lg:text-4xl'>
            Commonly Asked Questions
          </h1>
          <p className='text-secondary-foreground text-xl'>
            Answers to common questions about becoming an instructor and
            completing the application process.
          </p>
        </div>

        <Tabs defaultValue={'getting-started'} className='gap-8'>
          <TabsList className='self-center'>
            {FAQ_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='cursor-pointer'
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {FAQ_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <Accordion
                type='single'
                collapsible
                className='w-full space-y-2'
                defaultValue={`item-1`}
              >
                {tab.faqs.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index + 1}`}
                    className='bg-card rounded-md border-b-0 shadow-md data-[state=open]:shadow-lg'
                  >
                    <AccordionTrigger className='px-5 text-base [&>svg]:rotate-90 [&[data-state=open]>svg]:rotate-0 cursor-pointer'>
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className='text-secondary-foreground px-5 text-base'>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>

        {/* Support Link */}
        <div className='mt-12 text-center sm:mt-16 lg:mt-24'>
          <p className='text-secondary-foreground'>
            Didn&apos;t find the answer you are looking for?{' '}
            <Link
              href='/contact'
              className='text-foreground font-semibold hover:underline'
            >
              Contact our support
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeachFaq;
