'use client';

import React from 'react';
import { MdMenu, MdMenuOpen } from 'react-icons/md';

import { useAppTranslation } from '@/app/i18n';

import LanguageSwitcher from './LanguageSwitcher';

const POKEBALL_SVG = (
  <svg viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true' focusable='false' width='36' height='36'>
    <circle cx='20' cy='20' r='19' fill='#fff' stroke='#1a1a2e' strokeWidth='2' />
    <path d='M1 20h38' stroke='#1a1a2e' strokeWidth='2' />
    <path d='M1 20C1 9.51 9.51 1 20 1s19 8.51 19 19' fill='#CC0000' />
    <circle cx='20' cy='20' r='5' fill='#fff' stroke='#1a1a2e' strokeWidth='2' />
    <circle cx='20' cy='20' r='2.5' fill='#1a1a2e' />
  </svg>
);

type NavbarProps = {
  isAuthenticated: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

const Navbar = ({ isAuthenticated, isSidebarCollapsed, onToggleSidebar }: NavbarProps) => {
  const { t } = useAppTranslation();

  return (
    <header className='app-navbar'>
      <div className='app-navbar__brand'>
        {isAuthenticated && (
          <button
            type='button'
            className='app-navbar__hamburger'
            onClick={onToggleSidebar}
            aria-label={isSidebarCollapsed ? t('navigation.expandSidebar') : t('navigation.collapseSidebar')}
          >
            {isSidebarCollapsed ? <MdMenu size={22} /> : <MdMenuOpen size={22} />}
          </button>
        )}

        <div className='app-navbar__logo' aria-label={t('navigation.pokeballLogo')}>
          {POKEBALL_SVG}
        </div>

        <div className='app-navbar__heading'>
          <h1 className='app-navbar__title'>{t('navigation.title')}</h1>
          <p className='app-navbar__subtitle'>{t('navigation.subtitle')}</p>
        </div>
      </div>

      <LanguageSwitcher />
    </header>
  );
};

export default React.memo(Navbar);
