import { MotionPreset } from '../ui/motion-preset';
import { Marquee } from '../ui/marquee';
import Image from 'next/image';

const LeadingInstitutionsMarquee = () => {
  return (
    <MotionPreset
      component='div'
      fade
      slide={{ direction: 'down', offset: 50 }}
      delay={0}
      transition={{ duration: 0.5 }}
      className='bg-gradient-to-r from-[#00467F] to-[#A5CC82] relative z-1 flex items-center gap-x-10 p-4 max-sm:flex-col py-8'
    >
      <p className='mb-4 sm:mb-0 sm:w-60 shrink-0 grow text-base sm:text-lg font-medium text-white uppercase dark:text-black'>
        Trusted by leading institutions
      </p>
      <Marquee
        pauseOnHover
        duration={20}
        gap={4}
        reverse
        className='[&_.animate-marquee-horizontal]:items-center'
      >
        <Image
          src='/images/leading-institutions/coursera.png'
          alt='Coursera'
          className='h-10 w-auto shrink-0 object-contain'
          width={0}
          height={0}
          sizes='100vw'
        />
        <Image
          src='/images/leading-institutions/udemy_light.png'
          alt='Udemy'
          className='h-8 w-auto shrink-0 object-contain dark:hidden block'
          width={0}
          height={0}
          sizes='100vw'
        />
        <Image
          src='/images/leading-institutions/harvard.png'
          alt='Harvard'
          className='h-8 w-auto shrink-0 object-contain'
          width={0}
          height={0}
          sizes='100vw'
        />
        <Image
          src='/images/leading-institutions/google.png'
          alt='Google'
          className='h-7.5 w-auto shrink-0 object-contain '
          width={0}
          height={0}
          sizes='100vw'
        />

        <Image
          src='/images/leading-institutions/CFA.png'
          alt='CFA'
          className='h-9 w-auto shrink-0 object-contain'
          width={0}
          height={0}
          sizes='100vw'
        />

        <Image
          src='/images/leading-institutions/linkedin.png'
          alt='Linkedin'
          className='h-7 w-auto shrink-0 object-contain block'
          width={0}
          height={0}
          sizes='100vw'
        />
      </Marquee>
    </MotionPreset>
  );
};

export default LeadingInstitutionsMarquee;
