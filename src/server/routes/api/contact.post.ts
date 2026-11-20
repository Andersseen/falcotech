import {
  createError, defineEventHandler, getRequestHeader, getRequestIP, getRequestURL, type H3Event, readBody,
  sendRedirect, setResponseHeader,
} from 'h3';
import { Resend } from 'resend';
import { CONTACT_RESULT_PARAM, type ContactResult, TURNSTILE_RESPONSE_FIELD } from '../../../shared/contact';
import { type ContactMessage, parseContact } from '../../contact/message';
import { createRateLimiter } from '../../contact/rate-limit';
import { turnstileConfig, verifyTurnstile } from '../../contact/turnstile';

const MAX_BODY_BYTES = 16 * 1024;
const limiter = createRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });

export default defineEventHandler(async (event) => {
  // A form posted without JavaScript gets a redirect back to the page instead of a JSON body.
  const nativeForm = (getRequestHeader(event, 'content-type') ?? '').startsWith('application/x-www-form-urlencoded');
  const fail = (statusCode: number, statusMessage: string, result: ContactResult = 'error') => {
    if (nativeForm) return redirectBack(event, result);
    throw createError({ statusCode, statusMessage });
  };

  if (!isSameOrigin(event)) return fail(403, 'Cross-origin request rejected');

  const length = Number(getRequestHeader(event, 'content-length') ?? 0);
  if (length > MAX_BODY_BYTES) return fail(413, 'Request too large');

  const ip = getRequestIP(event, { xForwardedFor: true });
  const retryAfter = limiter.hit(ip ?? 'unknown');
  if (retryAfter > 0) {
    setResponseHeader(event, 'Retry-After', retryAfter);
    return fail(429, 'Too many requests', 'limited');
  }

  const body = await readBody<unknown>(event).catch(() => null);
  const parsed = parseContact(body);
  // Pretend a bot that filled the honeypot succeeded, so it learns nothing from the response.
  if (parsed.kind === 'spam') return nativeForm ? redirectBack(event, 'sent') : { success: true };
  if (parsed.kind === 'invalid') return fail(400, 'Invalid contact details');

  const turnstile = turnstileConfig();
  if (turnstile) {
    const token = (body as Record<string, unknown>)[TURNSTILE_RESPONSE_FIELD];
    if (!(await verifyTurnstile(turnstile, token, ip))) return fail(403, 'Verification failed');
  }

  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) return fail(503, 'Contact service unavailable');

  if (!(await deliver(apiKey, parsed.contact, event))) return fail(502, 'Contact delivery failed');

  return nativeForm ? redirectBack(event, 'sent') : { success: true };
});

async function deliver(apiKey: string, contact: ContactMessage, event: H3Event): Promise<boolean> {
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env['CONTACT_FROM'] || 'FalcoTech Web <hello@andersseen.dev>',
    to: (process.env['CONTACT_TO'] || 'info@falcotech.es').split(',').map(address => address.trim()),
    replyTo: contact.email,
    subject: `Mensaje desde la web: ${contact.username}`,
    text: [
      `Nombre y apellido: ${contact.username}`,
      `Email: ${contact.email}`,
      `Página: ${refererPath(event)}`,
      '',
      contact.message,
    ].join('\n'),
  });

  // Log the failure class only; the message and address are personal data.
  if (error) console.error('[contact] Resend rejected the message:', error.name);
  return !error;
}

/** Rejects posts from other sites. Browsers always send Origin on a cross-site POST. */
function isSameOrigin(event: H3Event): boolean {
  const origin = getRequestHeader(event, 'origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === getRequestURL(event, { xForwardedHost: true }).host;
  } catch {
    return false;
  }
}

/** Path of the page that posted the form, on this site only, so the redirect can never leave it. */
function refererPath(event: H3Event): string {
  const referer = getRequestHeader(event, 'referer');
  if (!referer) return '/';
  try {
    const url = new URL(referer);
    return url.host === getRequestURL(event, { xForwardedHost: true }).host ? url.pathname : '/';
  } catch {
    return '/';
  }
}

function redirectBack(event: H3Event, result: ContactResult) {
  return sendRedirect(event, `${refererPath(event)}?${CONTACT_RESULT_PARAM}=${result}#contact`, 303);
}
