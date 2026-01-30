import { OUR_TEAM } from '@/lib/constants';
import { Card, CardContent, CardTitle } from '../ui/card';
import { MotionPreset } from '../ui/motion-preset';
import Image from 'next/image';

const AboutOurTeam = () => {
  return (
    <section className='section-spacing'>
      <div className='container'>
        <div className='mb-8 text-center sm:mb-12 lg:mb-18'>
          <MotionPreset
            component='h2'
            className='text-2xl font-normal md:text-3xl lg:text-4xl'
            fade
            slide={{ direction: 'up', offset: 20 }}
            blur
            transition={{ duration: 0.5 }}
            delay={0.3}
          >
            Meet Our{' '}
            <span className='text-lime-500 dark:text-lime-600'>Leadership</span>
          </MotionPreset>
        </div>

        {/* Team Members */}
        <div className='grid grid-cols-1 items-center justify-center gap-8 sm:grid-cols-2 sm:gap-16 lg:grid-cols-3 2xl:gap-24'>
          {OUR_TEAM.map((member, index) => (
            <MotionPreset
              key={`${member.name}-${index}`}
              fade
              slide={{ direction: 'down', offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.6 + 0.15 * index}
              className='h-full'
            >
              <Card className='group hover:border-lime-500 h-full overflow-hidden rounded-sm border-2 py-0 shadow-none transition-colors duration-300'>
                <CardContent className='overflow-hidden px-0'>
                  <div className='overflow-hidden'>
                    <Image
                      width={0}
                      height={0}
                      sizes='100vw'
                      src={member.image}
                      alt={member.name}
                      className='mx-auto h-76 w-full object-cover transition-transform duration-200 group-hover:scale-105'
                    />
                  </div>
                  <div className='flex flex-col gap-2 p-5'>
                    <div className='flex flex-col gap-0.5 '>
                      <CardTitle className='text-lg font-semibold'>
                        {member.name}
                      </CardTitle>
                      <p className='text-muted-foreground text-sm font-bold'>
                        {member.role}
                      </p>
                    </div>
                    <p className='text-muted-foreground'>
                      {member.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </MotionPreset>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutOurTeam;
