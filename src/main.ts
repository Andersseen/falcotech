import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import './styles/globals.css';

bootstrapApplication(App, appConfig).catch(console.error);
