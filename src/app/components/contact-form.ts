import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { injectT } from '@etyma/angular';
import {
  VoltAlert, VoltAlertDescription, VoltButton, VoltCard, VoltCardContent, VoltCardHeader, VoltCardTitle, VoltError,
  VoltFormField, VoltInput, VoltLabel, VoltSpinner, VoltTextarea,
} from '@voltui/components';
import { MoveEnterDirective, MoveInViewDirective, MoveTapDirective } from 'angular-movement';
import { LmnArrowRightIcon } from 'lumen-icons/arrow-right';
import {
  CONTACT_EMAIL_PATTERN, CONTACT_HONEYPOT_FIELD, CONTACT_LIMITS, CONTACT_RESULT_PARAM, isContactResult,
  TURNSTILE_RESPONSE_FIELD,
} from '../../shared/contact';
import { i18n } from '../../i18n/i18n';
import { Turnstile } from './turnstile';

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'limited' | 'verification';

@Component({
  selector: 'app-contact-form',
  imports: [
    LmnArrowRightIcon, MoveEnterDirective, MoveInViewDirective, MoveTapDirective, ReactiveFormsModule, Turnstile,
    VoltAlert, VoltAlertDescription, VoltButton, VoltCard, VoltCardContent, VoltCardHeader, VoltCardTitle, VoltError,
    VoltFormField, VoltInput, VoltLabel, VoltSpinner, VoltTextarea,
  ],
  template: `
    <section id="contact" class="w-full md:p-8" aria-labelledby="contact-title">
      <volt-card moveInView="fade-up" class="rounded-none border-x-0 px-4 py-12 shadow-lg md:rounded-2xl md:border-x md:px-8 md:py-24 lg:py-32">
      <volt-card-header class="p-0">
        <volt-card-title><h2 id="contact-title" class="text-xl font-bold">{{ t('contact.title') }}</h2></volt-card-title>
      </volt-card-header>
      <volt-card-content class="p-0">
      <form #formElement method="post" action="/api/contact" class="my-8 grid gap-4" [formGroup]="form"
        [attr.aria-busy]="status() === 'submitting'" (ngSubmit)="submit()">
        <volt-form-field>
          <volt-label>{{ t('contact.form.username.label') }}</volt-label>
          <volt-input formControlName="username" name="username" autocomplete="name" required
            [readonly]="status() === 'submitting'" [placeholder]="t('contact.form.username.placeholder')" class="h-10 px-3 py-2" />
          @if (form.controls.username.touched && form.controls.username.invalid) {
            <volt-error>{{ t(form.controls.username.hasError('maxlength') ? 'contact.form.tooLong' : 'contact.form.username.error') }}</volt-error>
          }
        </volt-form-field>
        <volt-form-field>
          <volt-label>{{ t('contact.form.email.label') }}</volt-label>
          <volt-input formControlName="email" type="email" name="email" autocomplete="email" required
            [readonly]="status() === 'submitting'" [placeholder]="t('contact.form.email.placeholder')" class="h-10 px-3 py-2" />
          @if (form.controls.email.touched && form.controls.email.invalid) {
            <volt-error>{{ t(form.controls.email.hasError('required') ? 'contact.form.email.error' : 'contact.form.email.invalid') }}</volt-error>
          }
        </volt-form-field>
        <volt-form-field>
          <volt-label>{{ t('contact.form.message.label') }}</volt-label>
          <volt-textarea formControlName="message" name="message" [rows]="3" required
            [readonly]="status() === 'submitting'" [placeholder]="t('contact.form.message.placeholder')" class="px-3 py-2" />
          @if (form.controls.message.touched && form.controls.message.invalid) {
            <volt-error>{{ t(form.controls.message.hasError('maxlength') ? 'contact.form.tooLong' : 'contact.form.message.error') }}</volt-error>
          }
        </volt-form-field>
        <!-- Honeypot: hidden from people and assistive technology, filled in by naive bots. Not UI, so not a Volt atom. -->
        <div class="sr-only" aria-hidden="true">
          <label>{{ t('contact.form.honeypot') }}
            <input type="text" [name]="honeypotField" [formControlName]="honeypotField" tabindex="-1" autocomplete="off">
          </label>
        </div>
        @if (turnstileSiteKey) {
          <app-turnstile [siteKey]="turnstileSiteKey" (tokenChange)="turnstileToken.set($event)" />
        }
        <volt-button type="submit" moveWhileTap="press" class="h-10 w-full bg-linear-to-br from-primary to-primary/65"
          [disabled]="status() === 'submitting'">
          @if (status() === 'submitting') {
            <volt-spinner size="sm" slot="leading" />
          }
          {{ t(status() === 'submitting' ? 'contact.form.sending' : 'contact.form.submit') }}
          @if (status() !== 'submitting') {
            <lmn-arrow-right size="16" slot="trailing" />
          }
        </volt-button>
        @switch (status()) {
          @case ('success') {
            <volt-alert variant="success" role="status" moveEnter="fade-up">
              <volt-alert-description>{{ t('contact.form.success') }}</volt-alert-description>
            </volt-alert>
          }
          @case ('error') {
            <volt-alert variant="destructive" role="alert" moveEnter="fade-up">
              <volt-alert-description>{{ t('contact.form.failure') }}</volt-alert-description>
            </volt-alert>
          }
          @case ('limited') {
            <volt-alert variant="warning" role="alert" moveEnter="fade-up">
              <volt-alert-description>{{ t('contact.form.limited') }}</volt-alert-description>
            </volt-alert>
          }
          @case ('verification') {
            <volt-alert variant="warning" role="alert" moveEnter="fade-up">
              <volt-alert-description>{{ t('contact.form.verification') }}</volt-alert-description>
            </volt-alert>
          }
        }
      </form>
      </volt-card-content>
      </volt-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  protected readonly t = injectT(i18n);
  protected readonly honeypotField = CONTACT_HONEYPOT_FIELD;
  protected readonly turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? '';
  protected readonly turnstileToken = signal<string | null>(null);
  protected readonly status = signal<Status>(this.initialStatus());
  protected readonly form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(CONTACT_LIMITS.username)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(CONTACT_EMAIL_PATTERN), Validators.maxLength(CONTACT_LIMITS.email)],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(CONTACT_LIMITS.message)],
    }),
    [CONTACT_HONEYPOT_FIELD]: new FormControl('', { nonNullable: true }),
  });

  private readonly formElement = viewChild.required<ElementRef<HTMLFormElement>>('formElement');
  private readonly turnstile = viewChild(Turnstile);

  protected async submit(): Promise<void> {
    if (this.status() === 'submitting') return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.status.set('idle');
      this.focusFirstInvalidField();
      return;
    }
    if (this.turnstileSiteKey && !this.turnstileToken()) {
      this.status.set('verification');
      return;
    }

    this.status.set('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.form.getRawValue(), [TURNSTILE_RESPONSE_FIELD]: this.turnstileToken() }),
      });

      if (!response.ok) {
        this.status.set(response.status === 429 ? 'limited' : 'error');
        return;
      }

      this.form.reset();
      this.status.set('success');
    } catch {
      this.status.set('error');
    } finally {
      this.turnstile()?.reset();
    }
  }

  /** Shows the result of a form posted without JavaScript, which the server reports in the URL. */
  private initialStatus(): Status {
    const result = inject(ActivatedRoute).snapshot.queryParamMap.get(CONTACT_RESULT_PARAM);
    if (!isContactResult(result)) return 'idle';
    return result === 'sent' ? 'success' : result;
  }

  private focusFirstInvalidField(): void {
    // Volt's wrappers carry the form state; focus the native control inside the first invalid one.
    this.formElement().nativeElement
      .querySelector<HTMLElement>('volt-input.ng-invalid input, volt-textarea.ng-invalid textarea')
      ?.focus();
  }
}
