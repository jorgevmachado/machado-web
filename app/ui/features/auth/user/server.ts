import { TUser } from '@/app/ui/features/auth/user/types';
import { authService } from '@/app/ui/features/auth';
import { ResponseError, clearAuthCookie, getAuthTokenExpiration } from '@/app/shared';

export const getAuthenticatedUser = async (token?: string): Promise<TUser | undefined> => {
  if (!token) {
    return undefined;
  }

  try {
    return await authService(token).me();
  } catch (error) {
    const responseError = error as ResponseError | undefined;

    if (responseError?.statusCode === 401) {
      await clearAuthCookie();
    }

    return undefined;
  }
};

export const getAuthenticatedUserBootstrap = async (
  isAuthenticated: boolean,
  token?: string,
): Promise<{ initialUser?: TUser; tokenExpiresAt?: number }> => {
  if (!isAuthenticated || !token) {
    return {
      initialUser: undefined,
      tokenExpiresAt: undefined,
    };
  }

  const initialUser = await getAuthenticatedUser(token);

  return {
    initialUser,
    tokenExpiresAt: getAuthTokenExpiration(token),
  };
};

