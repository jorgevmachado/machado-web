import en from './locales/en.json';
import es from './locales/es.json';
import ptBR from './locales/pt-BR.json';

export const SUPPORTED_LOCALES = ['en', 'pt-BR', 'es'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const FALLBACK_LOCALE: SupportedLocale = 'en';
export const LOCALE_STORAGE_KEY = 'machado-web:locale';

export const localeOptions = [
  { value: 'pt-BR', flag: '🇧🇷', shortLabel: 'PT', labelKey: 'language.ptBR' },
  { value: 'en', flag: '🇺🇸', shortLabel: 'EN', labelKey: 'language.en' },
  { value: 'es', flag: '🇪🇸', shortLabel: 'ES', labelKey: 'language.es' },
] as const satisfies ReadonlyArray<{
  value: SupportedLocale;
  flag: string;
  shortLabel: string;
  labelKey: string;
}>;

export const resources = {
  en: { translation: en },
  'pt-BR': { translation: ptBR },
  es: { translation: es },
} as const;

const localeAliases: Record<string, SupportedLocale> = {
  en: 'en',
  'en-us': 'en',
  'en-gb': 'en',
  pt: 'pt-BR',
  'pt-br': 'pt-BR',
  es: 'es',
  'es-es': 'es',
};

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

export function normalizeLocale(input?: string | null): SupportedLocale | undefined {
  if (!input) {
    return undefined;
  }

  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  const aliasMatch = localeAliases[normalized];

  if (aliasMatch) {
    return aliasMatch;
  }

  const baseLocale = normalized.split('-')[0];

  return localeAliases[baseLocale];
}

export function resolvePreferredLocale(
  persistedLocale?: string | null,
  browserLocale?: string | null,
): SupportedLocale {
  return normalizeLocale(persistedLocale)
    ?? normalizeLocale(browserLocale)
    ?? FALLBACK_LOCALE;
}
