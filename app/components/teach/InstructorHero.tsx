'use client';
import { useRef } from 'react';
import {
  CodeXmlIcon,
  Users,
  LayoutDashboardIcon,
  BookOpenText,
  GraduationCap,
  TvMinimalPlay,
} from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import Image from 'next/image';
import { Marquee } from '../ui/marquee';
import { MotionPreset } from '../ui/motion-preset';

import { AnimatedBeam } from '@/app/components/ui/animated-beam';
const InstructorHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef1 = useRef<HTMLDivElement>(null);
  const iconRef2 = useRef<HTMLDivElement>(null);
  const iconRef3 = useRef<HTMLDivElement>(null);
  const iconRef4 = useRef<HTMLDivElement>(null);
  const iconRef5 = useRef<HTMLDivElement>(null);
  const iconRef6 = useRef<HTMLDivElement>(null);
  const iconRef7 = useRef<HTMLDivElement>(null);
  const spanRef1 = useRef<HTMLSpanElement>(null);
  const spanRef2 = useRef<HTMLSpanElement>(null);
  const spanRef3 = useRef<HTMLSpanElement>(null);
  const spanRef4 = useRef<HTMLSpanElement>(null);
  const spanRef5 = useRef<HTMLSpanElement>(null);
  const spanRef6 = useRef<HTMLSpanElement>(null);
  const spanRef7 = useRef<HTMLSpanElement>(null);
  const spanRef8 = useRef<HTMLSpanElement>(null);

  return (
    <section className='flex-1 overflow-hidden flex-col section-spacing'>
      <div className=' container flex-col items-center gap-8 px-4 sm:gap-16 space-y-10'>
        {/* Hero Content */}
        <div className='flex flex-col items-center gap-4 text-center'>
          <Badge variant='outline' className='text-sm font-normal'>
            Trusted by Educators
          </Badge>

          <h1 className='text-3xl font-semibold sm:text-4xl lg:text-5xl lg:font-bold mb-2'>
            Launch Classes{' '}
            <span className='underline underline-offset-3'>Effortlessly</span>
          </h1>

          <p className='text-muted-foreground max-w-4xl text-base sm:text-lg md:text-xl'>
            Set up professional, engaging lessons quickly with our platform.{' '}
            <br className='max-lg:hidden' /> Use ready-made modules for seamless
            course creation and delivery.
          </p>
        </div>
        <div
          ref={containerRef}
          className='relative flex w-full flex-col items-center mb-12'
        >
          <div className='flex w-full max-w-4xl items-center justify-between max-md:hidden'>
            <div className='flex items-center gap-30'>
              <div
                ref={iconRef1}
                className='bg-background flex size-12 items-center justify-center rounded-xl border-[1.5px] shadow-md lg:size-15'
              >
                <Users className='size-7 stroke-1 lg:size-10' />
              </div>
              <span ref={spanRef1} className='size-0.5 max-md:hidden'></span>
            </div>
            <div className='flex items-center gap-30'>
              <span ref={spanRef2} className='size-0.5 max-md:hidden'></span>
              <div
                ref={iconRef2}
                className='bg-background flex size-12 items-center justify-center rounded-xl border-[1.5px] shadow-md lg:size-15'
              >
                <CodeXmlIcon className='size-7 stroke-1 lg:size-8' />
              </div>
            </div>
          </div>
          <div className='flex w-full items-center justify-between py-2.5'>
            <div
              ref={iconRef3}
              className='bg-background flex size-15 shrink-0 items-center justify-center rounded-xl border-[1.5px] shadow-xl md:size-18 lg:size-23'
            >
              <BookOpenText className='size-8 stroke-1 md:size-10 lg:size-13' />
            </div>
            <div className='flex items-center justify-between md:w-full md:max-w-70 lg:max-w-100'>
              <div className='flex w-full max-w-20 justify-between max-md:hidden'>
                <span ref={spanRef3} className='size-0.5'></span>
                <span ref={spanRef4} className='size-0.5'></span>
              </div>
              <div
                ref={iconRef4}
                className='bg-background flex items-center justify-center rounded-xl border p-2'
              >
                <div className='bg-secondary flex size-16 items-center justify-center rounded-xl border-[1.5px] shadow-xl md:size-23'>
                  <Image
                    src={'/images/logo.png'}
                    width={0}
                    height={0}
                    sizes='100vw'
                    alt='Logo'
                    className='size-10 text-white md:size-16'
                  />
                </div>
              </div>
              <div className='flex w-full max-w-20 justify-between max-md:hidden'>
                <span ref={spanRef5} className='size-0.5'></span>
                <span ref={spanRef6} className='size-0.5'></span>
              </div>
            </div>
            <div
              ref={iconRef5}
              className='bg-background flex size-15 shrink-0 items-center justify-center rounded-xl border-[1.5px] shadow-xl md:size-18 lg:size-23'
            >
              <LayoutDashboardIcon className='size-8 stroke-1 md:size-10 lg:size-13' />
            </div>
          </div>
          <div className='flex w-full max-w-4xl items-center justify-between max-md:hidden'>
            <div className='flex items-center gap-30'>
              <div
                ref={iconRef6}
                className='bg-background flex size-12 items-center justify-center rounded-xl border-[1.5px] shadow-md lg:size-15'
              >
                <TvMinimalPlay className='size-6 stroke-1 lg:size-8' />
              </div>
              <span ref={spanRef7} className='size-0.5 max-md:hidden'></span>
            </div>
            <div className='flex items-center gap-30'>
              <span ref={spanRef8} className='size-0.5 max-md:hidden'></span>
              <div
                ref={iconRef7}
                className='bg-background flex size-12 items-center justify-center rounded-xl border-[1.5px] shadow-md lg:size-15'
              >
                <GraduationCap className='size-7 stroke-1 lg:size-11' />
              </div>
            </div>
          </div>

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={iconRef1}
            toRef={spanRef1}
            gradientStartColor='var(--secondary)'
            duration={4.5}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={spanRef1}
            toRef={spanRef3}
            gradientStartColor='var(--primary)'
            duration={4.5}
            curvature={-45}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={iconRef2}
            toRef={spanRef2}
            gradientStartColor='var(--primary)'
            duration={4.5}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={spanRef2}
            toRef={spanRef6}
            gradientStartColor='var(--primary)'
            duration={4.5}
            curvature={-45}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={iconRef6}
            toRef={spanRef7}
            gradientStartColor='var(--primary)'
            duration={4.5}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={spanRef7}
            toRef={spanRef4}
            gradientStartColor='var(--primary)'
            duration={4.5}
            curvature={40}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={iconRef7}
            toRef={spanRef8}
            gradientStartColor='var(--primary)'
            duration={4.5}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={spanRef8}
            toRef={spanRef5}
            gradientStartColor='var(--primary)'
            duration={4.5}
            curvature={40}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={iconRef3}
            toRef={spanRef3}
            gradientStartColor='var(--primary)'
            duration={4.5}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={spanRef3}
            toRef={spanRef4}
            gradientStartColor='var(--primary)'
            duration={4.5}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={spanRef4}
            toRef={iconRef4}
            gradientStartColor='var(--primary)'
            duration={4.5}
            className='-z-1 max-md:hidden'
          />

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={iconRef4}
            toRef={spanRef5}
            gradientStartColor='var(--primary)'
            duration={4.5}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={spanRef5}
            toRef={spanRef6}
            gradientStartColor='var(--primary)'
            duration={4.5}
            className='-z-1 max-md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={spanRef6}
            toRef={iconRef5}
            gradientStartColor='var(--primary)'
            duration={4.5}
            className='-z-1 max-md:hidden'
          />

          {/* Smaller screen */}

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={iconRef3}
            toRef={iconRef4}
            gradientStartColor='var(--primary)'
            duration={4.5}
            className='-z-1 md:hidden'
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={iconRef4}
            toRef={iconRef5}
            gradientStartColor='var(--primary)'
            duration={4.5}
            className='-z-1 md:hidden'
          />
        </div>
      </div>
      <MotionPreset
        component='div'
        fade
        slide={{ direction: 'down', offset: 50 }}
        delay={0}
        transition={{ duration: 0.5 }}
        className='bg-primary relative z-1 flex items-center gap-x-10 p-4 max-sm:flex-col'
      >
        <p className='mb-4 sm:mb-0 sm:w-60 shrink-0 grow text-base sm:text-lg font-medium text-white uppercase dark:text-black'>
          Trusted by leading institutions
        </p>
        <div className='relative'>
          <div className='from-primary pointer-events-none absolute inset-y-0 left-0 z-1 w-15 bg-gradient-to-r via-85% to-transparent max-sm:w-15' />
          <div className='from-primary pointer-events-none absolute inset-y-0 right-0 z-1 w-15 bg-gradient-to-l via-85% to-transparent max-sm:w-15' />
          <Marquee
            pauseOnHover
            duration={20}
            gap={4}
            reverse
            className='[&_.animate-marquee-horizontal]:items-center'
          >
            <Image
              src='/images/coursera.png'
              alt='Coursera'
              className='h-10 w-auto shrink-0 object-contain opacity-80 dark:invert'
              width={0}
              height={0}
              sizes='100vw'
            />
            <Image
              src='/images/udemy1.png'
              alt='Udemy'
              className='h-8 w-auto shrink-0 object-contain opacity-80 dark:block hidden'
              width={0}
              height={0}
              sizes='100vw'
            />

            <Image
              src='/images/udemy_light.png'
              alt='Udemy'
              className='h-8 w-auto shrink-0 object-contain opacity-80 dark:hidden block'
              width={0}
              height={0}
              sizes='100vw'
            />
            <Image
              src='/images/harvard.png'
              alt='Harvard'
              className='h-8 w-auto shrink-0 object-contain invert dark:invert-0'
              width={0}
              height={0}
              sizes='100vw'
            />
            <Image
              src='/images/google_hero.png'
              alt='Google'
              className='h-7.5 w-auto shrink-0 object-contain opacity-80  dark:invert'
              width={0}
              height={0}
              sizes='100vw'
            />

            <Image
              src='/images/microsoft_hero.png'
              alt='Microsoft'
              className='h-7 w-auto shrink-0 object-contain opacity-100'
              width={0}
              height={0}
              sizes='100vw'
            />

            <Image
              src='/images/linkedin_light.png'
              alt='Linkedin'
              className='h-7 w-auto shrink-0 object-contain opacity-80 dark:hidden block'
              width={0}
              height={0}
              sizes='100vw'
            />

            <Image
              src='/images/linkedin_dark.png'
              alt='Linkedin'
              className='h-7 w-auto shrink-0 object-contain opacity-80 dark:block hidden'
              width={0}
              height={0}
              sizes='100vw'
            />
          </Marquee>
        </div>
      </MotionPreset>
    </section>
  );
};

export default InstructorHero;
