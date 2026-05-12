'use client';

import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { FALLBACK_LOCALE, resources } from './config';

export const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: FALLBACK_LOCALE,
  fallbackLng: FALLBACK_LOCALE,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  returnNull: false,
  returnEmptyString: false,
});
