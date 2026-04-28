export type { AuthActionState } from './action-state';
export { INITIAL_AUTH_ACTION_STATE } from './action-state';
export { AUTH_COOKIE_NAME, PASSWORD_PATTERN, PASSWORD_RULE_MESSAGE } from './constants';
export { createMockAuthToken, extractAuthToken, getAuthTokenExpiration,isValidAuthToken } from './token';
export { isStrongPassword, isValidEmail } from './validation';
// Server-only helpers are exported from './server' and should be imported
// explicitly by server components (e.g. `import { getServerSession } from '@/app/shared/lib/auth/server'`).
// This file exports only client-safe utilities.
