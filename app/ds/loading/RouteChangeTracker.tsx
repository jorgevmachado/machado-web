'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useLoading } from './useLoading';

/**
 * Invisible component placed inside LoadingProvider.
 * - Intercepts <a> clicks to start page loading automatically.
 * - Watches usePathname() to stop page loading when navigation completes.
 */
const RouteChangeTracker = () => {
  const pathname = usePathname();
  const { startPageLoading, stopPageLoading } = useLoading();
  const isFirstRender = useRef(true);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (pathname !== previousPathname.current) {
      stopPageLoading();
      previousPathname.current = pathname;
    }
  }, [pathname, stopPageLoading]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a');

      if (!anchor) return;

      const href = anchor.getAttribute('href');

      if (!href) return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (anchor.target === '_blank') return;
      if (href === pathname) return;
      if (!href.startsWith('/') && !href.startsWith(window.location.origin)) return;

      startPageLoading();
    };

    document.addEventListener('click', handleAnchorClick);

    return () => document.removeEventListener('click', handleAnchorClick);
  }, [pathname, startPageLoading]);

  return null;
};

export default RouteChangeTracker;

