import { config } from 'dotenv';
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from '@react-email/components';
import { APP_NAME } from '@/lib/constants';

interface TwitchResetPasswordEmailProps {
  username: string;
  updatedDate?: Date;
  url: string;
}
export const ResetPassword = ({
  username,
  updatedDate,
  url,
}: TwitchResetPasswordEmailProps) => {
  const formattedDate = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(updatedDate);

  config();

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
      <Head>
        <style>
          {`
           @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
            *{
            font-family: 'Outfit', sans-serif;
            }`}
        </style>
      </Head>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className='bg-[#efeef1] font-twitch'>
          <Preview>
            You updated the password for your {APP_NAME} account
          </Preview>
          <Container className='max-w-[580px] my-[30px] mx-auto bg-white'>
            <Section className='p-[10px]'>
              <Img
                width={50}
                src={`${baseImageUrl}/logo.png`}
                alt={`${APP_NAME}`}
                className='mx-auto'
              />
            </Section>
            <Section className='w-full'>
              <Row>
                <Column className='[border-bottom:1px_solid_rgb(238,238,238)] w-[249px]' />
                <Column className='[border-bottom:1px_solid_black] w-[102px]' />
                <Column className='[border-bottom:1px_solid_rgb(238,238,238)] w-[249px]' />
              </Row>
            </Section>
            <Section className='pt-[5px] px-5 pb-[10px]'>
              <Text className='text-[14px] leading-[1.5]'>Hi {username},</Text>
              <Text className='text-[14px] leading-[1.5]'>
                You updated the password for your {APP_NAME} account on{' '}
                {formattedDate}. If this was you, then no further action is
                required.
              </Text>
              <Text className='text-[14px] leading-[1.5]'>
                However if you did NOT perform this password change, please{' '}
                <Link href={url} className='underline'>
                  reset your account password
                </Link>{' '}
                immediately.
              </Text>
              <Text className='text-[14px] leading-[1.5]'>
                Remember to use a password that is both strong and unique to
                your {APP_NAME} account.
              </Text>

              <Text className='text-[14px] leading-[1.5]'>
                Thanks,
                <br />
                {APP_NAME} Support Team
              </Text>
            </Section>
          </Container>

          <Section className='max-w-[580px] mx-auto'>
            <Row>
              <Column align='right' className=' pr-2'>
                <Img
                  src={`${baseImageUrl}/insta.png`}
                  alt='Instagram'
                  width={40}
                  height={40}
                />
              </Column>
              <Column align='left' className=' pl-2'>
                <Img
                  src={`${baseImageUrl}/whatsapp.png`}
                  alt='WhatsApp'
                  width={40}
                  height={40}
                />
              </Column>
            </Row>
            <Row>
              <Text className='text-xs leading-[15px] mb-[50px] text-[#b7b7b7] text-center'>
                ©{new Date().getFullYear()} Academiq, Abu Dhabi, UAE
                <br /> <br />
                All rights reserved.
              </Text>
            </Row>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default ResetPassword;
