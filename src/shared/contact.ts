// Rules shared by the contact form and POST /api/contact, so both sides reject the same input.

export const CONTACT_LIMITS = {
  username: 120,
  email: 254,
  message: 5000,
} as const;

export const CONTACT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Hidden field real visitors never fill in. A value means the request came from a bot. */
export const CONTACT_HONEYPOT_FIELD = 'website';

/** Field Cloudflare Turnstile writes its token to. */
export const TURNSTILE_RESPONSE_FIELD = 'cf-turnstile-response';

/** Turnstile action bound to this form; the server rejects tokens issued for any other action. */
export const TURNSTILE_ACTION = 'contact';

/** Query parameter the server sets when it redirects a form posted without JavaScript. */
export const CONTACT_RESULT_PARAM = 'contact';

export type ContactResult = 'sent' | 'error' | 'limited';

export function isContactResult(value: unknown): value is ContactResult {
  return value === 'sent' || value === 'error' || value === 'limited';
}
