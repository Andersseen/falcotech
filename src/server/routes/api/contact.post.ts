import { createError, defineEventHandler, readBody } from 'h3';
import { Resend } from 'resend';

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown> | null>(event);
  const username = typeof body?.['username'] === 'string' ? body['username'].trim() : '';
  const email = typeof body?.['email'] === 'string' ? body['email'].trim() : '';
  const message = typeof body?.['message'] === 'string' ? body['message'].trim() : '';

  if (!username || username.length > 120 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      !message || message.length > 5000) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid contact details' });
  }

  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: 'Contact service unavailable' });
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: 'hello@andersseen.dev',
    to: ['info@falcotech.es'],
    replyTo: email,
    subject: 'Correo electrónico desde la web',
    text: `Email: ${email}\nNombre y apellido: ${username}\n\n${message}`,
  });

  if (error) {
    throw createError({ statusCode: 502, statusMessage: 'Contact delivery failed' });
  }

  return { success: true };
});
