import { defineEventHandler, setResponseHeader } from 'h3';
import { isIndexable, SITE_ORIGIN } from '../site';

export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');

  if (!isIndexable(event)) return 'User-agent: *\nDisallow: /\n';

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    '',
  ].join('\n');
});
