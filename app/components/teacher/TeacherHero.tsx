'use client';
import { useRef } from 'react';
import {
  ArrowRightIcon,
  CodeXmlIcon,
  Users,
  LayoutDashboardIcon,
  BookOpenText,
  GraduationCap,
  TvMinimalPlay,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import Image from 'next/image';

import { AnimatedBeam } from '@/app/components/ui/animated-beam';
import Link from 'next/link';

const TeacherHeroSection = () => {
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
    <section className='flex-1 overflow-hidden py-4'>
      <div className='container flex-col items-center gap-8 px-4 sm:gap-16'>
        {/* Hero Content */}
        <div className='flex flex-col items-center gap-4 text-center mb-5 sm:mb-0'>
          <Badge variant='outline' className='text-sm font-normal'>
            Trusted by Educators
          </Badge>

          <h1 className='text-3xl font-semibold sm:text-4xl lg:text-5xl lg:font-bold'>
            Launch Classes{' '}
            <span className='underline underline-offset-3'>Effortlessly</span>
          </h1>

          <p className='text-muted-foreground max-w-4xl text-base sm:text-lg md:text-xl'>
            Set up professional, engaging lessons quickly with our platform.{' '}
            <br className='max-lg:hidden' /> Use ready-made modules for seamless
            course creation and delivery.
          </p>

          <Button
            size='lg'
            className='group relative w-fit overflow-hidden rounded-lg text-base before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] has-[>svg]:px-6 dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]'
            asChild
          >
            <Link href='/teach/apply'>
              Apply Now{' '}
              <ArrowRightIcon className='transition-transform duration-200 group-hover:translate-x-0.5' />
            </Link>
          </Button>
        </div>
        <div
          ref={containerRef}
          className='relative flex w-full flex-col items-center'
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
            gradientStartColor='var(--primary)'
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
    </section>
  );
};

export default TeacherHeroSection;
