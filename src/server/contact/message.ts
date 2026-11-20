import { CONTACT_EMAIL_PATTERN, CONTACT_HONEYPOT_FIELD, CONTACT_LIMITS } from '../../shared/contact';

export interface ContactMessage {
  readonly username: string;
  readonly email: string;
  readonly message: string;
}

export type ParsedContact =
  | { readonly kind: 'valid'; readonly contact: ContactMessage }
  | { readonly kind: 'spam' }
  | { readonly kind: 'invalid' };

// Single-line fields must not carry control characters: they end up in mail headers and the subject.
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

function field(body: Record<string, unknown>, name: string): string {
  const value = body[name];
  return typeof value === 'string' ? value.trim() : '';
}

export function parseContact(body: unknown): ParsedContact {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return { kind: 'invalid' };
  const record = body as Record<string, unknown>;

  if (field(record, CONTACT_HONEYPOT_FIELD)) return { kind: 'spam' };

  const username = field(record, 'username');
  const email = field(record, 'email');
  const message = field(record, 'message');

  const valid =
    username.length > 0 && username.length <= CONTACT_LIMITS.username && !CONTROL_CHARACTERS.test(username) &&
    email.length <= CONTACT_LIMITS.email && CONTACT_EMAIL_PATTERN.test(email) &&
    message.length > 0 && message.length <= CONTACT_LIMITS.message;

  return valid ? { kind: 'valid', contact: { username, email, message } } : { kind: 'invalid' };
}
