'use client';

import { useState, useRef } from 'react';
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from '@knocklabs/react';
import '@knocklabs/react/dist/index.css';
import { auth } from '@/lib/auth';
import { useTheme } from 'next-themes';

const NotificationMenu = ({
  session,
  userToken,
}: {
  session: typeof auth.$Infer.Session | null;
  userToken: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const { theme } = useTheme();

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY}
      user={{ id: session?.user?.id }}
      userToken={userToken}
    >
      <KnockFeedProvider
        feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID}
        colorMode={theme === 'dark' ? 'dark' : 'light'}
      >
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={() => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
};

export default NotificationMenu;
