import 'server-only';

import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME, AUTH_TOKEN_MAX_AGE_IN_SECONDS } from '../constants';
import { isValidAuthToken } from '../token';

export const setAuthCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: AUTH_TOKEN_MAX_AGE_IN_SECONDS,
    path: '/',
  });
};

export const clearAuthCookie = async (): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE_NAME);
};

export const getServerSession = async (): Promise<{ isAuthenticated: boolean; token?: string }> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return {
    isAuthenticated: isValidAuthToken(token),
    token,
  };
};
