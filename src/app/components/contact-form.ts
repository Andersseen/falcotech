import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectT } from '@etyma/angular';
import {
  VoltAlert, VoltAlertDescription, VoltButton, VoltError, VoltFormField, VoltInput, VoltLabel, VoltSpinner, VoltTextarea,
} from '@voltui/components';
import { LmnArrowRightIcon } from 'lumen-icons/arrow-right';
import { i18n } from '../../i18n/i18n';

@Component({
  selector: 'app-contact-form',
  imports: [LmnArrowRightIcon, ReactiveFormsModule, VoltAlert, VoltAlertDescription, VoltButton, VoltError, VoltFormField, VoltInput, VoltLabel, VoltSpinner, VoltTextarea],
  template: `
    <section id="contact" class="w-full rounded-none p-4 py-12 shadow-lg md:rounded-2xl md:p-8 md:py-24 lg:py-32">
      <h2 class="text-xl font-bold">{{ t('contact.title') }}</h2>
      <form method="post" action="/api/contact" class="my-8 grid gap-4" [formGroup]="form"
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
        <volt-button type="submit" class="h-10 w-full bg-linear-to-br from-primary to-primary/65"
          [disabled]="status() === 'submitting'">
          @if (status() === 'submitting') {
            <volt-spinner size="sm" slot="leading" />
          }
          {{ t(status() === 'submitting' ? 'contact.form.sending' : 'contact.form.submit') }}
          @if (status() !== 'submitting') {
            <lmn-arrow-right size="16" slot="trailing" />
          }
        </volt-button>
        @if (status() === 'success') {
          <volt-alert variant="success" role="status">
            <volt-alert-description>{{ t('contact.form.success') }}</volt-alert-description>
          </volt-alert>
        } @else if (status() === 'error') {
          <volt-alert variant="destructive" role="alert">
            <volt-alert-description>{{ t('contact.form.failure') }}</volt-alert-description>
          </volt-alert>
        }
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  protected readonly t = injectT(i18n);
  protected readonly status = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');
  protected readonly form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(120)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), Validators.maxLength(254)],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(5000)],
    }),
  });

  protected async submit(): Promise<void> {
    if (this.status() === 'submitting') return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.status.set('idle');
      return;
    }

    this.status.set('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form.getRawValue()),
      });

      if (!response.ok) {
        this.status.set('error');
        return;
      }

      this.form.reset();
      this.status.set('success');
    } catch {
      this.status.set('error');
    }
  }
}
