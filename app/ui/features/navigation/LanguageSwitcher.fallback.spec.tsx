import { render, screen } from '@testing-library/react';

jest.mock('@/app/i18n', () => ({
  localeOptions: [
    { value: 'pt-BR', flag: '🇧🇷', shortLabel: 'PT', labelKey: 'language.ptBR' },
    { value: 'en', flag: '🇺🇸', shortLabel: 'EN', labelKey: 'language.en' },
    { value: 'es', flag: '🇪🇸', shortLabel: 'ES', labelKey: 'language.es' },
  ],
  useAppTranslation: () => ({
    locale: 'fr',
    setLocale: jest.fn(),
    t: (key: string, options?: { language?: string }) => {
      if (key === 'language.selector') {
        return 'Language selector';
      }

      if (key === 'language.changeTo') {
        return `Change language to ${options?.language}`;
      }

      if (key === 'language.ptBR') {
        return 'Portuguese';
      }

      if (key === 'language.en') {
        return 'English';
      }

      if (key === 'language.es') {
        return 'Spanish';
      }

      return key;
    },
  }),
}));

import LanguageSwitcher from './LanguageSwitcher';

describe('LanguageSwitcher fallback', () => {
  it('falls back to the first option when the current locale is unsupported', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByText('🇧🇷')).toBeInTheDocument();
  });
});
