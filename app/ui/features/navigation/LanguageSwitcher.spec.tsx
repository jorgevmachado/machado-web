import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { I18nProvider } from '@/app/i18n';
import { LOCALE_STORAGE_KEY } from '@/app/i18n';

import LanguageSwitcher from './LanguageSwitcher';

const setNavigatorLanguage = (value: string) => {
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    value,
  });
};

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setNavigatorLanguage('en-US');
  });

  it('renders supported language options and updates active locale', async () => {
    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Language selector' });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByTitle('Portuguese')).not.toBeInTheDocument();

    fireEvent.click(trigger);

    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();
    expect(screen.getByTitle('Portuguese')).toBeInTheDocument();
    expect(screen.getByTitle('English')).toBeInTheDocument();
    expect(screen.getByTitle('Spanish')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Spanish'));

    await waitFor(() => {
      expect(screen.queryByRole('listbox', { name: 'Language selector' })).not.toBeInTheDocument();
      expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('es');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Selector de idioma' }));

    await waitFor(() => {
      expect(screen.getByTitle('Español')).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('closes the dropdown on outside click and on Escape', () => {
    render(
      <I18nProvider>
        <div>
          <LanguageSwitcher />
          <button type='button'>outside</button>
        </div>
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Language selector' }));
    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('listbox', { name: 'Language selector' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Language selector' }));
    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox', { name: 'Language selector' })).not.toBeInTheDocument();
  });

  it('keeps the dropdown open on inside click and on non-Escape keys', () => {
    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Language selector' });

    fireEvent.click(trigger);
    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();

    fireEvent.mouseDown(trigger);
    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();
  });
});
