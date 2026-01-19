import { APP_NAME } from '@/lib/constants';
import { config } from 'dotenv';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from '@react-email/components';

config();

type NotifyApplicantProps = {
  name: string;
};

const NotifyApplicant = ({ name }: NotifyApplicantProps) => {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_PROD_URL
      : process.env.NEXT_PUBLIC_DEV_URL;

  const baseImageUrl =
    process.env.NODE_ENV === 'production'
      ? `${process.env.NEXT_PUBLIC_PROD_URL}/images`
      : `${process.env.NEXT_PUBLIC_DEV_EMAIL_URL}/static`;
  return (
    <Html>
      <Head />
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className='bg-[#f6f9fc] font-stripe'>
          <Preview>Action Required: Complete your payment setup</Preview>
          <Container className='bg-white mx-auto py-5 my-16'>
            <Section className='px-12'>
              <Img
                src={`${baseImageUrl}/logo.png`}
                width={52}
                height={52}
                alt={APP_NAME}
              />
              <Hr className='border-[#e6ebf1] my-5' />
              <Heading className='text-2xl text-center text-[#525f7f] font-bold mb-6'>
                Action Required: Complete Your Payment Setup
              </Heading>
              <Text className='text-[#525f7f] text-base leading-6 text-left text-[20px]'>
                Hello {name},
              </Text>
              <Text className='text-[#525f7f] text-base leading-6 text-left'>
                We&apos;ve noticed that your instructor application is currently
                on hold. To proceed, you need to complete your payment setup.
              </Text>

              <Text className='text-[#525f7f] text-base leading-6 text-left'>
                This is a mandatory step to unlock instructor features and
                ensure you can receive payouts for your courses. Your
                application cannot move forward until this is resolved.
              </Text>

              <Text className='text-[#525f7f] text-base leading-6 text-left'>
                Please be aware that if your payment setup is not completed
                within <strong>7 days</strong>, your application will be
                automatically rejected, and you will need to start the process
                over.
              </Text>
              <Button
                href={`${baseUrl}/teach/apply/payments/setup`}
                className='rounded-[3px] text-white bg-blue-600 text-[16px] font-bold no-underline text-center block p-[10px]'
              >
                Proceed to Payment Setup
              </Button>
              <Hr className='border-[#e6ebf1] my-5' />
              <Text className='text-[#525f7f] text-base leading-6 text-left'>
                — The {APP_NAME} team
              </Text>
              <Text className='text-xs leading-[15px] text-left my-0 text-[#b7b7b7]'>
                ©{new Date().getFullYear()} {APP_NAME}, Abu Dhabi, UAE
                <br /> <br />
                All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

NotifyApplicant.PreviewProps = {
  name: 'Ahmed Haitham',
};

export default NotifyApplicant;
