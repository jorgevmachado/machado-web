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

// ─── Server session (setAuthCookie, clearAuthCookie, getServerSession) ────────

const mockSet = jest.fn();
const mockDelete = jest.fn();
const mockGet = jest.fn();
const mockCookies = jest.fn().mockResolvedValue({
  set: mockSet,
  delete: mockDelete,
  get: mockGet,
});

jest.mock('next/headers', () => ({
  cookies: () => mockCookies(),
}));

// Import from server.ts (the public re-export file) so that all three named
// exports in server.ts are exercised and its statement coverage is complete.
import { clearAuthCookie, getServerSession, setAuthCookie } from '../server';

describe('setAuthCookie', () => {
  beforeEach(() => jest.clearAllMocks());

  it('stores the token in the auth cookie', async () => {
    await setAuthCookie('my-token');

    expect(mockSet).toHaveBeenCalledWith(
      'auth-token',
      'my-token',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      }),
    );
  });

  it('sets secure: true in production', async () => {
    const original = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      configurable: true,
    });

    await setAuthCookie('prod-token');

    expect(mockSet).toHaveBeenCalledWith(
      'auth-token',
      'prod-token',
      expect.objectContaining({ secure: true }),
    );

    Object.defineProperty(process.env, 'NODE_ENV', {
      value: original,
      configurable: true,
    });
  });
});

describe('clearAuthCookie', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deletes the auth cookie', async () => {
    await clearAuthCookie();
    expect(mockDelete).toHaveBeenCalledWith('auth-token');
  });
});

describe('getServerSession', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns isAuthenticated: true when a valid token is stored', async () => {
    const token = createMockAuthToken();
    mockGet.mockReturnValue({ value: token });

    const session = await getServerSession();

    expect(session.isAuthenticated).toBe(true);
    expect(session.token).toBe(token);
  });

  it('returns isAuthenticated: false when no cookie is present', async () => {
    mockGet.mockReturnValue(undefined);

    const session = await getServerSession();

    expect(session.isAuthenticated).toBe(false);
    expect(session.token).toBeUndefined();
  });

  it('returns isAuthenticated: false when the stored token is invalid', async () => {
    mockGet.mockReturnValue({ value: 'bad.token' });

    const session = await getServerSession();

    expect(session.isAuthenticated).toBe(false);
  });
});
