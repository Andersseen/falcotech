import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { injectI18n } from '@etyma/angular';
import { i18n } from '../../i18n/i18n';
import logoLight from '../../assets/logo-black.svg';
import logoDark from '../../assets/logo-white.svg';

@Component({
  selector: 'app-site-header',
  template: `
    <header class="fixed inset-x-0 top-0 z-20 border-b bg-background/90 backdrop-blur-sm">
      <nav class="container relative flex h-16 items-center justify-between gap-4" [attr.aria-label]="t('ui.navigation')"
        (keydown.escape)="closeMenu()">
        <a [href]="homePath() + '#hero'" (click)="closeMenu()" class="shrink-0">
          <img [src]="logoLight" alt="FalcoTech" width="80" class="block dark:hidden">
          <img [src]="logoDark" alt="FalcoTech" width="80" class="hidden dark:block">
        </a>
        <div class="ml-auto flex items-center gap-3 md:gap-6">
          <div id="site-links"
            class="site-links absolute inset-x-0 top-full flex-col gap-2 border-b bg-background px-6 py-3 md:static md:flex md:flex-row md:gap-6 md:border-0 md:bg-transparent md:p-0"
            [class.menu-open]="menuOpen()">
            @for (item of sections; track item.id) {
              <a [href]="homePath() + '#' + item.id" (click)="closeMenu()" class="rounded py-2 font-medium hover:underline">
                {{ t(item.label) }}
              </a>
            }
          </div>
          <select [attr.aria-label]="t('ui.language')" [value]="locale()" (change)="changeLocale($event)"
            class="rounded-md border bg-background px-2 py-1 text-sm">
            <option value="es" lang="es" [selected]="locale() === 'es'">Español</option>
            <option value="en" lang="en" [selected]="locale() === 'en'">English</option>
            <option value="ca" lang="ca" [selected]="locale() === 'ca'">Català</option>
          </select>
          <button type="button" class="rounded p-2 hover:bg-secondary" [attr.aria-label]="t('ui.theme')"
            [attr.aria-pressed]="dark()" (click)="toggleTheme()">
            <span aria-hidden="true">{{ dark() ? '☾' : '☀' }}</span>
          </button>
          <button type="button" class="rounded p-2 hover:bg-secondary md:hidden" [attr.aria-label]="t('ui.navigation')"
            aria-controls="site-links" [attr.aria-expanded]="menuOpen()" (click)="toggleMenu()">
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </nav>
    </header>
  `,
  styles: `
    @media (max-width: 767px) {
      .site-links { display: none; }
      .site-links.menu-open { display: flex; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  private readonly document = inject(DOCUMENT);
  private readonly i18n = injectI18n(i18n);
  protected readonly t = this.i18n.t;
  protected readonly locale = this.i18n.locale;
  protected readonly homePath = computed(() => this.i18n.path('/'));
  protected readonly dark = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly logoLight = logoLight;
  protected readonly logoDark = logoDark;
  protected readonly sections = [
    { id: 'about', label: 'nav.about' },
    { id: 'features', label: 'nav.features' },
    { id: 'contact', label: 'nav.contact' },
  ] as const;

  constructor() {
    afterNextRender(() => {
      const dark = this.document.defaultView?.localStorage.getItem('theme') === 'dark';
      this.dark.set(dark);
      this.document.documentElement.classList.toggle('dark', dark);
    });
  }

  protected async changeLocale(event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const locale = select.value;
    if (locale !== 'es' && locale !== 'en' && locale !== 'ca') return;

    try {
      await this.i18n.setLocale(locale);
      this.closeMenu();
    } finally {
      select.value = this.locale();
    }
  }

  protected toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected toggleTheme(): void {
    this.dark.update(dark => !dark);
    this.document.documentElement.classList.toggle('dark', this.dark());
    this.document.defaultView?.localStorage.setItem('theme', this.dark() ? 'dark' : 'light');
  }
}
