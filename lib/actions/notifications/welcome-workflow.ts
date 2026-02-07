'use server';
import { knock } from '@/lib/knock';

export const welcomeWorkFlow = async (userId: string) => {
  await knock.workflows.trigger('welcome-message', {
    recipients: [userId],
    actor: 'academiq-support',
  });
};
