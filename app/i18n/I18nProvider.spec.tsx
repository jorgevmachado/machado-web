import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { I18nProvider } from './I18nProvider';
import { LOCALE_STORAGE_KEY } from './config';
import { i18n } from './instance';
import { useAppTranslation } from './useAppTranslation';
import { useLocale } from './I18nProvider';

const setNavigatorLanguage = (value: string) => {
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    value,
  });
};

const LocaleProbe = () => {
  const { locale, setLocale, t } = useAppTranslation();

  return (
    <div>
      <span data-testid='locale'>{locale}</span>
      <span data-testid='home-label'>{t('navigation.home')}</span>
      <button type='button' onClick={() => setLocale('es')}>
        switch-es
      </button>
    </div>
  );
};

describe('I18nProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setNavigatorLanguage('en-US');
    document.documentElement.lang = '';
  });

  it('prioritizes persisted locale over browser locale', async () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'pt-BR');
    setNavigatorLanguage('es-ES');

    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('pt-BR');
    });
  });

  it('falls back to en when browser locale is unsupported', async () => {
    setNavigatorLanguage('fr-FR');

    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
      expect(screen.getByTestId('home-label')).toHaveTextContent('Home');
    });
  });

  it('persists manual locale changes to localStorage', async () => {
    const changeLanguageSpy = jest.spyOn(i18n, 'changeLanguage');

    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'switch-es' }));

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('es');
      expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('es');
      expect(document.documentElement.lang).toBe('es');
    });

    expect(changeLanguageSpy).toHaveBeenCalledWith('en');
    expect(changeLanguageSpy).toHaveBeenCalledWith('es');
  });

  it('falls back to the default locale context outside the provider', () => {
    const OutsideProbe = () => {
      const { locale, supportedLocales, setLocale } = useLocale();

      return (
        <div>
          <span data-testid='outside-locale'>{locale}</span>
          <span data-testid='outside-locales'>{supportedLocales.join(',')}</span>
          <button type='button' onClick={() => setLocale('es')}>
            noop
          </button>
        </div>
      );
    };

    render(<OutsideProbe />);

    expect(screen.getByTestId('outside-locale')).toHaveTextContent('en');
    expect(screen.getByTestId('outside-locales')).toHaveTextContent('en,pt-BR,es');
    fireEvent.click(screen.getByRole('button', { name: 'noop' }));
    expect(screen.getByTestId('outside-locale')).toHaveTextContent('en');
  });
});
