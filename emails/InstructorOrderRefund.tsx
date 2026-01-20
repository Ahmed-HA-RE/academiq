import { APP_NAME } from '@/lib/constants';
import { config } from 'dotenv';
import {
  Body,
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

type InstructorOrderRefundProps = {
  instructorName: string;
  courseName: string;
  refundAmount: number;
};

const InstructorOrderRefund = ({
  instructorName,
  courseName,
  refundAmount,
}: InstructorOrderRefundProps) => {
  const baseImageUrl =
    process.env.NODE_ENV === 'production'
      ? `${process.env.NEXT_PUBLIC_PROD_URL}/images`
      : `${process.env.NEXT_PUBLIC_DEV_EMAIL_URL}/static`;

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
  }).format(refundAmount);

  return (
    <Html>
      <Head />
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className='bg-[#f6f9fc] font-stripe'>
          <Preview>
            A refund has been processed for one of your courses.
          </Preview>
          <Container className='bg-white mx-auto py-5 my-16'>
            <Section className='px-12'>
              <Img
                src={`${baseImageUrl}/logo.png`}
                width={52}
                height={52}
                alt={APP_NAME}
                className='mx-auto'
              />
              <Hr className='border-[#e6ebf1] my-5' />
              <Heading className='text-2xl text-center text-gray-800 font-bold mb-6'>
                Refund Processed for Your Course
              </Heading>
              <Text className='text-gray-700 text-base leading-6 text-left text-[20px]'>
                Hello {instructorName},
              </Text>
              <Text className='text-gray-700 text-base leading-6 text-left inline-block'>
                This is an automated notification to inform you that a refund
                has been successfully processed for an enrollment in your
                course:
              </Text>
              <Text className='text-gray-900 text-lg font-semibold mt-4 mb-2 text-left'>
                {courseName}
              </Text>

              <Section className='bg-gray-50 border border-gray-200  p-6 my-6 text-center'>
                <Text className='text-sm text-gray-500 m-0'>
                  Amount Refunded
                </Text>
                <Text className='text-4xl font-bold text-red-700 m-0'>
                  {formattedAmount}
                </Text>
              </Section>

              <Text className='text-gray-700 text-base leading-6 text-left'>
                This refunded amount will be deducted from your next payout. You
                can review the updated earnings details on the payments page in
                your instructor dashboard.
              </Text>
              <Hr className='border-[#e6ebf1] my-5' />
              <Text className='text-gray-700 text-base leading-6 text-left'>
                — The {APP_NAME} team
              </Text>
              <Text className='text-xs leading-[15px] text-left my-0 text-gray-400'>
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

InstructorOrderRefund.PreviewProps = {
  instructorName: 'Ahmed Haitham',
  coursesName: ['The Ultimate Next.js 14 Course', 'Mastering React.js'],
  refundAmount: 149.0,
};

export default InstructorOrderRefund;
