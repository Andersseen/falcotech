import { afterEach, describe, expect, it, vi } from 'vitest';
import { turnstileConfig, verifyTurnstile } from './turnstile';

const config = { secret: 'secret', hostnames: new Set(['falcotech.es']) };

function siteverifyReturns(body: unknown, ok = true) {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok, json: async () => body })));
}

afterEach(() => vi.unstubAllGlobals());

describe('turnstileConfig', () => {
  it('is disabled without a secret', () => {
    expect(turnstileConfig({})).toBeNull();
  });

  it('parses the hostname allowlist', () => {
    expect(turnstileConfig({ TURNSTILE_SECRET: 's', TURNSTILE_HOSTNAMES: ' falcotech.es, www.falcotech.es ,' }))
      .toEqual({ secret: 's', hostnames: new Set(['falcotech.es', 'www.falcotech.es']) });
  });
});

describe('verifyTurnstile', () => {
  it('accepts a successful token for this action and hostname', async () => {
    siteverifyReturns({ success: true, action: 'contact', hostname: 'falcotech.es' });
    await expect(verifyTurnstile(config, 'token', '1.2.3.4')).resolves.toBe(true);
  });

  it.each([
    ['an unsuccessful result', { success: false, action: 'contact', hostname: 'falcotech.es' }],
    ['another action', { success: true, action: 'signup', hostname: 'falcotech.es' }],
    ['another hostname', { success: true, action: 'contact', hostname: 'evil.example' }],
  ])('rejects %s', async (_, body) => {
    siteverifyReturns(body);
    await expect(verifyTurnstile(config, 'token', undefined)).resolves.toBe(false);
  });

  it('fails closed when siteverify is unreachable or errors', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    await expect(verifyTurnstile(config, 'token', undefined)).resolves.toBe(false);
    siteverifyReturns({}, false);
    await expect(verifyTurnstile(config, 'token', undefined)).resolves.toBe(false);
  });

  it('rejects a missing token without calling siteverify', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    await expect(verifyTurnstile(config, '', undefined)).resolves.toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
});
