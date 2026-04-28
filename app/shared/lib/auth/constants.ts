export const AUTH_COOKIE_NAME = 'auth-token';
export const AUTH_TOKEN_MAX_AGE_IN_SECONDS = 60 * 60 * 24;
export const INVALID_LOGIN_RESPONSE_MESSAGE = 'Authentication response does not contain a valid token.';

export const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{7,}$/;

export const PASSWORD_RULE_MESSAGE =
  'Password must contain at least 7 characters, one uppercase letter, and one special character.';