import Image from 'next/image';
import { MotionPreset } from '../ui/motion-preset';
import { NumberTicker } from '../ui/number-ticker';

const stats = [
  {
    title: 3,
    value: 'Years in Development',
  },
  {
    title: 1_200,
    value: 'Active Learners',
  },
  {
    title: 50,
    value: 'Countries Accessing',
  },
];

const AboutOurStory = () => {
  return (
    <section className='section-spacing'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-9 lg:grid-cols-2'>
          <div className='flex flex-col gap-9'>
            <div className='flex items-center gap-6 overflow-hidden'>
              <div className='to-primary h-40 sm:h-44 md:h-48 lg:h-52 w-4 bg-gradient-to-t from-transparent' />
              <MotionPreset
                slide={{ direction: 'left' }}
                fade
                blur
                transition={{ duration: 0.8 }}
              >
                <div className='space-y-4'>
                  <h2 className='text-3xl font-semibold md:text-4xl lg:text-5xl'>
                    Our story
                  </h2>
                  <p className='text-secondary-foreground text-xl font-semibold md:text-2xl lg:text-3xl mt-4'>
                    At Academiq, we empower educators and learners worldwide to
                    connect, create, and grow. Share your knowledge, design
                    interactive courses, and inspire a global community of
                    learners.
                    <span className='text-primary inline-block mt-2'>
                      Teach. Learn. Thrive.
                    </span>
                  </p>
                </div>
              </MotionPreset>
            </div>

            <MotionPreset
              fade
              blur
              slide={{ direction: 'up' }}
              delay={0.3}
              transition={{ duration: 0.8 }}
            >
              <Image
                src='/images/about/our-story.jpg'
                width={0}
                height={0}
                sizes='100vw'
                alt='Team meeting office'
                className='max-h-91 w-full rounded-lg object-cover'
              />
            </MotionPreset>
          </div>

          {/* Cards */}
          <div className='flex flex-col gap-6'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <MotionPreset
                fade
                blur
                slide={{ direction: 'up' }}
                delay={0.6}
                transition={{ duration: 0.8 }}
              >
                <div className='overflow-hidden rounded-md'>
                  <Image
                    src='/images/about/team-collaboration-01.jpg'
                    alt='Team collaboration'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='h-52 w-full rounded-md object-cover'
                  />
                </div>
              </MotionPreset>
              <MotionPreset
                fade
                blur
                slide={{ direction: 'up' }}
                delay={0.6}
                transition={{ duration: 0.8 }}
              >
                <div className='overflow-hidden rounded-md'>
                  <Image
                    src='/images/about/team-collaboration-02.jpg'
                    alt='Team collaboration'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='h-52 w-full rounded-md object-cover'
                  />
                </div>
              </MotionPreset>
            </div>

            <div className='flex flex-1 flex-col justify-center gap-9'>
              <MotionPreset
                fade
                blur
                slide={{ direction: 'up' }}
                delay={0.8}
                transition={{ duration: 0.5 }}
              >
                <p className='text-secondary-foreground text-lg md:text-xl lg:text-2xl mt-4'>
                  Our story is a testament to the power of learning and
                  collaboration. Together with passionate educators and
                  motivated learners, we have built a platform that inspires
                  growth, celebrates achievements, and fosters a global
                  community of knowledge and opportunity.
                </p>
              </MotionPreset>

              {/* Stats */}
              <MotionPreset
                fade
                blur
                slide={{ direction: 'up' }}
                delay={0.9}
                transition={{ duration: 0.5 }}
              >
                <div className='grid gap-10 sm:grid-cols-3'>
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className='flex flex-col items-center gap-2.5'
                    >
                      <h3 className='text-foreground text-4xl font-medium'>
                        <NumberTicker
                          startValue={0}
                          value={+stat.title}
                          delay={0.8}
                          stiffness={170}
                        />
                        +
                      </h3>
                      <p className='text-secondary-foreground text-center'>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </MotionPreset>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutOurStory;
