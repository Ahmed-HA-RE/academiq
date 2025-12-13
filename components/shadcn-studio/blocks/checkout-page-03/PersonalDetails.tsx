import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'

const PersonalDetails = ({ setActiveAccordionItem }: { setActiveAccordionItem: (value: string) => void }) => {
  return (
    <form>
      <div className='grid grid-cols-1 gap-x-5 gap-y-6 sm:max-md:grid-cols-2 lg:grid-cols-2'>
        <div className='space-y-3.5'>
          <Label htmlFor='firstName'>First Name</Label>
          <Input type='text' placeholder='First Name' id='firstName' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='lastName'>Last Name</Label>
          <Input type='text' placeholder='Last Name' id='lastName' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='email'>Email Address</Label>
          <Input type='email' placeholder='Email address' id='email' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='phone'>Phone</Label>
          <Input type='tel' placeholder='Phone' id='phone' required />
        </div>

        <div className='space-y-3.5 sm:max-md:col-span-2 lg:col-span-2'>
          <Label htmlFor='address'>Mailing Address</Label>
          <Input type='text' placeholder='Mailing Address' id='address' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='city'>City</Label>
          <Input type='text' placeholder='City' id='city' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='postCode'>Post Code</Label>
          <Input type='text' placeholder='Post Code' id='postCode' required />
        </div>

        <div className='space-y-3.5'>
          <Label htmlFor='country'>Country</Label>
          <Input type='text' placeholder='Country' id='country' required />
        </div>

        <div>
          <Label htmlFor='region' className='mb-3.5'>
            Region/State
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

        <div>
          <Button type='submit' onClick={() => setActiveAccordionItem('item-2')}>
            Next Step
          </Button>
        </div>
      </div>
    </form>
  )
}

export default PersonalDetails
