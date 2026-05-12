'use client';

import React from 'react';

import { localeOptions, useAppTranslation } from '@/app/i18n';

const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useAppTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const activeOption = localeOptions.find((option) => option.value === locale) ?? localeOptions[0];

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className='app-language-switcher'>
      <button
        type='button'
        className='app-language-switcher__trigger'
        aria-label={t('language.selector')}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        <span aria-hidden='true' className='app-language-switcher__flag'>
          {activeOption.flag}
        </span>
        <span aria-hidden='true' className='app-language-switcher__chevron'>
          ▾
        </span>
      </button>

      {isOpen && (
        <div className='app-language-switcher__options' role='listbox' aria-label={t('language.selector')}>
          {localeOptions.map((option) => {
            const label = t(option.labelKey);
            const isActive = locale === option.value;

            return (
              <button
                key={option.value}
                type='button'
                className={`app-language-switcher__option ${isActive ? 'app-language-switcher__option--active' : ''}`}
                role='option'
                aria-selected={isActive}
                aria-label={t('language.changeTo', { language: label })}
                title={label}
                onClick={() => {
                  setLocale(option.value);
                  setIsOpen(false);
                }}
              >
                <span aria-hidden='true' className='app-language-switcher__flag'>{option.flag}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(LanguageSwitcher);
