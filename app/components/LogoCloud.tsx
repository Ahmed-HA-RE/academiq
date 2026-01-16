import { Button } from '@/app/components/ui/button';
import { MotionPreset } from '@/app/components/ui/motion-preset';
import { Orbiting } from '@/app/components/ui/orbiting';
import Image from 'next/image';
import { LOGO_CLOUD } from '@/lib/constants';
import { Badge } from './ui/badge';
import Link from 'next/link';

const LogoCloud = () => {
  return (
    <section className='py-10 bg-muted'>
      <div className='container'>
        <div className='flex items-center justify-between gap-12 gap-y-20 max-lg:flex-col sm:gap-16 lg:gap-24'>
          <div className='space-y-4'>
            <MotionPreset
              fade
              slide={{ direction: 'up', offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
            >
              <Badge variant='outline' className='text-sm font-normal'>
                A Foundation of Trust in Learning
              </Badge>
            </MotionPreset>

            <MotionPreset
              component='h2'
              className='text-2xl font-semibold md:text-3xl lg:text-4xl'
              fade
              slide={{ direction: 'up', offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.3}
            >
              Supporting learners and professionals in building real world
              skills
            </MotionPreset>

            <MotionPreset
              component='p'
              className='text-muted-foreground text-xl'
              fade
              blur
              slide={{ direction: 'up', offset: 50 }}
              transition={{ duration: 0.5 }}
              delay={0.6}
            >
              Academiq empowers students to grow with practical knowledge,
              structured guidance, and long term career confidence.
            </MotionPreset>

            <MotionPreset
              fade
              blur
              slide={{ direction: 'up', offset: 50 }}
              transition={{ duration: 0.5 }}
              delay={0.9}
            >
              <MotionPreset
                fade
                blur
                slide={{ direction: 'right', offset: 20 }}
                transition={{ duration: 0.4 }}
                delay={1.2}
              >
                <Button
                  asChild
                  className='text-base max-sm:w-full rounded-full'
                  size='lg'
                >
                  <Link href='/about'>Know Us Better</Link>
                </Button>
              </MotionPreset>
            </MotionPreset>
          </div>

          <MotionPreset
            fade
            blur
            zoom={{ initialScale: 0.8 }}
            transition={{ duration: 0.8 }}
            delay={0.5}
          >
            <div className='relative flex size-112 flex-col items-center justify-center'>
              <Orbiting className='size-150' radius={200} dashedGap={12}>
                {LOGO_CLOUD.slice(0, 6).map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.image}
                    alt={logo.alt}
                    width={56}
                    height={56}
                    className={logo.size}
                  />
                ))}
              </Orbiting>
              <Orbiting
                radius={115}
                reverse
                speed={2}
                dashed={true}
                dashedGap={12}
              >
                {LOGO_CLOUD.slice(6).map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.image}
                    alt={logo.alt}
                    width={56}
                    height={56}
                    className={logo.size}
                  />
                ))}
              </Orbiting>

              <Image
                src={'/images/logo.png'}
                alt='Central Logo'
                width={120}
                height={120}
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
              />
            </div>
          </MotionPreset>
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
