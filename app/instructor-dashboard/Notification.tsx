import { SettingsIcon, XIcon, LinkIcon, BellIcon } from 'lucide-react';

import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/app/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/app/components/ui/dropdown-menu';

const Notification = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative cursor-pointer focus-visible:ring-0 mr-2'
        >
          <BellIcon />
          <span className='bg-destructive absolute top-2 right-2.5 size-2 rounded-full' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='max-w-xs sm:max-w-122' align='end'>
        <Tabs defaultValue='inbox' className='gap-0'>
          <DropdownMenuLabel className='flex flex-col pb-0'>
            <div className='flex items-center justify-between gap-6 pb-2.5'>
              <span className='text-muted-foreground text-base font-normal uppercase'>
                Notifications
              </span>
              <Badge
                variant='secondary'
                className='bg-primary/10 text-primary font-normal'
              >
                8 New
              </Badge>
            </div>
            <div className='-mb-0.5 flex items-center justify-between gap-4'>
              <TabsList className='relative h-fit rounded-none bg-transparent p-0'>
                <TabsTrigger
                  value='inbox'
                  className='data-[state=active]:!border-b-primary rounded-none border-b-2 border-b-transparent font-normal data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent'
                >
                  Inbox
                </TabsTrigger>
                <TabsTrigger
                  value='general'
                  className='data-[state=active]:!border-b-primary rounded-none border-b-2 border-b-transparent font-normal data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent'
                >
                  General
                </TabsTrigger>
              </TabsList>
              <SettingsIcon className='size-5' />
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className='mt-0 h-0.5' />

          <TabsContent value='inbox'>
            <DropdownMenuItem className='gap-3 px-2 py-3 text-base'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-19.png' />
                <AvatarFallback>AH</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>Ahmed</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>
                    12 Minutes ago
                  </span>
                  <div className='bg-muted size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>
                    New post
                  </span>
                </div>
              </div>
              <div className='flex flex-col items-center gap-3'>
                <XIcon className='text-foreground size-3.5' />
                <div className='bg-primary size-1.5 rounded-full' />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-3 px-2 py-3 text-base'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png' />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>Omar</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>
                    27 Minutes ago
                  </span>
                  <div className='bg-muted size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>
                    New comment
                  </span>
                </div>
              </div>
              <div className='flex flex-col items-center gap-3'>
                <XIcon className='text-foreground size-3.5' />
                <div className='bg-primary size-1.5 rounded-full' />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='items-start gap-3 px-2 py-3 text-base'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png' />
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>
                  Ali has applied to create an ad for your campaign
                </span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>
                    2 hours ago
                  </span>
                  <div className='bg-muted size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>
                    New request for campaign
                  </span>
                </div>
                <div className='mt-3 flex items-center gap-4'>
                  <Button variant='secondary' size='sm'>
                    Decline
                  </Button>
                  <Button size='sm'>Accept</Button>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='items-start gap-3 px-2 py-3 text-base'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png' />
                <AvatarFallback>MH</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>
                  Test attached the file
                </span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>
                    6 hours ago
                  </span>
                  <div className='bg-muted size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>
                    Attached files
                  </span>
                </div>
                <div className='mt-3 flex items-center gap-1.5'>
                  <LinkIcon className='text-foreground' />
                  <span className='text-sm'>Work examples.com</span>
                </div>
              </div>
            </DropdownMenuItem>
          </TabsContent>

          <TabsContent value='general'>
            <DropdownMenuItem className='gap-3 px-2 py-3 text-base'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png' />
                <AvatarFallback>T</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>Test</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>
                    39 Minutes ago
                  </span>
                  <div className='bg-muted size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>
                    New comment
                  </span>
                </div>
              </div>
              <div className='flex flex-col items-center gap-3'>
                <XIcon className='text-foreground size-3.5' />
                <div className='bg-primary size-1.5 rounded-full' />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='items-start gap-3 px-2 py-3 text-base'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png' />
                <AvatarFallback>T</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>
                  Test attached the file
                </span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>
                    3 hours ago
                  </span>
                  <div className='bg-muted size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>
                    Attached files
                  </span>
                </div>
                <div className='mt-3 flex items-center gap-1.5'>
                  <LinkIcon className='text-foreground' />
                  <span className='text-sm'>Work examples.com</span>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-3 px-2 py-3 text-base'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-11.png' />
                <AvatarFallback>T</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>Test</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>
                    5 hours ago
                  </span>
                  <div className='bg-muted size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>
                    New post
                  </span>
                </div>
              </div>
              <div className='flex flex-col items-center gap-3'>
                <XIcon className='text-foreground size-3.5' />
                <div className='bg-primary size-1.5 rounded-full' />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='items-start gap-3 px-2 py-3 text-base'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png' />
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>
                  Ali has applied to create an ad for your campaign
                </span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>
                    8 hours ago
                  </span>
                  <div className='bg-muted size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>
                    New request for campaign
                  </span>
                </div>
                <div className='mt-3 flex items-center gap-4'>
                  <Button variant='secondary' size='sm'>
                    Decline
                  </Button>
                  <Button size='sm'>Accept</Button>
                </div>
              </div>
            </DropdownMenuItem>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
