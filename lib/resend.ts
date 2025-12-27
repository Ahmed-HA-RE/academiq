import { Resend } from 'resend';

export const domain = process.env.RESEND_DOMAIN;

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
