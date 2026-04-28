'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { TUser ,UserProviderProps } from './types';
import { UserContext } from './UserContext';

type ApiUserErrorResponse = {
  message?: string;
};

const isUser = (value: unknown): value is TUser => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const data = value as Record<string, unknown>;

  return typeof data.id === 'string' && typeof data.email === 'string' && typeof data.name === 'string';
};

const UserProvider = ({
  children,
  initialUser,
  isAuthenticated,
  tokenExpiresAt,
}: UserProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<TUser | undefined>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const clearUser = useCallback(() => {
    setUser(undefined);
    setIsLoading(false);
  }, []);

  const invalidateSession = useCallback(() => {
    clearUser();
    router.push('/login');
    router.refresh();
  }, [clearUser, router]);

  const refreshUser = useCallback(async (): Promise<TUser | undefined> => {
    if (!isAuthenticated) {
      clearUser();
      return undefined;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        cache: 'no-store',
      });

      const json = (await response.json()) as TUser | ApiUserErrorResponse;

      if (!response.ok || !isUser(json)) {
        if (response.status === 401) {
          invalidateSession();
          return undefined;
        }

        clearUser();
        return undefined;
      }

      setUser(json);
      setIsLoading(false);

      return json;
    } catch {
      clearUser();
      return undefined;
    }
  }, [clearUser, invalidateSession, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    if (!tokenExpiresAt) {
      return undefined;
    }

    const timeoutInMs = tokenExpiresAt - Date.now();

    if (timeoutInMs <= 0) {
      window.setTimeout(() => {
        invalidateSession();
      }, 0);

      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      invalidateSession();
    }, timeoutInMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [invalidateSession, isAuthenticated, tokenExpiresAt]);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const handleRefreshUser = () => {
      void refreshUser();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refreshUser();
      }
    };

    window.addEventListener('focus', handleRefreshUser);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleRefreshUser);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, refreshUser]);

  const value = useMemo(() => {
    return {
      user,
      isAuthenticated: Boolean(user) && isAuthenticated,
      isLoading,
      refreshUser,
      clearUser,
    };
  }, [clearUser, isAuthenticated, isLoading, refreshUser, user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default React.memo(UserProvider);
