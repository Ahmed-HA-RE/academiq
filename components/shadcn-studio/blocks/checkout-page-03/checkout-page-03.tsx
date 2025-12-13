'use client'

import { useState } from 'react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Separator } from '@/app/components/ui/separator'
import PersonalDetails from '@/components/shadcn-studio/blocks/checkout-page-03/PersonalDetails'
import ShippingAdress from '@/components/shadcn-studio/blocks/checkout-page-03/ShippingAddress'
import PaymentInfo from '@/components/shadcn-studio/blocks/checkout-page-03/PaymentInfo'

type CartItem = {
  id: number
  name: string
  description: string
  price: number
  image: string
}[]

const Checkout = ({ cartItems }: { cartItems: CartItem }) => {
  const [activeAccordionItem, setActiveAccordionItem] = useState<string>('item-1')

  const AccordionItems = [
    {
      title: 'Your Personal Details',
      content: <PersonalDetails setActiveAccordionItem={setActiveAccordionItem} />
    },
    {
      title: 'Shipping Address',
      content: <ShippingAdress setActiveAccordionItem={setActiveAccordionItem} />
    },
    {
      title: 'Payment Info',
      content: <PaymentInfo />
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const shippingCost = 10.66
  const discount = 9.0
  const total = subtotal + shippingCost - discount

  return (
    <section className='bg-muted py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-5'>
          <div className='space-y-6 md:col-span-2 lg:col-span-2'>
            {/* Coupon Code */}
            <Card className='shadow-none'>
              <CardHeader className='border-b'>
                <CardTitle className='text-xl'>Coupon Code</CardTitle>
                <CardDescription className='text-base'>Enter code to get discount instantly</CardDescription>
              </CardHeader>
              <CardContent className='flex gap-3'>
                <Input type='text' placeholder='Add discount code' />
                <Button>Apply</Button>
              </CardContent>
            </Card>

            {/* Shopping Cart */}
            <Card className='shadow-none'>
              <CardHeader className='border-b'>
                <CardTitle className='text-xl'>Shopping Cart</CardTitle>
                <CardDescription className='text-base'>You have {cartItems.length} items in your cart</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6 px-0'>
                <div className='flex flex-col gap-9'>
                  {cartItems.map(item => (
                    <div key={item.id} className='flex justify-between gap-4 px-6 max-sm:flex-col sm:items-center'>
                      <div className='flex h-full items-center gap-4'>
                        <img src={item.image} alt={item.name} className='size-14.5 rounded-sm object-cover' />
                        <div className='flex flex-col gap-1'>
                          <p className='font-medium'>{item.name}</p>
                          <p className='text-muted-foreground'>{item.description}</p>
                        </div>
                      </div>
                      <div className='sm:text-end'>
                        <span className='text-lg font-semibold'>${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className='space-y-3.5 px-6'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='text-lg'>Subtotal</span>
                    <span className='text-lg font-medium'>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='text-lg'>Shipping Cost (+)</span>
                    <span className='text-lg font-medium'>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className='mb-6 flex items-center justify-between gap-3'>
                    <span className='text-lg'>Discount (-)</span>
                    <span className='text-lg font-medium'>${discount.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className='mb-6' />

                <div className='space-y-6 px-6'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='text-lg font-medium'>Total Payable</span>
                    <span className='text-lg font-semibold'>${total.toFixed(2)}</span>
                  </div>
                  <Button className='w-full' size='lg'>
                    Place Order
                  </Button>
                  <p className='text-muted-foreground'>
                    By placing your order, you agree to our company{' '}
                    <a href='#' className='text-card-foreground font-semibold hover:underline'>
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href='#' className='text-card-foreground font-semibold hover:underline'>
                      Conditions of use
                    </a>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className='md:col-span-2 lg:col-span-3'>
            <Card className='shadow-none'>
              <CardContent>
                <Accordion type='single' collapsible className='w-full space-y-2' value={activeAccordionItem}>
                  {AccordionItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`} className='rounded-md border!'>
                      <AccordionTrigger className='px-5'>{item.title}</AccordionTrigger>
                      <AccordionContent className='px-5'>{item.content}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout
