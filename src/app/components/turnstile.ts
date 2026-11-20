import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, output } from '@angular/core';
import { TURNSTILE_ACTION } from '../../shared/contact';

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptLoad: Promise<TurnstileApi> | undefined;

function loadTurnstile(document: Document): Promise<TurnstileApi> {
  return scriptLoad ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => document.defaultView?.turnstile ? resolve(document.defaultView.turnstile) : reject();
    script.onerror = () => {
      scriptLoad = undefined;
      reject();
    };
    document.head.append(script);
  });
}

/**
 * Cloudflare Turnstile challenge, rendered explicitly so the form can reset it after every attempt:
 * a token is valid for one siteverify call only.
 */
@Component({
  selector: 'app-turnstile',
  template: '',
  host: { class: 'block min-h-[65px]' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Turnstile {
  readonly siteKey = input.required<string>();
  readonly tokenChange = output<string | null>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private widgetId: string | undefined;
  private api: TurnstileApi | undefined;

  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      loadTurnstile(document).then(api => {
        if (destroyRef.destroyed) return;
        this.api = api;
        this.widgetId = api.render(this.host.nativeElement, {
          sitekey: this.siteKey(),
          action: TURNSTILE_ACTION,
          theme: 'auto',
          callback: (token: string) => this.tokenChange.emit(token),
          'expired-callback': () => this.tokenChange.emit(null),
          'error-callback': () => this.tokenChange.emit(null),
        });
      }, () => this.tokenChange.emit(null));
    });

    destroyRef.onDestroy(() => {
      if (this.widgetId !== undefined) this.api?.remove(this.widgetId);
    });
  }

  /** Issues a fresh challenge; the previous token can no longer be redeemed. */
  reset(): void {
    if (this.widgetId === undefined) return;
    this.tokenChange.emit(null);
    this.api?.reset(this.widgetId);
  }
}
