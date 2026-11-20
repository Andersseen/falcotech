import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { injectI18n } from '@etyma/angular';
import {
  VoltButton, VoltDialogRoot, VoltDrawerClose, VoltDrawerContent, VoltDrawerOverlay, VoltDrawerTitle,
  VoltNativeButton, VoltSelect, VoltSelectContent, VoltSelectItem, VoltToggle, VoltTooltip, VoltTooltipContent,
} from '@voltui/components';
import { MoveAnimator, MoveEnterDirective, MoveStaggerDirective } from 'angular-movement';
import { LmnBars3Icon } from 'lumen-icons/bars-3';
import { LmnMoonIcon } from 'lumen-icons/moon';
import { LmnSunIcon } from 'lumen-icons/sun';
import { LmnXIcon } from 'lumen-icons/x';
import flagCa from '../../assets/flag-ca.svg';
import flagEn from '../../assets/flag-en.svg';
import flagEs from '../../assets/flag-es.svg';
import logoLight from '../../assets/logo-black.svg';
import logoDark from '../../assets/logo-white.svg';
import { i18n } from '../../i18n/i18n';
import { ThemePreference } from '../theme/theme-preference';

const languages = {
  es: { code: 'es', name: 'Español', flag: flagEs },
  en: { code: 'en', name: 'English', flag: flagEn },
  ca: { code: 'ca', name: 'Català', flag: flagCa },
} as const;

@Component({
  selector: 'app-site-header',
  imports: [
    LmnBars3Icon, LmnMoonIcon, LmnSunIcon, LmnXIcon, MoveEnterDirective, MoveStaggerDirective, VoltButton,
    VoltDialogRoot, VoltDrawerClose, VoltDrawerContent, VoltDrawerOverlay, VoltDrawerTitle, VoltNativeButton,
    VoltSelect, VoltSelectContent, VoltSelectItem, VoltToggle, VoltTooltip, VoltTooltipContent,
  ],
  template: `
    <a voltButton [href]="homePath() + '#main'"
      class="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-60">{{ t('ui.skipToContent') }}</a>
    <header class="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav class="container flex h-16 items-center justify-between px-4" [attr.aria-label]="t('ui.navigation')">
        <a [href]="homePath() + '#hero'" class="shrink-0 rounded-sm">
          <img [src]="logoLight" alt="FalcoTech" width="80" class="block dark:hidden">
          <img [src]="logoDark" alt="FalcoTech" width="80" class="hidden dark:block">
        </a>
        <div class="flex items-center gap-2 sm:gap-4 md:gap-6">
          <div class="hidden items-center gap-6 md:flex">
            @for (item of sections; track item.id) {
              <a voltButton variant="ghost" [href]="homePath() + '#' + item.id" class="h-10 px-4">{{ t(item.label) }}</a>
            }
          </div>
          <volt-toggle #themeToggle variant="ghost" size="icon" class="md:order-1"
            [voltTooltip]="tooltip" [context]="t('ui.theme')" placement="bottom"
            [aria-label]="t('ui.theme')" [pressed]="theme.dark()" (pressedChange)="changeTheme($event)">
            @if (theme.dark()) { <lmn-moon size="20" /> } @else { <lmn-sun size="20" /> }
          </volt-toggle>
          <div class="relative w-[7.25rem] shrink-0 sm:w-36">
            <volt-select [aria-label]="t('ui.language')" [value]="locale()" [displayWith]="languageName"
              (valueChange)="changeLocale($event)"
              class="h-9 rounded-md border border-border bg-background/90 pr-2 pl-9 text-xs font-medium text-foreground">
              <volt-select-content class="rounded-lg bg-surface text-foreground">
                @for (language of languageOptions; track language.code) {
                  <volt-select-item [value]="language.code" [attr.lang]="language.code"
                    class="min-h-9 pr-1.5 pl-7 text-xs focus:text-foreground">
                    <span class="inline-flex items-center gap-1.5 sm:gap-2">
                      <img [src]="language.flag" alt="" width="16" height="12" class="block h-3 w-4 shrink-0 object-contain">
                      <span>{{ language.name }}</span>
                    </span>
                  </volt-select-item>
                }
              </volt-select-content>
            </volt-select>
            <img [src]="currentLanguage().flag" alt="" width="16" height="12"
              class="pointer-events-none absolute start-3 top-1/2 h-3 w-4 -translate-y-1/2 object-contain">
          </div>
          <div class="md:hidden">
            <volt-button variant="ghost" size="icon" [aria-label]="t('ui.navigation')"
              aria-haspopup="dialog" [aria-expanded]="menuOpen()" (click)="menuOpen.set(true)">
              <lmn-bars-3 size="20" />
            </volt-button>
          </div>
        </div>
      </nav>
    </header>

    <ng-template voltDialogRoot [(open)]="menuOpen" let-close="close">
      <div voltDrawerOverlay></div>
      <div voltDrawerContent side="right" class="w-3/4 max-w-sm p-6">
        <h2 voltDrawerTitle class="sr-only">{{ t('ui.navigation') }}</h2>
        <volt-drawer-close [label]="t('ui.close')" class="absolute top-4 right-4"><lmn-x size="20" /></volt-drawer-close>
        <div class="mt-10 grid gap-4" moveStagger="60ms">
          @for (item of sections; track item.id) {
            <a voltButton variant="ghost" moveEnter="fade-left" [href]="homePath() + '#' + item.id" (click)="close()">{{ t(item.label) }}</a>
          }
        </div>
      </div>
    </ng-template>

    <ng-template #tooltip let-label>
      <volt-tooltip-content>{{ label() }}</volt-tooltip-content>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly theme = inject(ThemePreference);
  private readonly document = inject(DOCUMENT);
  private readonly animator = inject(MoveAnimator);
  private readonly themeToggle = viewChild.required('themeToggle', { read: ElementRef<HTMLElement> });
  private readonly i18n = injectI18n(i18n);
  protected readonly t = this.i18n.t;
  protected readonly locale = this.i18n.locale;
  protected readonly homePath = computed(() => this.i18n.path('/'));
  protected readonly languageOptions = Object.values(languages);
  protected readonly currentLanguage = computed(() =>
    this.languageOptions.find(language => language.code === this.locale()) ?? languages.es,
  );
  protected readonly menuOpen = signal(false);
  protected readonly languageName = (value: unknown): string =>
    this.languageOptions.find(language => language.code === value)?.name ?? '';
  protected readonly logoLight = logoLight;
  protected readonly logoDark = logoDark;
  protected readonly sections = [
    { id: 'about', label: 'nav.about' },
    { id: 'features', label: 'nav.features' },
    { id: 'contact', label: 'nav.contact' },
  ] as const;

  /**
   * Switches the theme inside a View Transition and reveals the new one as a circle growing from the
   * toggle. Without View Transitions, or with reduced motion, the theme simply changes.
   */
  protected async changeTheme(dark: boolean): Promise<void> {
    const document = this.document;
    const window = document.defaultView;
    if (!window || typeof document.startViewTransition !== 'function') {
      this.theme.set(dark);
      return;
    }

    const toggle = this.themeToggle().nativeElement.getBoundingClientRect();
    const x = toggle.left + toggle.width / 2;
    const y = toggle.top + toggle.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => this.theme.set(dark));
    try {
      await transition.ready;
    } catch {
      return; // The browser skipped the transition (for example, a second click); the theme is already set.
    }
    this.animator.animate(
      document.documentElement,
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: '520ms', pseudoElement: '::view-transition-new(root)' },
    );
  }

  protected async changeLocale(value: unknown): Promise<void> {
    if (value === 'es' || value === 'en' || value === 'ca') {
      await this.i18n.setLocale(value);
    }
  }
}
