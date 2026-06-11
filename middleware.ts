import { NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME } from '@/app/shared/lib/auth/constants';

type RoleEnum = 'USER' | 'ADMIN';

type SessionPayload = {
  exp?: number;
  role?: RoleEnum;
};

const decodeBase64Url = (value: string): string | undefined => {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);

    return atob(padded);
  } catch {
    return undefined;
  }
};

const parseTokenPayload = (token?: string): SessionPayload | undefined => {
  if (!token) {
    return undefined;
  }

  const tokenParts = token.split('.');

  if (tokenParts.length !== 3) {
    return undefined;
  }

  const payloadAsString = decodeBase64Url(tokenParts[1]);

  if (payloadAsString === undefined) {
    return undefined;
  }

  try {
    return JSON.parse(payloadAsString) as SessionPayload;
  } catch {
    return undefined;
  }
};

const isValidAuthToken = (token?: string): boolean => {
  const payload = parseTokenPayload(token);

  if (!payload?.exp) {
    return false;
  }

  return payload.exp > Date.now() / 1000;
};

const isAdminOnlyCatalogPath = (pathname: string): boolean => {
  const normalizedPathname = pathname !== '/' ? pathname.replace(/\/$/, '') : pathname;

  if (normalizedPathname === '/catalog') {
    return true;
  }

  if (!normalizedPathname.startsWith('/catalog/')) {
    return false;
  }

  const segments = normalizedPathname.split('/').filter(Boolean);

  return segments.length === 2;
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!isValidAuthToken(token)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = parseTokenPayload(token);

  if (payload?.role !== 'ADMIN' && isAdminOnlyCatalogPath(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/home?reason=forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/catalog/:path*'],
};
