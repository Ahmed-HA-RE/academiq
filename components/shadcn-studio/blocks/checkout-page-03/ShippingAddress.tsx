import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'

const ShippingAdress = ({ setActiveAccordionItem }: { setActiveAccordionItem: (value: string) => void }) => {
  return (
    <form>
      <div className='grid grid-cols-1 gap-x-5 gap-y-6 sm:max-md:grid-cols-2 lg:grid-cols-2'>
        <div className='col-span-full flex items-center gap-3'>
          <Checkbox id='same-as-billing-address' className='size-6' />
          <Label htmlFor='same-as-billing-address'>Shipping address is the same as my billing address</Label>
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='firstNameShipping'>First Name</Label>
          <Input type='text' placeholder='First Name' id='firstNameShipping' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='lastNameShipping'>Last Name</Label>
          <Input type='text' placeholder='Last Name' id='lastNameShipping' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='addressLine1'>Address Line 1</Label>
          <Input type='text' placeholder='Address Line 1' id='addressLine1' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='addressLine2'>Address Line 2</Label>
          <Input type='text' placeholder='Address Line 2' id='addressLine2' required />
        </div>

        <div>
          <Label htmlFor='addressType' className='mb-3.5'>
            Address Type
          </Label>
          <Select>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select address type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='house'>House</SelectItem>
              <SelectItem value='apartment'>Apartment</SelectItem>
              <SelectItem value='office'>Office</SelectItem>
              <SelectItem value='other'>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='zipCode'>Zip</Label>
          <Input type='text' placeholder='Zip Code' id='zipCode' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='city2'>City</Label>
          <Input type='text' placeholder='City' id='city2' required />
        </div>

        <div>
          <Label htmlFor='state' className='mb-3.5'>
            State
          </Label>
          <Select>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a state' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='california'>California</SelectItem>
              <SelectItem value='new-york'>New York</SelectItem>
              <SelectItem value='texas'>Texas</SelectItem>
              <SelectItem value='florida'>Florida</SelectItem>
              <SelectItem value='illinois'>Illinois</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='mobilePhone'>Mobile Phone</Label>
          <Input type='tel' placeholder='Mobile Phone' id='mobilePhone' required />
        </div>
      </div>

      <div className='mt-6'>
        <Button type='submit' onClick={() => setActiveAccordionItem('item-3')}>
          Next Step
        </Button>
      </div>
    </form>
  )
}

export default ShippingAdress
