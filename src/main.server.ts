import '@angular/platform-server/init';
import { render } from '@analogjs/router/server';
import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { App } from './app/app';
import { appConfig } from './app/app.config';

export default render(App, mergeApplicationConfig(appConfig, {
  providers: [provideServerRendering()],
}));
