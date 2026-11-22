/** Facts about the business that the page, the footer and structured data all repeat. */
export const SITE = {
  name: 'FalcoTech',
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
