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

const ApplicationSubmitted = ({ name }: { name: string }) => {
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
          <Preview>
            Your application has been submitted successfully - {APP_NAME}
          </Preview>
          <Container className='bg-white mx-auto py-5 my-16'>
            <Section className='px-12'>
              <Img
                src={`${baseImageUrl}/logo.png`}
                width={52}
                height={52}
                alt={APP_NAME}
              />
              <Hr className='border-[#e6ebf1] my-5' />
              <Heading className='text-[26px] font-bold text-gray-900 mb-[24px] text-center mt-0'>
                Application Submitted Successfully
              </Heading>
              <Text className='text-[#525f7f] text-base leading-6 text-left text-[20px]'>
                Greeting {name}.
              </Text>
              <Text className='text-[#525f7f] text-base leading-6 text-left'>
                Thank you for submitting your application! Your application is
                currently under review and it will take a few days for our
                support team to carefully review all the details.
              </Text>
              <Text className='text-[#525f7f] text-base leading-6 text-left'>
                Once the review process is complete, you will receive an email
                notification with the updated status of your application.
              </Text>
              <Button
                className='bg-[#656ee8] rounded-[3px] text-white text-[16px] font-bold no-underline text-center block p-[10px]'
                href={`${baseUrl}/teach/apply`}
              >
                Check Status on This Page
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

ApplicationSubmitted.PreviewProps = {
  name: 'Ahmed Haitham',
};

export default ApplicationSubmitted;
