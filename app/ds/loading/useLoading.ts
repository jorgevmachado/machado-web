'use client';

import { useContext } from 'react';

import { LoadingContext } from './LoadingContext';
import type { LoadingContextValue } from './types';

/**
 * Consume the global loading state.
 * Must be used inside <LoadingProvider>.
 *
 * @example
 * const { startContentLoading, stopContentLoading } = useLoading();
 */
export const useLoading = (): LoadingContextValue => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used within a <LoadingProvider>.');
  }

  return context;
};

