import { config } from 'dotenv';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
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

config();

const baseImageUrl =
  process.env.NODE_ENV === 'production'
    ? `${process.env.NEXT_PUBLIC_PROD_URL}/images`
    : `${process.env.NEXT_PUBLIC_DEV_EMAIL_URL}/static`;

type SuccessfulSubscriptionProps = {
  userName: string;
};

const SuccessfulSubscription = ({ userName }: SuccessfulSubscriptionProps) => (
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
        <Preview>Welcome to {APP_NAME} Community</Preview>
        <Container className='mx-auto my-[40px] max-w-[600px] rounded border border-[#eaeaea] border-solid p-[20px]'>
          <Section className='mt-8'>
            <Img
              src={`${baseImageUrl}/logo.png`}
              alt={`${APP_NAME} logo`}
              width='60'
              height='60'
              className='mx-auto'
            />
          </Section>
          <Heading className='text-[#1d1c1d] text-3xl font-bold my-[30px] mt-[20px] mx-0 p-0 leading-[42px]'>
            {`Welcome to ${APP_NAME} Community 🎉 ${userName} `}
          </Heading>
          <Text className='text-[18px] text-gray-700 mb-[20px] m-0 leading-relaxed'>
            Congratulations! Your subscription has been successfully activated.
          </Text>
          <Text className='text-lg mb-7.5'>
            You now have full access to unlimited courses and learning
            materials, designed to let you learn at your own pace. Whether you
            prefer short focused sessions or deep learning marathons, everything
            is available whenever you&apos;re ready to continue.
          </Text>
          <Text className='text-lg mb-7.5'>
            You&apos;re always in full control of your subscription. From your
            account page, you can upgrade, downgrade, or cancel your plan at any
            time, with your access remaining active until the end of your
            current billing period.
          </Text>

          <Text className='text-lg mb-7.5'>
            If you ever have questions, need guidance, or want help choosing
            what to learn next, don&apos;t hesitate to reach out. Our community
            and instructor support are here to help you get the most out of your
            learning journey.
          </Text>

          <Text className='text-sm font-medium text-gray-500 mb-7.5'>
            Note: To connect with other learners and engage directly with
            instructors, click on the WhatsApp icon to join our community.
            You&apos;ll be able to participate in discussions, share ideas, ask
            questions, and learn alongside others on the same journey.
          </Text>

          <Text className='text-base font-light text-[#404040] leading-[26px]'>
            Happy Learning!
          </Text>

          <Hr className='my-7.5' />

          {/* Footer */}
          <Section className='bg-gray-50 px-[40px] py-[32px]'>
            <Text className='text-[14px] text-gray-500 mb-[16px] mt-0 text-center'>
              © {new Date().getFullYear()} Academiq. All rights reserved.
              <br />
              Abu Dhabi, United Arab Emirates
            </Text>

            <Row>
              <Column className='w-1/2'>
                <Text className='text-gray-700 text-base leading-6 text-left'>
                  — The {APP_NAME} team
                </Text>
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
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default SuccessfulSubscription;
