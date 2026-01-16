import { config } from 'dotenv';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
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

config();

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_URL
    : process.env.NEXT_PUBLIC_DEV_URL;

const baseImageUrl =
  process.env.NODE_ENV === 'production'
    ? `${process.env.NEXT_PUBLIC_PROD_URL}/images`
    : `${process.env.NEXT_PUBLIC_DEV_EMAIL_URL}/static`;

type EmailVerificationProps = {
  verificationCode: string;
  title: string;
  description: string;
};

const VerificationOTP = ({
  verificationCode,
  title,
  description,
}: EmailVerificationProps) => (
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
      <Body className='bg-white font-slack mx-auto my-0'>
        <Preview>{title}</Preview>
        <Container className='mx-auto my-0 py-0 px-5'>
          <Section className='mt-8'>
            <Img
              src={`${baseImageUrl}/logo.png`}
              alt='Academiq'
              width='60'
              height='60'
              className='mx-auto'
            />
          </Section>
          <Heading className='text-[#1d1c1d] text-4xl font-bold my-[30px] mt-[10px] mx-0 p-0 leading-[42px]'>
            {title}
          </Heading>
          <Text className='text-xl mb-7.5'>{description}</Text>

          <Section className='bg-[rgb(245,244,245)] rounded mb-[30px] py-10 px-[10px]'>
            <Text className='text-3xl leading-[24px] text-center align-middle'>
              {verificationCode}
            </Text>
          </Section>

          <Text className='text-black text-sm leading-6'>
            If you didn&apos;t request this email, there&apos;s nothing to worry
            about, you can safely ignore it.
          </Text>
          <Text>Note: This code will expire in 2 hours.</Text>

          <Section>
            <Row className='mb-8 pl-2 pr-2'>
              <Column className='w-2/3'>
                <Img
                  src={`${baseImageUrl}/logo.png`}
                  width='50'
                  height='50'
                  alt='Academiq'
                />
              </Column>
              <Column align='right'>
                <Link href='https://www.instagram.com'>
                  <Img
                    src={`${baseImageUrl}/insta.png`}
                    width='34'
                    height='34'
                    alt='Instagram'
                    className='inline ml-2'
                  />
                </Link>
                <Link href='https://www.whatsapp.com'>
                  <Img
                    src={`${baseImageUrl}/whatsapp.png`}
                    width='36'
                    height='36'
                    alt='WhatsApp'
                    className=' ml-2 inline'
                  />
                </Link>
              </Column>
            </Row>
          </Section>

          <Section>
            <Link
              className='text-[#b7b7b7] underline'
              href={`${baseUrl}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Home
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className='text-[#b7b7b7] underline'
              href={`${baseUrl}/courses`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Courses
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className='text-[#b7b7b7] underline'
              href={`${baseUrl}/about`}
              target='_blank'
              rel='noopener noreferrer'
            >
              About Us
            </Link>
            <Text className='text-xs leading-[15px] text-left mb-[50px] text-[#b7b7b7]'>
              ©{new Date().getFullYear()} Academiq, Abu Dhabi, UAE
              <br /> <br />
              All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);
export default VerificationOTP;
