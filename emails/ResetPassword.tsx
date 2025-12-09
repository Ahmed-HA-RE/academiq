import { config } from 'dotenv';

import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from '@react-email/components';
import { APP_NAME } from '@/lib/constants';

config();

type ResetPasswordEmailProps = {
  userName: string;
  resetPasswordLink: string;
};

const ResetPasswordEmail = ({
  userName,
  resetPasswordLink,
}: ResetPasswordEmailProps) => {
  const baseImageUrl =
    process.env.NODE_ENV === 'production'
      ? `${process.env.NEXT_PUBLIC_PROD_URL}/images`
      : `${process.env.NEXT_PUBLIC_DEV_EMAIL_URL}/static`;

  return (
    <Tailwind config={{ presets: [pixelBasedPreset] }}>
      <Html>
        <Head>
          <style>
            {`
           @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
            *{
            font-family: 'Outfit', sans-serif;
            }`}
          </style>
        </Head>
        <Body className='bg-[#f6f9fc] py-2.5'>
          <Preview>{APP_NAME} reset your password</Preview>
          <Container className='bg-white border border-solid border-[#f0f0f0] p-[45px]'>
            <Img
              src={`${baseImageUrl}/logo.png`}
              alt={APP_NAME}
              width='45'
              height='45'
            />
            <Section>
              <Text className='text-lg md:text-xl font-medium  text-[#404040] leading-[26px]'>
                Greeting {userName},
              </Text>
              <Text className='text-base font-light text-[#404040] leading-[26px]'>
                Someone recently requested a password change for your {APP_NAME}{' '}
                account. If this was you, you can set a new password here:
              </Text>
              <Link
                className='bg-[#007ee6] rounded text-white text-[16px] no-underline text-center block w-[210px] py-[14px] px-[7px] cursor-pointer'
                href={resetPasswordLink}
              >
                Reset password
              </Link>
              <Text className='text-base font-light text-[#404040] leading-[26px]'>
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
              <Text className='text-base font-light text-[#404040] leading-[26px]'>
                To keep your account secure, please don&apos;t forward this
                email to anyone.
              </Text>
              <Text className='text-base font-light text-[#404040] leading-[26px]'>
                Happy Learning!
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default ResetPasswordEmail;
