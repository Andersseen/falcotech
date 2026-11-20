import { DOCUMENT } from '@angular/common';
import { afterNextRender, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { applyVoltTheme } from '@voltui/components';

/** Must match the key the inline script in index.html reads before the first paint. */
const STORAGE_KEY = 'theme';

/**
 * Light or dark, chosen by the visitor or taken from the operating system.
 *
 * The inline script in index.html applies the theme before the first paint, so there is no flash
 * of the wrong theme. This service picks that state up after hydration, keeps following the system
 * until the visitor makes an explicit choice, and remembers that choice.
 */
@Injectable({ providedIn: 'root' })
export class ThemePreference {
  private readonly document = inject(DOCUMENT);
  private readonly isDark = signal(false);
  readonly dark = this.isDark.asReadonly();

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const window = this.document.defaultView;
      if (!window) return;

      this.isDark.set(this.document.documentElement.classList.contains('dark'));

      const system = window.matchMedia('(prefers-color-scheme: dark)');
      const followSystem = (event: MediaQueryListEvent) => {
        if (this.stored() === null) this.apply(event.matches);
      };
      system.addEventListener('change', followSystem);
      destroyRef.onDestroy(() => system.removeEventListener('change', followSystem));
    });
  }

  /** Applies and remembers an explicit choice. */
  set(dark: boolean): void {
    this.apply(dark);
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // Storage can be unavailable (private mode, blocked cookies); the choice then lasts for this page.
    }
  }

  private apply(dark: boolean): void {
    this.isDark.set(dark);
    applyVoltTheme({ dark }, this.document);
  }

  private stored(): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }
}
