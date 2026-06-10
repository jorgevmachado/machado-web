'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useCallback, useState } from 'react';

import { logoutAction } from '@/app/actions/auth';
import { useAppTranslation } from '@/app/i18n';
import { useUser } from '@/app/ui/features/auth';

import { Breadcrumb } from '@/app/ds';

import { getAuthenticatedMenuItems } from './constants';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './navigation.scss';
import { RoleEnum } from '@/app/ui/features/auth/user/types';

type NavigationFrameProps = {
  role?: RoleEnum;
  children: React.ReactNode;
  isAuthenticated: boolean;
};

const NavigationFrame = ({ role = 'USER', isAuthenticated, children }: NavigationFrameProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { clearUser } = useUser();
  const { t } = useAppTranslation();
  const isSidebarVisible = isAuthenticated && !isSidebarCollapsed;
  const authenticatedMenuItems = getAuthenticatedMenuItems(t);
  const authenticatedMenuItemsFiltered = authenticatedMenuItems.filter((item) => item.roles.includes(role));

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    clearUser();
    await logoutAction();
    router.push('/login');
    router.refresh();
  }, [clearUser, router]);

  return (
    <div className='app-shell'>
      <Navbar
        isAuthenticated={isAuthenticated}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className={`${isAuthenticated ? 'app-content' : 'app-content--public'} ${isSidebarVisible ? 'app-content--sidebar-open' : ''}`}>
        {isAuthenticated && (
          <Sidebar
            items={authenticatedMenuItemsFiltered}
            isCollapsed={isSidebarCollapsed}
            pathname={pathname}
            onLogout={handleLogout}
          />
        )}
        {isSidebarVisible && (
          <button
            type='button'
            className='app-sidebar-overlay'
            aria-label={t('navigation.closeSidebar')}
            onClick={handleToggleSidebar}
          />
        )}
        <main className='app-main'>
          {isAuthenticated && <Breadcrumb />}
          {children}
        </main>
      </div>
    </div>
  );
};

export default React.memo(NavigationFrame);
