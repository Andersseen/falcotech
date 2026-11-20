import { defineI18n } from '@etyma/core';
import es from './locales/es.json';

export const i18n = defineI18n({
  locales: ['es', 'en', 'ca'],
  sourceLocale: 'es',
  source: es,
  loaders: {
    en: () => import('./locales/en.json'),
    ca: () => import('./locales/ca.json'),
  },
});
