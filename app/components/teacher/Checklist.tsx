import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { MotionPreset } from '../ui/motion-preset';
import { CircleCheckBig } from 'lucide-react';
import Image from 'next/image';
import { checklist } from '@/lib/constants';

const Checklist = () => {
  return (
    <section className='section-spacing'>
      <div className='container'>
        <div className='grid gap-16 lg:grid-cols-2'>
          <div>
            <div className='mb-10 space-y-4'>
              <MotionPreset
                component='h2'
                className='text-2xl sm:text-3xl md:text-4xl font-semibold'
                fade
                slide={{ direction: 'up', offset: 50 }}
                blur
                transition={{ duration: 0.5 }}
              >
                What You Should Be Ready For
              </MotionPreset>

              <MotionPreset
                component='p'
                className='text-muted-foreground text-base sm:text-lg md:text-xl'
                fade
                blur
                slide={{ direction: 'up', offset: 50 }}
                delay={0.3}
                transition={{ duration: 0.5 }}
              >
                Teaching on our platform requires clarity, responsibility, and a
                genuine desire to help students learn. We look for educators who
                understand their subject well, can explain concepts clearly, and
                are committed to delivering valuable learning experiences. By
                meeting these expectations, teachers help create a trusted
                environment where students feel supported, guided, and confident
                in their learning journey.
              </MotionPreset>
            </div>

            <div className='space-y-10'>
              {checklist.map((list, index) => (
                <MotionPreset
                  key={index}
                  className='flex items-center gap-5'
                  fade
                  blur
                  slide={{ direction: 'up', offset: 30 }}
                  delay={0.6 + index * 0.15}
                  transition={{ duration: 0.7 }}
                >
                  <Avatar className='size-13 rounded-md'>
                    <AvatarFallback className='bg-muted rounded-md'>
                      <CircleCheckBig className='text-emerald-500' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='space-y-1.5'>
                    <p className='text-xl sm:text-2xl font-medium'>
                      {list.value}
                    </p>
                    <p className='text-muted-foreground text-lg sm:text-xl'>
                      {list.description}
                    </p>
                  </div>
                </MotionPreset>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <MotionPreset
            className='my-auto sm:h-[400px] lg:h-[600px] xl:h-full col-span-1'
            fade
            delay={0.4}
            transition={{ duration: 1.5 }}
          >
            <Image
              src='https://res.cloudinary.com/ahmed--dev/image/upload/v1766134020/teaching-iilustration_sxrphv.jpg'
              alt='CheckList Illustration'
              width={0}
              height={0}
              sizes='100vw'
              className='w-full h-full rounded-md object-cover'
            />
          </MotionPreset>
        </div>
      </div>
    </section>
  );
};

export default Checklist;
