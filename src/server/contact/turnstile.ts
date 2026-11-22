import { TURNSTILE_ACTION } from '../../shared/contact';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileConfig {
  readonly secret: string;
  /** Frontend hostnames this deployment accepts tokens from. Never include localhost in production. */
  readonly hostnames: ReadonlySet<string>;
}

/** Reads the configuration, or returns null when Turnstile is not enabled for this deployment. */
export function turnstileConfig(env: NodeJS.ProcessEnv = process.env): TurnstileConfig | null {
  const secret = env['TURNSTILE_SECRET']?.trim();
  if (!secret) return null;

  const hostnames = new Set(
    (env['TURNSTILE_HOSTNAMES'] ?? '').split(',').map(hostname => hostname.trim()).filter(Boolean),
  );
  return { secret, hostnames };
}

/** Canonical siteverify check. Fails closed on any network, HTTP or payload problem. */
export async function verifyTurnstile(config: TurnstileConfig, token: unknown, remoteIp: string | undefined): Promise<boolean> {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048 || config.hostnames.size === 0) {
    return false;
  }

  const body = new URLSearchParams({ secret: config.secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return false;

    const result = (await response.json()) as { success?: unknown; action?: unknown; hostname?: unknown };
    return result.success === true &&
      result.action === TURNSTILE_ACTION &&
      typeof result.hostname === 'string' &&
      config.hostnames.has(result.hostname);
  } catch {
    return false;
  }
}
