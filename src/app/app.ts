import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { injectT } from '@etyma/angular';
import { i18n } from '../i18n/i18n';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly t = injectT(i18n);
  private readonly meta = inject(Meta);

  constructor() {
    effect(() => this.meta.updateTag({
      name: 'description',
      content: this.t('home.description'),
    }));
  }
}
