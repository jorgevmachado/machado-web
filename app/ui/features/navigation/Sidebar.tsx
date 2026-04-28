'use client';

import Link from 'next/link';
import React from 'react';
import { MdLogout } from 'react-icons/md';

import type { MenuItem } from './types';

type SidebarProps = {
  items: MenuItem[];
  isCollapsed: boolean;
  pathname: string;
  onLogout: () => void;
};

const Sidebar = ({ items, isCollapsed, pathname, onLogout }: SidebarProps) => {
  return (
    <aside
      className={`app-sidebar ${isCollapsed ? 'app-sidebar--collapsed' : ''}`}
      aria-label='sidebar'
    >
      <nav className='app-sidebar__nav' aria-label='authenticated-navigation'>
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`app-sidebar__link ${isActive ? 'app-sidebar__link--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              title={isCollapsed ? label : undefined}
            >
              <span className='app-sidebar__link-icon' aria-hidden='true'>
                <Icon size={20} />
              </span>
              {!isCollapsed && (
                <span className='app-sidebar__link-text'>{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        type='button'
        className='app-sidebar__logout'
        onClick={onLogout}
        aria-label='Sign out'
        title={isCollapsed ? 'Sign out' : undefined}
      >
        <span className='app-sidebar__logout-icon' aria-hidden='true'>
          <MdLogout size={20} />
        </span>
        {!isCollapsed && <span className='app-sidebar__logout-text'>Sign out</span>}
      </button>
    </aside>
  );
};

export default React.memo(Sidebar);
