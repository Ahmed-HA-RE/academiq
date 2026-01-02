"'use client";

import { TrendingUp, Layers, Globe, AlarmClock } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import Image from 'next/image';
import { MotionPreset } from '@/app/components/ui/motion-preset';

const tabsData = [
  {
    name: 'Earn Money',
    icon: TrendingUp,
    value: 'earn-money',
    content: {
      buttonIcon: TrendingUp,
      title: 'Earn While You Teach',
      description:
        'Monetize your knowledge with secure payouts and flexible pricing options Receive payments directly to your bank account or preferred payment method.',
      image:
        'https://res.cloudinary.com/ahmed--dev/image/upload/v1766080473/tab-1_b4cyf2.jpg',
    },
  },
  {
    name: 'Easy Integration',
    icon: Layers,
    value: 'easy-integration',
    content: {
      buttonIcon: Layers,
      title: 'Create Courses Easily',
      description:
        'Transform your knowledge into interactive lessons quickly and effortlessly.',
      image:
        'https://res.cloudinary.com/ahmed--dev/image/upload/v1766080916/tab-2_rpiyuv.jpg',
    },
  },
  {
    name: 'Shared WorldWide',
    icon: Globe,
    value: 'field-validations',
    content: {
      buttonIcon: Globe,
      title: 'Reach a Global Audience',
      description:
        'Share your knowledge and expertise with students from all over the world, guiding them through engaging, well-structured courses that help them learn new skills, build confidence, and achieve their personal or professional goals.',
      image:
        'https://res.cloudinary.com/ahmed--dev/image/upload/v1766080475/tab-3_v8qkhi.jpg',
    },
  },
  {
    name: 'Flexibility',
    icon: AlarmClock,
    value: 'flexibility',
    content: {
      buttonIcon: AlarmClock,
      title: 'Flexible Schedule',
      description:
        'Teach anytime, anywhere, giving you complete flexibility to manage your classes, set your own schedule, and design lessons in a way that works best for you, while helping students learn at their own pace.',
      image:
        'https://res.cloudinary.com/ahmed--dev/image/upload/v1766080474/tab-4_btvov3.jpg',
    },
  },
];

const TeachFeatures = () => {
  return (
    <section className='section-spacing'>
      <div className='container'>
        <div className='mb-6 flex items-center justify-between gap-9 max-sm:flex-col'>
          <div className='max-w-3xl'>
            <MotionPreset
              component='h2'
              className='mb-4 text-2xl font-semibold md:text-3xl lg:text-4xl'
              fade
              slide={{ direction: 'left', offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
            >
              Features that you need.
            </MotionPreset>
            <MotionPreset
              component='p'
              className='text-muted-foreground text-lg'
              fade
              blur
              slide={{ direction: 'left', offset: 50 }}
              delay={0.2}
              transition={{ duration: 0.5 }}
            >
              Discover a complete set of tools designed to make teaching simple,
              effective, and rewarding. Create professional, engaging courses
              quickly, share your knowledge with students from anywhere in the
              world, and help them develop new skills at their own pace.
            </MotionPreset>
          </div>

          {/* Logo */}
          <MotionPreset
            fade
            blur
            zoom={{ initialScale: 0.75 }}
            delay={0.4}
            transition={{ duration: 0.5 }}
            className='mx-auto flex'
          >
            <div className='relative flex size-36 items-center justify-center'>
              <div className='absolute inset-0 flex items-center justify-center'>
                <Image
                  src={'/images/logo.png'}
                  alt='brand-logo'
                  width={128}
                  height={128}
                  className='z-1 size-32 rounded-4xl'
                />
              </div>
              <div className='absolute inset-0'>
                <div className='border-primary absolute inset-12 animate-ping rounded-3xl border-2'></div>
                <div className='border-primary/60 absolute inset-8 animate-ping rounded-3xl border-2'></div>
                <div className='border-primary/40 absolute inset-6 animate-ping rounded-3xl border-2'></div>
              </div>
            </div>
          </MotionPreset>
        </div>

        <Tabs defaultValue='earn-money' className='gap-8 md:gap-18'>
          <MotionPreset
            fade
            blur
            slide={{ direction: 'left', offset: 50 }}
            delay={0.4}
            transition={{ duration: 0.5 }}
          >
            <TabsList className='h-full max-sm:w-full max-sm:flex-col'>
              {tabsData.map(({ icon: Icon, name, value }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className='flex items-center gap-1 px-2.5 max-sm:w-full sm:px-3 cursor-pointer'
                >
                  <Icon />
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </MotionPreset>

          {tabsData.map((tab) => {
            const IconComponent = tab.content.buttonIcon;

            return (
              <TabsContent key={tab.value} value={tab.value}>
                <div className='flex flex-col justify-between gap-11 lg:flex-row'>
                  <MotionPreset
                    fade
                    slide={{ direction: 'down', offset: 70 }}
                    blur
                    transition={{ duration: 0.7 }}
                    className='flex-1/2'
                  >
                    <div className='flex flex-col gap-4 '>
                      <Avatar className='border-primary border'>
                        <AvatarFallback className='text-primary bg-transparent [&>svg]:size-4'>
                          <IconComponent />
                        </AvatarFallback>
                      </Avatar>

                      <p className='text-primary font-medium uppercase'>
                        {tab.name}
                      </p>

                      <h3 className='text-card-foreground text-2xl font-semibold'>
                        {tab.content.title}
                      </h3>

                      <p className='text-muted-foreground '>
                        {tab.content.description}
                      </p>
                    </div>
                  </MotionPreset>

                  <MotionPreset
                    fade
                    blur
                    zoom={{ initialScale: 0.75 }}
                    transition={{ duration: 0.7 }}
                    className='flex-1/3'
                  >
                    <Image
                      src={tab.content.image}
                      alt={tab.name}
                      width={472}
                      height={412}
                      className='object-cover rounded-2xl sm:mx-auto'
                    />
                  </MotionPreset>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default TeachFeatures;
