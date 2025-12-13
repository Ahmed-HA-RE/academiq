import Checkout from '@/components/shadcn-studio/blocks/checkout-page-03/checkout-page-03'

const cartItems = [
  {
    id: 1,
    name: 'Red cap',
    description: 'Red and white cap',
    price: 36.0,
    image: 'https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/checkout/image-10.png'
  },
  {
    id: 2,
    name: 'Oversized T-shirt',
    description: 'Awesome white T-shirt',
    price: 29.0,
    image: 'https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/checkout/image-9.png'
  },
  {
    id: 3,
    name: 'Girl brown T-shirt',
    description: "it's a nice brown t-shirt",
    price: 30.0,
    image: 'https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/checkout/image-8.png'
  }
]

const CheckoutPage = () => {
  return <Checkout cartItems={cartItems} />
}

export default CheckoutPage
