import { getRequestURL, type H3Event } from 'h3';
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

/** Only the production deployment should be indexed; previews would compete with it. */
export function isIndexable(): boolean {
  return process.env['VERCEL_ENV'] === undefined || process.env['VERCEL_ENV'] === 'production';
}
