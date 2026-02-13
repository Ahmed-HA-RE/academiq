import ContactUsForm from '@/app/components/contact-us-form';
import { getCurrentLoggedUser } from '@/lib/actions/getUser';
import { CONTACT_US_FEATURES } from '@/lib/constants';
import { Metadata } from 'next';
import { FaCircleCheck } from 'react-icons/fa6';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team for any inquiries or support.',
};

const ContactPage = async () => {
  const user = await getCurrentLoggedUser();

  return (
    <section className='min-h-[70vh] pb-10 section-after-header'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 gap-y-12'>
          {/* Left Side */}
          <div className='flex flex-col gap-6'>
            <h1 className='text-5xl sm:text-6xl lg:text-7xl leading-tight'>
              Talk to an <span className='italic text-primary'>Expert </span>
              About Your Learning Path
            </h1>
            <p className='text-secondary-foreground text-xl lg:text-xl mb-5'>
              Get in touch with us to discuss your needs and how we can help.
            </p>

            {/* Contact us features */}
            <div className='flex flex-col gap-8'>
              {CONTACT_US_FEATURES.map((feature, index) => (
                <div key={index} className='flex items-start gap-4'>
                  <span className='pt-1'>
                    <FaCircleCheck className='text-primary size-6' />
                  </span>
                  <div className='flex flex-col gap-2 max-md:max-w-md'>
                    <h3 className='font-semibold text-xl'>{feature.title}</h3>
                    <p className='text-secondary-foreground'>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right Side */}
          <ContactUsForm user={user} />
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
