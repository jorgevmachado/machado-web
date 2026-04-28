/**
 * Barrel coverage test: imports all value exports from the shared barrel so
 * that every re-export statement in every index.ts is executed at least once.
 */
import {
  AUTH_COOKIE_NAME,
  INITIAL_AUTH_ACTION_STATE,
  PASSWORD_PATTERN,
  PASSWORD_RULE_MESSAGE,
  createMockAuthToken,
  extractAuthToken,
  getAuthTokenExpiration,
  isStrongPassword,
  isValidAuthToken,
  isValidEmail,
  cookies,
  Http,
  BaseServiceAbstract,
} from '@/app/shared';

// Import directly from the lib barrel to cover all named exports in lib/index.ts
import {
  AUTH_COOKIE_NAME as _AUTH_COOKIE_NAME,
  createMockAuthToken as _createMockAuthToken,
  extractAuthToken as _extractAuthToken,
  getAuthTokenExpiration as _getAuthTokenExpiration,
  INITIAL_AUTH_ACTION_STATE as _INITIAL_AUTH_ACTION_STATE,
  isStrongPassword as _isStrongPassword,
  isValidAuthToken as _isValidAuthToken,
  isValidEmail as _isValidEmail,
  PASSWORD_PATTERN as _PASSWORD_PATTERN,
  PASSWORD_RULE_MESSAGE as _PASSWORD_RULE_MESSAGE,
  clearAuthCookie as _clearAuthCookie,
} from '@/app/shared/lib';

describe('app/shared barrel exports', () => {
  it('exports all expected symbols', () => {
    expect(AUTH_COOKIE_NAME).toBe('auth-token');
    expect(INITIAL_AUTH_ACTION_STATE).toEqual({ status: 'idle', message: '' });
    expect(PASSWORD_PATTERN).toBeInstanceOf(RegExp);
    expect(PASSWORD_RULE_MESSAGE).toBeDefined();
    expect(createMockAuthToken).toBeDefined();
    expect(extractAuthToken).toBeDefined();
    expect(getAuthTokenExpiration).toBeDefined();
    expect(isStrongPassword).toBeDefined();
    expect(isValidAuthToken).toBeDefined();
    expect(isValidEmail).toBeDefined();
    expect(cookies).toBeDefined();
    expect(Http).toBeDefined();
    expect(BaseServiceAbstract).toBeDefined();
  });

  it('lib/index.ts barrel exports all symbols', () => {
    // Verify re-exports via @/app/shared/lib are the same values
    expect(_AUTH_COOKIE_NAME).toBe('auth-token');
    expect(_createMockAuthToken).toBeDefined();
    expect(_extractAuthToken).toBeDefined();
    expect(_getAuthTokenExpiration).toBeDefined();
    expect(_INITIAL_AUTH_ACTION_STATE).toEqual({ status: 'idle', message: '' });
    expect(_isStrongPassword).toBeDefined();
    expect(_isValidAuthToken).toBeDefined();
    expect(_isValidEmail).toBeDefined();
    expect(_PASSWORD_PATTERN).toBeInstanceOf(RegExp);
    expect(_PASSWORD_RULE_MESSAGE).toBeDefined();
    expect(_clearAuthCookie).toBeDefined();
  });
});
