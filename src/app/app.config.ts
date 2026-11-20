import { provideFileRouter } from '@analogjs/router';
import { type ApplicationConfig } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideEtymaAnalog, withLocalizedRoutes } from '@etyma/analog';
import { provideEtyma } from '@etyma/angular';
import { provideMovement } from 'angular-movement';
import { i18n } from '../i18n/i18n';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(withLocalizedRoutes()),
    provideClientHydration(withEventReplay()),
    provideEtyma(i18n),
    provideEtymaAnalog(),
    provideMovement(),
  ],
};
