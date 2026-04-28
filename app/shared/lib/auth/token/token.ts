import {
  AUTH_TOKEN_MAX_AGE_IN_SECONDS ,
  INVALID_LOGIN_RESPONSE_MESSAGE,
} from '../constants';
import { LoginResponsePayload } from '@/app/ui/features/auth/types';

type SessionPayload = {
  exp?: number;
};

const encodeBase64Url = (value: string): string => {
  return Buffer.from(value).toString('base64url');
};

const decodeBase64Url = (value: string): string | undefined => {
  try {
    return Buffer.from(value, 'base64url').toString('utf-8');
  } catch {
    return undefined;
  }
};

const parseTokenPayload = (token: string): SessionPayload | undefined => {
  const tokenParts = token.split('.');

  if (tokenParts.length !== 3) {
    return undefined;
  }

  const payloadAsString = decodeBase64Url(tokenParts[1]);

  if (!payloadAsString) {
    return undefined;
  }

  try {
    return JSON.parse(payloadAsString) as SessionPayload;
  } catch {
    return undefined;
  }
};

export const getAuthTokenExpiration = (token?: string): number | undefined => {
  if (!token) {
    return undefined;
  }

  const payload = parseTokenPayload(token);

  if (!payload?.exp) {
    return undefined;
  }

  return payload.exp * 1000;
};

export const isValidAuthToken = (token?: string): boolean => {
  if (!token) {
    return false;
  }

  const payload = parseTokenPayload(token);

  if (!payload?.exp) {
    return false;
  }

  return payload.exp > Date.now() / 1000;
};

export const createMockAuthToken = (): string => {
  const header = encodeBase64Url(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = encodeBase64Url(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + AUTH_TOKEN_MAX_AGE_IN_SECONDS,
    }),
  );

  const signature = encodeBase64Url('mock-signature');

  return `${header}.${payload}.${signature}`;
};

export const extractAuthToken = (payload: LoginResponsePayload): string =>  {
  if (!payload || typeof payload !== 'object') {
    throw new Error(INVALID_LOGIN_RESPONSE_MESSAGE);
  }

  const token = payload.access_token;

  if (!token || !token.trim()) {
    throw new Error(INVALID_LOGIN_RESPONSE_MESSAGE);
  }

  return token;
};