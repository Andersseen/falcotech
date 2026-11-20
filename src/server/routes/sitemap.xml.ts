import { defineEventHandler, setResponseHeader } from 'h3';
import { i18n } from '../../i18n/i18n';
import { localizedUrls, PUBLIC_PAGES, requestOrigin } from '../site';

const escapeXml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export default defineEventHandler((event) => {
  const origin = requestOrigin(event);

  // One <url> per localized page, each listing every translation (itself included) and x-default.
  const urls = PUBLIC_PAGES.flatMap(path => {
    const translations = localizedUrls(origin, path);
    const defaultHref = `${origin}${i18n.router.localize(path, i18n.sourceLocale)}`;
    const links = [
      ...translations.map(({ locale, href }) =>
        `    <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(href)}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultHref)}"/>`,
    ].join('\n');

    return translations.map(({ href }) => `  <url>\n    <loc>${escapeXml(href)}</loc>\n${links}\n  </url>`);
  });

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
});
