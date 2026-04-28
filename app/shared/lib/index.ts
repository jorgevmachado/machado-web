export {
  AUTH_COOKIE_NAME,
  type AuthActionState,
  createMockAuthToken,
  extractAuthToken,
  getAuthTokenExpiration,
  INITIAL_AUTH_ACTION_STATE,
  isStrongPassword,
  isValidAuthToken,
  isValidEmail,
  PASSWORD_PATTERN,
  PASSWORD_RULE_MESSAGE,
} from './auth';

// Server-only helpers must be imported from './auth/server' by server components
export { clearAuthCookie } from './auth/server';

