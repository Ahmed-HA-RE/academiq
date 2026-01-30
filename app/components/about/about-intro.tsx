import { Button } from '../ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';

const aboutIntroData = {
  contentTitle: 'We empower learners through quality online education',
  contentDescription:
    'We understand the importance of accessible and engaging learning experiences. Our platform connects students with expert instructors, providing a comprehensive learning environment that supports growth and skill development at every level.',
  tabs: [
    {
      name: 'How It Works',
      value: 'how-it-works',
      content: (
        <div className='space-y-4'>
          <p className='text-muted-foreground'>
            Academiq is designed to make online learning structured,
            interactive, and easy to follow. Instructors create thoughtfully
            organized courses, combining lessons, resources, and practical
            exercises into a seamless learning experience.
          </p>
          <p className='text-muted-foreground'>
            Learners can enroll, track their progress, and engage with content
            at their own pace, all within a single platform. From discovering
            courses to completing them with confidence, Academiq supports every
            step of the learning journey.
          </p>
        </div>
      ),
    },
    {
      name: 'Vision',
      value: 'vision',
      content: (
        <>
          <div className='space-y-4'>
            <p className='text-muted-foreground'>
              We envision a world where anyone, anywhere can access the
              knowledge they need to achieve their goals. Quality education
              shouldn&apos;t be limited by geography, schedule, or financial
              constraints. Our platform breaks down these barriers, offering
              flexible, affordable learning opportunities taught by industry
              experts and passionate educators.
            </p>
            <p className='text-muted-foreground'>
              Through innovative technology and a commitment to excellence, we
              aim to become the leading online learning destination, where
              millions of students transform their lives through education and
              where instructors build thriving teaching businesses.
            </p>
          </div>
        </>
      ),
    },
    {
      name: 'Our Value',
      value: 'values',
      content: (
        <>
          <div className='space-y-4'>
            <p className='text-muted-foreground'>
              Our core values guide everything we do:
            </p>
            <ul className='text-muted-foreground list-inside list-disc space-y-2'>
              <li>
                <span className='text-foreground font-semibold'>
                  Quality First:
                </span>{' '}
                We maintain rigorous standards to ensure every course delivers
                real value and knowledge
              </li>
              <li>
                <span className='text-foreground font-semibold'>
                  Accessibility:
                </span>{' '}
                We believe learning should be available to everyone, regardless
                of background or location
              </li>
              <li>
                <span className='text-foreground font-semibold'>
                  Community:
                </span>{' '}
                We foster a supportive environment where learners and
                instructors grow together
              </li>
              <li>
                <span className='text-foreground font-semibold'>
                  Innovation:
                </span>{' '}
                We continuously evolve our platform to provide the best learning
                experience possible
              </li>
            </ul>
          </div>
        </>
      ),
    },
  ],
};

const AboutIntro = () => {
  return (
    <section className='section-spacing'>
      <div className='container'>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center md:mb-16 lg:mb-24'>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            Built for Clear, Structured Learning
          </h2>
          <p className='text-muted-foreground text-xl'>
            At {APP_NAME}, we focus on thoughtful course design, practical
            learning paths, and continuous support—so learners can progress with
            confidence and purpose.
          </p>
          <Button
            size='lg'
            asChild
            className='rounded-lg text-base has-[>svg]:px-6 cursor-pointer'
          >
            <Link href='/about'>
              Read More
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>

        <div className='grid items-center gap-16 lg:grid-cols-2'>
          <div className='space-y-6'>
            <h3 className='text-xl font-semibold'>
              {aboutIntroData.contentTitle}
            </h3>
            <p className='text-muted-foreground'>
              {aboutIntroData.contentDescription}
            </p>

            <Separator />

            <Tabs defaultValue='vision' className='gap-6'>
              <TabsList>
                {aboutIntroData.tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {aboutIntroData.tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className='flex justify-center pb-8 lg:justify-end'>
            <div className='bg-primary/10 flex max-w-112 items-end rounded-tl-[60px] rounded-tr-xl'>
              <Image
                width={0}
                height={0}
                sizes='100vw'
                src='/images/about/about-intro-section.jpg'
                alt='About us illustration'
                className='w-full'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;
