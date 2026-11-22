import { getRequestHeader, getRequestIP, getRequestURL, type H3Event } from 'h3';
import { i18n } from '../i18n/i18n';

/** Pages to publish, as router paths in the source locale. */
export const PUBLIC_PAGES = ['/'] as const;

export function requestOrigin(event: H3Event): string {
  return getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin;
}

/** Every localized URL of a page, keyed by locale. */
export function localizedUrls(origin: string, path: string): ReadonlyArray<{ locale: string; href: string }> {
  return i18n.locales.map(locale => ({ locale, href: `${origin}${i18n.router.localize(path, locale)}` }));
}

/**
 * Hosts that serve the real site. Every other host (previews, workers.dev, vercel.app, localhost)
 * is a copy that must stay out of search results, whichever provider serves it.
 */
export const PRODUCTION_HOSTS: ReadonlySet<string> = new Set(['www.falcotech.es']);

export function isIndexable(event: H3Event): boolean {
  return PRODUCTION_HOSTS.has(getRequestURL(event, { xForwardedHost: true }).hostname);
}

/**
 * The visitor's address. Cloudflare sets CF-Connecting-IP and a client cannot forge it; elsewhere
 * (Vercel, Node) the platform rewrites X-Forwarded-For.
 */
export function clientIp(event: H3Event): string | undefined {
  return getRequestHeader(event, 'cf-connecting-ip') ?? getRequestIP(event, { xForwardedFor: true });
}
