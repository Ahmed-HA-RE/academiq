import { ArrowDownIcon, ArrowRightIcon } from 'lucide-react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/app/components/ui/accordion';
import { Card, CardContent } from '@/app/components/ui/card';
import { MotionPreset } from '../ui/motion-preset';
import { pricingFaqItems } from '@/lib/constants';
import { Button } from '../ui/button';
import Link from 'next/link';

const PricingFaq = () => {
  return (
    <section className='section-spacing'>
      <div className='container'>
        <div className='space-y-5 mb-12 text-center'>
          <MotionPreset
            component='h2'
            className='text-4xl font-bold md:text-5xl lg:text-6xl'
            fade
            slide={{ direction: 'down', offset: 50 }}
            delay={0.2}
            transition={{ duration: 0.7 }}
          >
            Frequently Asked Questions
          </MotionPreset>
          <MotionPreset
            fade
            slide={{ direction: 'down', offset: 50 }}
            delay={0.4}
            transition={{ duration: 0.7 }}
          >
            <p className='text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto'>
              Have questions about our pricing plans? Find answers to common
              queries below.
            </p>
          </MotionPreset>
        </div>
        <div className='grid grid-cols-1 gap-8'>
          {/* Right Section - FAQ Accordion */}
          <MotionPreset
            fade
            slide={{ direction: 'down', offset: 50 }}
            delay={0.3}
            transition={{ duration: 0.7 }}
          >
            <Accordion
              type='single'
              collapsible
              className='space-y-4'
              defaultValue='item-0'
            >
              {pricingFaqItems.map((item, index) => (
                <MotionPreset
                  key={index}
                  fade
                  slide={{ direction: 'down', offset: 30 }}
                  delay={0.6 + index * 0.1}
                  transition={{ duration: 0.6 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className='bg-muted/50 group hover:bg-muted border border-transparent hover:border-lime-500/20 rounded-lg transition-all duration-300'
                  >
                    <AccordionPrimitive.Header className='flex'>
                      <AccordionPrimitive.Trigger
                        data-slot='accordion-trigger'
                        className='focus-visible:border-ring focus-visible:ring-ring/50 [&[data-state=open]>svg]:text-white [&[data-state=open]>svg]:bg-lime-500 dark:[&[data-state=open]>svg]:bg-lime-600 flex flex-1 items-center justify-between gap-4 rounded-lg px-6 py-5 text-left text-base md:text-lg font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180 cursor-pointer'
                      >
                        {item.question}
                        <ArrowDownIcon className='text-foreground/60 bg-muted group-hover:bg-lime-500/10 group-hover:text-lime-600 dark:group-hover:text-lime-500 pointer-events-none size-8 shrink-0 rounded-lg p-1.5 transition-all duration-300' />
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    <AccordionContent className='text-muted-foreground px-6 pb-5 text-base md:text-base leading-relaxed'>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </MotionPreset>
              ))}
            </Accordion>
          </MotionPreset>
          {/* Left Section - Support Card */}
          <MotionPreset
            fade
            slide={{ direction: 'down', offset: 50 }}
            delay={0.5}
            transition={{ duration: 0.7 }}
          >
            <Card className='border-lime-500/20 bg-gradient-to-br from-lime-500/5 to-lime-600/10 dark:from-lime-600/10 dark:to-lime-500/5'>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-2xl font-bold md:text-3xl'>
                    Still have questions?
                  </h3>
                  <p className='text-muted-foreground leading-relaxed text-base md:text-lg'>
                    We&apos;re here to help you out whenever you need! Get in
                    touch with our dedicated support team for personalized
                    assistance anytime.
                  </p>

                  <Button
                    size='lg'
                    asChild
                    className='group has-[>svg]:px-6 bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 mt-2'
                  >
                    <Link href='/contact'>
                      Contact us
                      <ArrowRightIcon className='size-5 rotate-310 group-hover:translate-x-1 transition-transform duration-200' />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MotionPreset>
        </div>
      </div>
    </section>
  );
};

export default PricingFaq;
