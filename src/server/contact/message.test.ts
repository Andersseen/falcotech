import { describe, expect, it } from 'vitest';
import { CONTACT_HONEYPOT_FIELD, CONTACT_LIMITS } from '../../shared/contact';
import { parseContact } from './message';

const valid = { username: 'Ana Pérez', email: 'ana@example.com', message: 'Hola' };

describe('parseContact', () => {
  it('accepts and trims a complete message', () => {
    expect(parseContact({ username: '  Ana Pérez ', email: ' ana@example.com', message: ' Hola \n' })).toEqual({
      kind: 'valid',
      contact: valid,
    });
  });

  it('flags a filled honeypot as spam before validating anything else', () => {
    expect(parseContact({ [CONTACT_HONEYPOT_FIELD]: 'https://spam.example' })).toEqual({ kind: 'spam' });
  });

  it.each([
    ['a missing body', null],
    ['an array', [valid]],
    ['a blank name', { ...valid, username: '   ' }],
    ['a name with a line break', { ...valid, username: 'Ana\nBcc: x@example.com' }],
    ['a malformed email', { ...valid, email: 'ana@example' }],
    ['an email with spaces', { ...valid, email: 'ana @example.com' }],
    ['an empty message', { ...valid, message: '' }],
    ['a non-string field', { ...valid, message: 42 }],
    ['a name over the limit', { ...valid, username: 'a'.repeat(CONTACT_LIMITS.username + 1) }],
    ['a message over the limit', { ...valid, message: 'a'.repeat(CONTACT_LIMITS.message + 1) }],
  ])('rejects %s', (_, body) => {
    expect(parseContact(body)).toEqual({ kind: 'invalid' });
  });

  it('keeps line breaks inside the message', () => {
    const result = parseContact({ ...valid, message: 'Línea 1\nLínea 2' });
    expect(result.kind === 'valid' && result.contact.message).toBe('Línea 1\nLínea 2');
  });
});
