/** Facts about the business that the page, the footer and structured data all repeat. */
export const SITE = {
  name: 'FalcoTech',
  /**
   * The one public address. Canonical URLs, language alternates, Open Graph, structured data and
   * the sitemap always point here, so a preview or a provider URL never presents itself as the site.
   */
  origin: 'https://www.falcotech.es',
  email: 'info@falcotech.es',
  telephone: '+34694236492',
  instagram: 'https://www.instagram.com/falcotechsl',
  whatsapp: 'https://wa.me/34694236492',
  logo: '/logo.png',
  ogImage: { path: '/og-image.jpg', width: 1200, height: 630, type: 'image/jpeg' },
} as const;

/** Open Graph wants a territory as well as a language. */
const OG_LOCALES: Readonly<Record<string, string>> = {
  es: 'es_ES',
  en: 'en_GB',
  ca: 'ca_ES',
};

export function ogLocale(locale: string): string {
  return OG_LOCALES[locale] ?? OG_LOCALES['es']!;
}
