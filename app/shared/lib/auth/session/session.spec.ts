import { createMockAuthToken, isValidAuthToken } from '@/app/shared';

describe('auth session helpers', () => {
  it('returns true when token has a valid expiration date', () => {
    const token = createMockAuthToken();

    expect(isValidAuthToken(token)).toBe(true);
  });

  it('returns false when token is missing', () => {
    expect(isValidAuthToken(undefined)).toBe(false);
  });

  it('returns false when token format is invalid', () => {
    expect(isValidAuthToken('invalid-token')).toBe(false);
  });
});
