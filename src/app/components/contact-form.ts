import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { injectT } from '@etyma/angular';
import { i18n } from '../../i18n/i18n';

@Component({
  selector: 'app-contact-form',
  template: `
    <section id="contact" class="border-t py-12 md:py-24">
      <div class="container">
        <h2 class="text-2xl font-bold">{{ t('contact.title') }}</h2>
        <form #form method="post" action="/api/contact" class="mt-8 grid gap-4" (submit)="submit($event, form)">
          <label>
            {{ t('contact.form.username.label') }}
            <input name="username" [readOnly]="status() === 'submitting'" autocomplete="name" required maxlength="120"
              [placeholder]="t('contact.form.username.placeholder')">
          </label>
          <label>
            {{ t('contact.form.email.label') }}
            <input type="email" name="email" [readOnly]="status() === 'submitting'" autocomplete="email" required maxlength="254"
              [placeholder]="t('contact.form.email.placeholder')">
          </label>
          <label>
            {{ t('contact.form.message.label') }}
            <textarea name="message" [readOnly]="status() === 'submitting'" rows="5" required maxlength="5000"
              [placeholder]="t('contact.form.message.placeholder')"></textarea>
          </label>
          <button type="submit" class="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50"
            [disabled]="status() === 'submitting'">
            {{ status() === 'submitting' ? '…' : t('contact.form.submit') }}
          </button>
          @if (status() === 'success') {
            <p role="status" class="rounded-md bg-green-100 p-3 text-green-900">{{ t('contact.form.success') }}</p>
          }
          @if (status() === 'error') {
            <p role="alert" class="rounded-md bg-red-100 p-3 text-red-900">{{ t('contact.form.failure') }}</p>
          }
        </form>
      </div>
    </section>
  `,
  styles: `
    label { display: grid; gap: 0.375rem; font-weight: 500; }
    input, textarea {
      border: 1px solid hsl(var(--border));
      border-radius: 0.375rem;
      background: hsl(var(--background));
      padding: 0.625rem 0.75rem;
      font-weight: 400;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  protected readonly t = injectT(i18n);
  protected readonly status = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');

  protected async submit(event: Event, form: HTMLFormElement): Promise<void> {
    event.preventDefault();
    if (this.status() === 'submitting') return;

    const fields = new FormData(form);
    this.status.set('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fields)),
      });

      if (!response.ok) {
        this.status.set('error');
        return;
      }

      form.reset();
      this.status.set('success');
    } catch {
      this.status.set('error');
    }
  }
}
