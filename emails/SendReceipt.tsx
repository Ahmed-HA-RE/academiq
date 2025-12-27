import { config } from 'dotenv';
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  pixelBasedPreset,
  Link,
} from '@react-email/components';
import { Discount, Order } from '@/types';
import { formatDate } from '@/lib/utils';
type SendReceiptProp = {
  order: Order;
  discount: Discount | null;
};

config();

const SendReceipt = ({ order, discount }: SendReceiptProp) => {
  const baseImageUrl =
    process.env.NODE_ENV === 'production'
      ? `${process.env.NEXT_PUBLIC_PROD_URL}/images`
      : `${process.env.NEXT_PUBLIC_DEV_EMAIL_URL}/static`;
  return (
    <Tailwind config={{ presets: [pixelBasedPreset] }}>
      <Html>
        <Head />
        <Body>
          <Preview>Your order receipt - Order #{order.id}</Preview>
          <Container className='max-w-[580px] mx-auto p-[32px] sm:p-[40px]'>
            {/* Header */}
            <Section className='text-center mb-[28px] px-2'>
              <Img
                src={`${baseImageUrl}/logo.png`}
                alt='Logo'
                width={50}
                className='mx-auto'
              />
              <Heading className='text-[24px] sm:text-[28px] font-bold text-gray-900 m-0 my-[8px]'>
                Order Receipt
              </Heading>
              <Text className='text-[15px] sm:text-[16px] text-gray-600 m-0'>
                Thank you for your purchase! Below are the details of your
                order.
              </Text>
            </Section>

            {/* Order Details */}
            <Section className='mb-[28px] bg-gray-50 rounded-md p-[20px]'>
              <Row className='mb-[6px] items-center'>
                <Column className='w-[60%]'>
                  <Text className='text-[14px] text-gray-700 m-0'>
                    <span className='font-semibold'>Order ID:</span>{' '}
                    <span className='font-bold'>#{order.id}</span>
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className='text-[14px] text-gray-700 m-0'>
                    <span className='font-semibold'>Date:</span>{' '}
                    <span className='font-bold'>
                      {formatDate(order.createdAt, 'date')}
                    </span>
                  </Text>
                </Column>
              </Row>
              <Row className='mt-[12px]'>
                <Column>
                  <Text className='text-[14px] text-gray-700 m-0'>
                    <span className='font-semibold'>Customer Email:</span>{' '}
                    <span className='font-bold'>
                      {order.billingDetails.email}
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Items Section */}
            <Section className='mb-[32px] p-[20px]'>
              <Heading className='text-[20px] font-bold text-gray-900 m-0 mb-[24px]'>
                Order Items
              </Heading>

              {/* Item Header */}
              <Row className='border-b border-gray-200 pb-[10px] mb-[12px]'>
                <Column className='w-[60px]'>
                  <Text className='text-[12px] font-semibold text-gray-500 m-0'>
                    ITEM
                  </Text>
                </Column>
                <Column></Column>
                <Column className='w-[80px] text-right'>
                  <Text className='text-[12px] font-semibold text-gray-500 m-0'>
                    PRICE
                  </Text>
                </Column>
              </Row>

              {/* Item Rows */}
              {order.orderItems.map((item, index) => (
                <Row
                  key={index}
                  className='border-b border-gray-100 py-[12px] items-center'
                >
                  <Column className='w-[50px] pr-[12px]'>
                    <Img
                      src={item.image}
                      alt={item.name}
                      className='w-full rounded-md'
                    />
                  </Column>
                  <Column className='pr-[12px] w-[70px]'>
                    <Text className='text-[15px] text-gray-900 m-0 mb-[4px]'>
                      {item.name}
                    </Text>
                  </Column>
                  <Column className='w-[40px] text-right'>
                    <Text className='text-[15px] font-bold text-gray-900 m-0'>
                      AED {item.price}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Order Summary */}
            <Section className='mt-[8px] p-[20px] bg-gray-50 rounded-md '>
              <Row className='mb-[8px]'>
                <Column>
                  <Text className='text-[15px] text-gray-700 m-0'>
                    Subtotal
                  </Text>
                </Column>
                <Column className='text-right'>
                  <Text className='text-[15px] text-gray-900 m-0'>
                    AED {order.itemsPrice}
                  </Text>
                </Column>
              </Row>
              {discount && (
                <Row className='mb-[8px]'>
                  <Column>
                    <Text className='text-[15px] text-gray-700 m-0'>
                      Discount
                    </Text>
                  </Column>
                  <Column className='text-right'>
                    <Text className='text-[15px] text-gray-900 m-0'>
                      {discount.type === 'percentage'
                        ? `- %${discount.amount}`
                        : `- AED ${discount.amount}`}
                    </Text>
                  </Column>
                </Row>
              )}
              <Row className='mb-[8px]'>
                <Column>
                  <Text className='text-[15px] text-gray-700 m-0'>Tax</Text>
                </Column>

                <Column className='text-right'>
                  <Text className='text-[15px] text-gray-900 m-0'>
                    AED {order.taxPrice}
                  </Text>
                </Column>
              </Row>
              <Row className='border-t border-gray-300 pt-[12px] mt-[8px]'>
                <Column>
                  <Text className='text-[18px] font-bold text-gray-900 m-0'>
                    Total
                  </Text>
                </Column>
                <Column className='text-right'>
                  <Text className='text-[18px] font-bold text-gray-900 m-0'>
                    AED {order.totalPrice}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Footer */}
            <Section className='mt-[28px] p-[20px]'>
              <Row className='items-center  mb-[12px]'>
                <Column className='w-[50%]'>
                  <Img
                    src={`${baseImageUrl}/logo.png`}
                    alt='App Logo'
                    className='w-[50px]'
                  />
                </Column>
                <Column className='w-[50%] text-right'>
                  <Link href='https://www.instagram.com'>
                    <Img
                      src={`${baseImageUrl}/insta.png`}
                      alt='Instagram'
                      className='w-[32px]  inline-block'
                    />
                  </Link>
                  <Link href='https://www.whatsapp.com'>
                    <Img
                      src={`${baseImageUrl}/whatsapp.png`}
                      alt='WhatsApp'
                      className='w-[32px] inline-block ml-[12px]'
                    />
                  </Link>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className='text-[12px] text-gray-500 m-0'>
                    ©{new Date().getFullYear()} Academiq, Abu Dhabi, UAE
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

SendReceipt.PreviewProps = {
  order: {
    id: '123456',
    billingDetails: {
      email: 'user@example.com',
    },
    orderItems: [
      {
        name: 'React Modern Course',
        image:
          'https://res.cloudinary.com/ahmed--dev/image/upload/v1765549332/tailwind-course_fdlmix.png',
        price: 100,
      },
      {
        name: 'React Modern Course',
        image:
          'https://res.cloudinary.com/ahmed--dev/image/upload/v1765549332/tailwind-course_fdlmix.png',
        price: 150,
      },
    ],
    itemsPrice: 250,
    taxPrice: 25,
    totalPrice: 275,
  },
  discount: {
    amount: 25,
    type: 'percentage',
  },
};

export default SendReceipt;
