import {
  FALLBACK_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  localeOptions,
  normalizeLocale,
  resolvePreferredLocale,
  resources,
} from './config';

describe('i18n config', () => {
  it('exposes supported locales, storage key, options and resources', () => {
    expect(SUPPORTED_LOCALES).toEqual(['en', 'pt-BR', 'es']);
    expect(FALLBACK_LOCALE).toBe('en');
    expect(LOCALE_STORAGE_KEY).toBe('machado-web:locale');
    expect(localeOptions.map((option) => option.value)).toEqual(['pt-BR', 'en', 'es']);
    expect(Object.keys(resources)).toEqual(['en', 'pt-BR', 'es']);
  });

  it('detects whether a locale is supported', () => {
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('pt-BR')).toBe(true);
    expect(isSupportedLocale('fr')).toBe(false);
  });

  it('normalizes exact aliases and base locales', () => {
    expect(normalizeLocale(' en-US ')).toBe('en');
    expect(normalizeLocale('EN-gb')).toBe('en');
    expect(normalizeLocale('pt')).toBe('pt-BR');
    expect(normalizeLocale('es-MX')).toBe('es');
  });

  it('returns undefined for empty and unsupported locales', () => {
    expect(normalizeLocale(undefined)).toBeUndefined();
    expect(normalizeLocale(null)).toBeUndefined();
    expect(normalizeLocale('   ')).toBeUndefined();
    expect(normalizeLocale('fr-FR')).toBeUndefined();
  });

  it('resolves preferred locale from persisted value, browser value, or fallback', () => {
    expect(resolvePreferredLocale('pt-BR', 'en-US')).toBe('pt-BR');
    expect(resolvePreferredLocale('unknown', 'es-ES')).toBe('es');
    expect(resolvePreferredLocale(undefined, 'fr-FR')).toBe('en');
  });
});
