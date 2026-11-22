import { DOCUMENT, Location } from '@angular/common';
import { effect, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { injectI18n } from '@etyma/angular';
import { i18n } from '../../i18n/i18n';
import { ogLocale, SITE } from './site';

export interface PageMeta {
  readonly title: string;
  readonly description: string;
  /** Router path of the page, already localized (`i18n.path('/')`). */
  readonly path: string;
  /** Keep the page out of search results, e.g. a 404. */
  readonly noindex?: boolean;
}

const OWNED = 'data-site-seo';

/**
 * Writes the per-page head that Etyma does not: title, description, Open Graph, Twitter card,
 * robots and the organisation's structured data. Etyma keeps owning `lang`, canonical and hreflang.
 *
 * Runs on the server, so crawlers and link previews get the tags without executing JavaScript.
 */
@Injectable({ providedIn: 'root' })
export class PageSeo {
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly i18n = injectI18n(i18n);
  private readonly origin = SITE.origin;

  apply(page: PageMeta): void {
    const locale = this.i18n.locale();
    const url = this.absolute(page.path);
    const image = this.absolute(SITE.ogImage.path);
    const imageAlt = this.i18n.t('meta.ogImageAlt');

    this.title.setTitle(page.title);
    this.setName('description', page.description);
    this.setName('robots', page.noindex ? 'noindex, follow' : null);

    this.setProperty('og:type', 'website');
    this.setProperty('og:site_name', SITE.name);
    this.setProperty('og:title', page.title);
    this.setProperty('og:description', page.description);
    this.setProperty('og:url', url);
    this.setProperty('og:locale', ogLocale(locale));
    this.setProperty('og:image', image);
    this.setProperty('og:image:type', SITE.ogImage.type);
    this.setProperty('og:image:width', String(SITE.ogImage.width));
    this.setProperty('og:image:height', String(SITE.ogImage.height));
    this.setProperty('og:image:alt', imageAlt);

    for (const tag of this.meta.getTags('property="og:locale:alternate"')) this.meta.removeTagElement(tag);
    for (const alternate of i18n.locales.filter(other => other !== locale)) {
      this.meta.addTag({ property: 'og:locale:alternate', content: ogLocale(alternate) });
    }

    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', page.title);
    this.setName('twitter:description', page.description);
    this.setName('twitter:image', image);
    this.setName('twitter:image:alt', imageAlt);

    this.setOrganization(page.description);
  }

  private setName(name: string, content: string | null): void {
    if (content === null) this.meta.removeTag(`name="${name}"`);
    else this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property="${property}"`);
  }

  private setOrganization(description: string): void {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE.name,
      url: this.absolute('/'),
      logo: this.absolute(SITE.logo),
      image: this.absolute(SITE.ogImage.path),
      description,
      email: SITE.email,
      telephone: SITE.telephone,
      sameAs: [SITE.instagram],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: SITE.email,
        telephone: SITE.telephone,
        availableLanguage: ['es', 'en', 'ca'],
      },
    };

    // The server-rendered element survives hydration; reuse it instead of adding a second one.
    let script = this.document.head.querySelector<HTMLScriptElement>(`script[${OWNED}="organization"]`);
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(OWNED, 'organization');
      this.document.head.appendChild(script);
    }
    // `<` is escaped so no string in the data can close the script element.
    script.textContent = JSON.stringify(data).replaceAll('<', '\\u003c');
  }

  private absolute(path: string): string {
    return `${this.origin}${this.location.prepareExternalUrl(path)}`;
  }
}

/** Sets the page's head from a reactive description, re-running when the locale changes. */
export function injectPageMeta(page: () => PageMeta): void {
  const seo = inject(PageSeo);
  effect(() => seo.apply(page()));
}
