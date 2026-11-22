import { type RouteMeta } from '@analogjs/router';
import { injectResponse } from '@analogjs/router/tokens';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectI18n } from '@etyma/angular';
import { VoltEmptyState, VoltEmptyStateDescription, VoltEmptyStateTitle, VoltNativeButton } from '@voltui/components';
import { LmnArrowLeftIcon } from 'lumen-icons/arrow-left';
import { LmnMapIcon } from 'lumen-icons/map';
import { i18n } from '../../i18n/i18n';
import { injectPageMeta } from '../seo/page-seo';

export const routeMeta: RouteMeta = {
  canActivate: [() => {
    const response = injectResponse();
    if (response) response.statusCode = 404;
    return true;
  }],
};

@Component({
  imports: [LmnArrowLeftIcon, LmnMapIcon, RouterLink, VoltEmptyState, VoltEmptyStateDescription, VoltEmptyStateTitle, VoltNativeButton],
  template: `
    <main class="container grid min-h-svh place-items-center py-20">
      <volt-empty-state>
        <lmn-map slot="icon" size="32" background="soft" tone="muted" padding="12" radius="50%" />
        <volt-empty-state-title><h1 class="text-3xl font-bold">{{ t('ui.notFound') }}</h1></volt-empty-state-title>
        <volt-empty-state-description>{{ t('meta.notFoundDescription') }}</volt-empty-state-description>
        <div slot="actions">
          <a voltButton variant="outline" [routerLink]="homePath()"><lmn-arrow-left size="16" /> {{ t('nav.home') }}</a>
        </div>
      </volt-empty-state>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFoundPage {
  private readonly i18n = injectI18n(i18n);
  protected readonly t = this.i18n.t;
  protected readonly homePath = computed(() => this.i18n.path('/'));

  constructor() {
    injectPageMeta(() => ({
      title: this.t('meta.notFoundTitle'),
      description: this.t('meta.notFoundDescription'),
      path: this.homePath(),
      noindex: true,
    }));
  }
}
