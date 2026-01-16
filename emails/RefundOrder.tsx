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

type RefundOrderProps = {
  refundCode: string;
  name: string;
  orderId: string;
  refundAmount: string;
  refundDate: string;
};

const RefundOrder = ({
  refundCode,
  name,
  orderId,
  refundAmount,
  refundDate,
}: RefundOrderProps) => (
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
        <Preview>Refund Processed — Your Order Has Been Refunded</Preview>
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
          <Heading className='text-[#1d1c1d] text-3xl font-bold mt-[20px] mb-[25px] mx-0 p-0 leading-[42px]'>
            Your Refund Has Been Issued
          </Heading>
          <Text className='text-xl'>Greeting {name},</Text>
          <Text className='text-base mb-7.5'>
            We wanted to let you know that your refund for Order #{orderId} has
            been successfully processed.
          </Text>

          <Section className='mb-7.5 mt-0'>
            <Text className='text-base mb-2 font-semibold mt-0'>
              Refund Details:
            </Text>
            <Text className='text-base ml-4 my-1'>• Order ID: #{orderId}</Text>
            <Text className='text-base ml-4 my-1'>
              • Refund Amount: AED {refundAmount}
            </Text>
            <Text className='text-base ml-4 my-1'>
              • Refund Date: {refundDate}
            </Text>
            <Text className='text-base ml-4 my-1'>
              • Refund Reference: {refundCode}
            </Text>
          </Section>

          <Section className='bg-[rgb(245,244,245)] rounded mb-[30px] py-10 px-[10px]'>
            <Text className='text-3xl leading-[24px] text-center align-middle'>
              {refundCode}
            </Text>
          </Section>

          <Text className='text-black text-base leading-6'>
            You should see the refunded amount reflected in your original
            payment method within 5-10 business days, depending on your bank.
          </Text>
          <Text className='text-base'>
            If you don&apos;t see the refund after that time, you can contact
            your bank with the refund reference above to help track it.
          </Text>
          <Text className='mt-10 mb-4'>Warm regards, The {APP_NAME} Team.</Text>
          <Hr />
          <Section>
            <Row className=' pl-2 pr-2'>
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
          <Text className='text-xs leading-[15px] text-left  mb-[50px] text-[#b7b7b7]'>
            ©{new Date().getFullYear()} Academiq, Abu Dhabi, UAE
            <br /> <br />
            All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

RefundOrder.PreviewProps = {
  refundCode: 'ABC123DEF456',
  name: 'John Doe',
  orderId: 'ABCDEFGH1234',
  refundAmount: '249.99',
  refundDate: 'December 27, 2025',
};

export default RefundOrder;
