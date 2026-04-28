'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useCallback, useState } from 'react';

import { logoutAction } from '@/app/actions/auth';
import { useUser } from '@/app/ui/features/auth';

import { Breadcrumb } from '@/app/ds';

import { AUTHENTICATED_MENU_ITEMS } from './constants';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './navigation.scss';

type NavigationFrameProps = {
  isAuthenticated: boolean;
  children: React.ReactNode;
};

const NavigationFrame = ({ isAuthenticated, children }: NavigationFrameProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { clearUser } = useUser();
  const isSidebarVisible = isAuthenticated && !isSidebarCollapsed;

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
        title='Pokemon System'
        isAuthenticated={isAuthenticated}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className={`${isAuthenticated ? 'app-content' : 'app-content--public'} ${isSidebarVisible ? 'app-content--sidebar-open' : ''}`}>
        {isAuthenticated && (
          <Sidebar
            items={AUTHENTICATED_MENU_ITEMS}
            isCollapsed={isSidebarCollapsed}
            pathname={pathname}
            onLogout={handleLogout}
          />
        )}
        {isSidebarVisible && (
          <button
            type='button'
            className='app-sidebar-overlay'
            aria-label='Close sidebar'
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
