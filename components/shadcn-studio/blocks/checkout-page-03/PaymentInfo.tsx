import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'

const PaymentInfo = () => {
  return (
    <form>
      <p className='text-muted-foreground mb-6'>Add a new payment method</p>
      <div className='grid grid-cols-1 gap-6 sm:max-md:grid-cols-2 lg:grid-cols-2'>
        <div className='space-y-3.5'>
          <Label htmlFor='card-holder-name'>Full name*</Label>
          <Input type='text' placeholder='John Doe' id='card-holder-name' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='card-number'>Card Number*</Label>
          <Input type='text' placeholder='xxxx xxxx xxxx xxxx' id='card-number' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='card-expiration'>Card expiration*</Label>
          <Input type='text' placeholder='MM/YY' id='card-expiration' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='card-cvv'>CVV*</Label>
          <Input type='text' placeholder='***' id='card-cvv' required />
        </div>
      </div>

      <div className='mt-6 space-y-6'>
        <Button type='submit' size='lg' className='w-full'>
          Pay Now
        </Button>

        <div className='text-muted-foreground'>
          Payment processed by{' '}
          <a href='#' className='text-primary hover:underline'>
            Paddle
          </a>{' '}
          for{' '}
          <a href='#' className='text-primary hover:underline'>
            ShadcnStudio
          </a>{' '}
          - United States Of America
        </div>
      </div>
    </form>
  )
}

export default PaymentInfo
