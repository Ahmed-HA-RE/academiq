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

type ApplicationStatusProps = {
  name: string;
  status: string;
};

const ApplicationStatus = ({ name, status }: ApplicationStatusProps) => {
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
          <Preview>Application Status Updated</Preview>
          <Container className='bg-white mx-auto py-5 my-16'>
            <Section className='px-12'>
              <Img
                src={`${baseImageUrl}/logo.png`}
                width={52}
                height={52}
                alt={APP_NAME}
              />
              <Hr className='border-[#e6ebf1] my-5' />
              <Heading
                className={`text-[26px] font-bold mb-[24px] text-center mt-0 ${
                  status === 'approved' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {status === 'approved'
                  ? 'Application Approved!'
                  : 'Application Status Update'}
              </Heading>
              <Text className='text-[#525f7f] text-base leading-6 text-left text-[20px]'>
                {status === 'approved'
                  ? `Congratulations ${name}!`
                  : `Greeting ${name}.`}
              </Text>
              {status === 'approved' ? (
                <>
                  <Text className='text-[#525f7f] text-base leading-6 text-left'>
                    We are pleased to inform you that your application to become
                    an instructor on {APP_NAME} has been approved! Welcome to
                    our community of educators.
                  </Text>
                  <Text className='text-[#525f7f] text-base leading-6 text-left'>
                    You can now start creating and publishing courses. Click the
                    button below to get started with your instructor dashboard.
                  </Text>
                </>
              ) : (
                <>
                  <Text className='text-[#525f7f] text-base leading-6 text-left'>
                    We appreciate your interest in becoming an instructor on{' '}
                    {APP_NAME}. After careful review, we regret to inform you
                    that we are unable to approve your application at this time.
                  </Text>
                  <Text className='text-[#525f7f] text-base leading-6 text-left'>
                    This decision does not reflect on your qualifications or
                    expertise. You are welcome to reapply in the future once you
                    have gained additional experience or updated your
                    application materials.
                  </Text>
                </>
              )}

              <Button
                className={`rounded-[3px] text-white text-[16px] font-bold no-underline text-center block p-[10px] ${
                  status === 'approved' ? 'bg-green-600' : 'bg-red-600'
                }`}
                href={`${baseUrl}${
                  status === 'approved'
                    ? '/instructor-dashboard'
                    : '/teach/apply'
                }`}
              >
                {status === 'approved'
                  ? 'Go to Instructor Dashboard'
                  : 'View Application Details'}
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

ApplicationStatus.PreviewProps = {
  name: 'Ahmed Haitham',
  status: 'rejected',
};

export default ApplicationStatus;
