import { type RouteMeta } from '@analogjs/router';
import { injectResponse } from '@analogjs/router/tokens';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectI18n } from '@etyma/angular';
import { VoltNativeButton } from '@voltui/components';
import { i18n } from '../../i18n/i18n';

export const routeMeta: RouteMeta = {
  canActivate: [() => {
    const response = injectResponse();
    if (response) response.statusCode = 404;
    return true;
  }],
};

@Component({
  imports: [RouterLink, VoltNativeButton],
  template: `
    <main class="container space-y-4 py-20">
      <h1 class="text-3xl font-bold">{{ t('ui.notFound') }}</h1>
      <a voltButton variant="outline" [routerLink]="homePath()">{{ t('nav.home') }}</a>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFoundPage {
  private readonly i18n = injectI18n(i18n);
  protected readonly t = this.i18n.t;
  protected readonly homePath = computed(() => this.i18n.path('/'));
}
