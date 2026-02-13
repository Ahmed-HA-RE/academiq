import { MotionPreset } from '../ui/motion-preset';
import Image from 'next/image';
import AboutCEOWords from './about-ceo-words';

const AboutOurMission = () => {
  return (
    <section className='pt-12 sm:pt-16 lg:pt-24 pb-25 bg-secondary relative mb-[250px] md:mb-[200px] lg:mb-[180px]'>
      <div className='container grid grid-cols-1 lg:grid-cols-2 gap-10'>
        {/* Left Col */}
        <MotionPreset
          fade
          blur
          slide={{ direction: 'left' }}
          delay={0.1}
          transition={{ duration: 0.8 }}
        >
          <div className='flex flex-col items-start gap-6'>
            <h2 className='text-3xl lg:text-4xl font-bold'>Our Mission</h2>
            <p className='text-secondary-foreground max-w-2xl'>
              At Academiq our mission is to democratize high-quality education
              by empowering both instructors and learners with the tools,
              resources, and community they need to succeed. We build
              pedagogically-sound, accessible course experiences that prioritize
              real-world skills, measurable learning outcomes, and sustained
              learner engagement. By partnering with industry experts,
              educators, and institutions, we make it simple for creators to
              design interactive, inclusive courses and for students to find
              career-relevant pathways—regardless of geography or background.
            </p>
            <p className='text-secondary-foreground max-w-2xl'>
              We are guided by data-driven design, ethical content standards,
              and a relentless focus on support: for instructors we provide
              practical production workflows, promotion tools, and instructor
              enablement; for learners we deliver clear pathways, flexible
              formats, and meaningful assessments. Ultimately, Academiq exists
              to make continuous learning scalable, equitable, and impactful—so
              more people can unlock opportunity through lifelong education.
            </p>
          </div>
        </MotionPreset>
        {/* Right Col */}
        <MotionPreset
          fade
          blur
          slide={{ direction: 'up' }}
          delay={0.3}
          transition={{ duration: 0.8 }}
        >
          <div className='flex justify-center lg:justify-end'>
            <Image
              src='/images/about/our-mission.jpg'
              alt='Our Mission'
              width={0}
              height={0}
              sizes='100vw'
              className='w-full max-w-lg h-auto rounded-lg object-cover'
            />
          </div>
        </MotionPreset>
      </div>
      <AboutCEOWords />
    </section>
  );
};

export default AboutOurMission;
