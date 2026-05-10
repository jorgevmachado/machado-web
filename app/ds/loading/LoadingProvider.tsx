'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { LoadingContext } from './LoadingContext';
import RouteChangeTracker from './RouteChangeTracker';
import Loading from './Loading';

type LoadingProviderProps = Readonly<{
  children: React.ReactNode;
}>;

/**
 * Global loading provider.
 * Wrap around the application root to enable the global loading API.
 *
 * Features:
 * - Automatic page loading on route navigation via <RouteChangeTracker />
 * - Minimum display duration (300ms) to ensure loading is always visible
 * - Support for both page-level and content-level loading states
 *
 * Renders:
 * - <RouteChangeTracker /> — auto-starts/stops page loading on navigation
 * - <TopProgressBar />     — page-nav loading bar (top of screen)
 */
const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);

  // Timers to enforce minimum display duration (300ms)
  const pageLoadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const contentLoadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const MIN_LOADING_DURATION_MS = 300;

  const startPageLoading = useCallback(() => {
    // Clear any pending stop timer
    if (pageLoadingTimerRef.current) {
      clearTimeout(pageLoadingTimerRef.current);
      pageLoadingTimerRef.current = null;
    }
    /* istanbul ignore next -- defensive guard for callbacks retained after unmount. */
    if (!isMountedRef.current) {
      return;
    }
    setIsPageLoading(true);
  }, []);

  const stopPageLoading = useCallback(() => {
    // Ensure minimum display duration
    pageLoadingTimerRef.current = setTimeout(() => {
      /* istanbul ignore next -- defensive guard for callbacks retained after unmount. */
      if (!isMountedRef.current) {
        return;
      }
      setIsPageLoading(false);
      pageLoadingTimerRef.current = null;
    }, MIN_LOADING_DURATION_MS);
  }, []);

  const startContentLoading = useCallback(() => {
    // Clear any pending stop timer
    if (contentLoadingTimerRef.current) {
      clearTimeout(contentLoadingTimerRef.current);
      contentLoadingTimerRef.current = null;
    }
    /* istanbul ignore next -- defensive guard for callbacks retained after unmount. */
    if (!isMountedRef.current) {
      return;
    }
    setIsContentLoading(true);
  }, []);

  const stopContentLoading = useCallback(() => {
    // Ensure minimum display duration
    contentLoadingTimerRef.current = setTimeout(() => {
      /* istanbul ignore next -- defensive guard for callbacks retained after unmount. */
      if (!isMountedRef.current) {
        return;
      }
      setIsContentLoading(false);
      contentLoadingTimerRef.current = null;
    }, MIN_LOADING_DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      if (pageLoadingTimerRef.current) {
        clearTimeout(pageLoadingTimerRef.current);
        pageLoadingTimerRef.current = null;
      }

      if (contentLoadingTimerRef.current) {
        clearTimeout(contentLoadingTimerRef.current);
        contentLoadingTimerRef.current = null;
      }
    };
  }, []);

  const value = useMemo(() => ({
    isPageLoading,
    isContentLoading,
    startPageLoading,
    stopPageLoading,
    startContentLoading,
    stopContentLoading,
  }), [
    isContentLoading,
    isPageLoading,
    startContentLoading,
    startPageLoading,
    stopContentLoading,
    stopPageLoading,
  ]);

  return (
    <LoadingContext.Provider
      value={value}
    >
      <RouteChangeTracker />
      <Loading type='top-progress-bar' isVisible={isPageLoading} />
      {isContentLoading && <Loading type='pokeball' />}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
