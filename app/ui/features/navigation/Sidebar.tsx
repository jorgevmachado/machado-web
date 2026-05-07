'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { MdKeyboardArrowDown, MdLogout } from 'react-icons/md';

import type { MenuItem } from './types';

type SidebarProps = {
  items: MenuItem[];
  isCollapsed: boolean;
  pathname: string;
  onLogout: () => void;
};

const Sidebar = ({ items, isCollapsed, pathname, onLogout }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpanded = (href: string) => {
    setExpandedItems((previousState) => ({
      ...previousState,
      [href]: !previousState[href],
    }));
  };

  return (
    <aside
      className={`app-sidebar ${isCollapsed ? 'app-sidebar--collapsed' : ''}`}
      aria-label='sidebar'
    >
      <nav className='app-sidebar__nav' aria-label='authenticated-navigation'>
        {items.map(({ href, label, icon: Icon, children }) => {
          const hasChildren = Boolean(children?.length);
          const hasActiveChild = children?.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`)) ?? false;
          const isActive = pathname === href || hasActiveChild;
          const isExpanded = hasActiveChild || Boolean(expandedItems[href]);

          return (
            <div key={href} className='app-sidebar__group'>
              <div className='app-sidebar__link-row'>
                <Link
                  href={href}
                  className={`app-sidebar__link ${hasChildren ? 'app-sidebar__link--with-toggle' : ''} ${isActive ? 'app-sidebar__link--active' : ''}`}
                  aria-current={pathname === href ? 'page' : undefined}
                  title={isCollapsed ? label : undefined}
                >
                  <span className='app-sidebar__link-icon' aria-hidden='true'>
                    <Icon size={20} />
                  </span>
                  {!isCollapsed && (
                    <span className='app-sidebar__link-text'>{label}</span>
                  )}
                </Link>

                {hasChildren && !isCollapsed ? (
                  <button
                    type='button'
                    className='app-sidebar__group-toggle'
                    aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
                    aria-expanded={isExpanded}
                    onClick={() => toggleExpanded(href)}
                  >
                    <MdKeyboardArrowDown
                      size={18}
                      className={`app-sidebar__group-toggle-icon ${isExpanded ? 'app-sidebar__group-toggle-icon--expanded' : ''}`}
                    />
                  </button>
                ) : null}
              </div>

              {hasChildren && !isCollapsed && isExpanded ? (
                <div className='app-sidebar__children'>
                  {children?.map(({ href: childHref, label: childLabel, icon: ChildIcon }) => {
                    const isChildActive = pathname === childHref || pathname.startsWith(`${childHref}/`);

                    return (
                      <Link
                        key={childHref}
                        href={childHref}
                        className={`app-sidebar__child-link ${isChildActive ? 'app-sidebar__child-link--active' : ''}`}
                        aria-current={isChildActive ? 'page' : undefined}
                      >
                        <span className='app-sidebar__child-icon' aria-hidden='true'>
                          <ChildIcon size={16} />
                        </span>
                        <span className='app-sidebar__child-text'>{childLabel}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
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
