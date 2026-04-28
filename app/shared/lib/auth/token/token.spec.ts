import {
  createMockAuthToken,
  extractAuthToken,
  getAuthTokenExpiration,
  isValidAuthToken,
} from '../token';

// ─── helpers ──────────────────────────────────────────────────────────────────

const encodeBase64Url = (value: string) =>
  Buffer.from(value).toString('base64url');

const buildJwt = (payload: object, header = { alg: 'none', typ: 'JWT' }) => {
  const h = encodeBase64Url(JSON.stringify(header));
  const p = encodeBase64Url(JSON.stringify(payload));
  const s = encodeBase64Url('sig');
  return `${h}.${p}.${s}`;
};

const futureExp = () => Math.floor(Date.now() / 1000) + 3600;
const pastExp = () => Math.floor(Date.now() / 1000) - 1;

// ─── isValidAuthToken ─────────────────────────────────────────────────────────

describe('isValidAuthToken', () => {
  it('returns true for a token with a future expiration', () => {
    const token = buildJwt({ exp: futureExp() });
    expect(isValidAuthToken(token)).toBe(true);
  });

  it('returns false when token is undefined', () => {
    expect(isValidAuthToken(undefined)).toBe(false);
  });

  it('returns false when token does not have 3 parts', () => {
    expect(isValidAuthToken('only.two')).toBe(false);
    expect(isValidAuthToken('a.b.c.d')).toBe(false);
  });

  it('returns false when payload is not valid base64url', () => {
    // Force decodeBase64Url to fail by using an invalid base64 string after dot
    // Buffer.from with 'base64url' won't throw, but JSON.parse will if the
    // decoded bytes are not valid JSON → covers the JSON.parse catch branch.
    const badPayload = 'not-valid-json-after-decode';
    expect(isValidAuthToken(`header.${badPayload}.sig`)).toBe(false);
  });

  it('returns false when payload has no exp field', () => {
    const token = buildJwt({ sub: 'user123' }); // no exp
    expect(isValidAuthToken(token)).toBe(false);
  });

  it('returns false when token is expired', () => {
    const token = buildJwt({ exp: pastExp() });
    expect(isValidAuthToken(token)).toBe(false);
  });

  it('returns false when payload decodes to a non-object (null)', () => {
    // Encoded payload is the string "null"
    const p = encodeBase64Url('null');
    expect(isValidAuthToken(`header.${p}.sig`)).toBe(false);
  });
});

// ─── getAuthTokenExpiration ───────────────────────────────────────────────────

describe('getAuthTokenExpiration', () => {
  it('returns exp * 1000 for a valid token', () => {
    const exp = futureExp();
    const token = buildJwt({ exp });
    expect(getAuthTokenExpiration(token)).toBe(exp * 1000);
  });

  it('returns undefined when token is undefined', () => {
    expect(getAuthTokenExpiration(undefined)).toBeUndefined();
  });

  it('returns undefined when token does not have 3 parts', () => {
    expect(getAuthTokenExpiration('bad')).toBeUndefined();
  });

  it('returns undefined when payload has no exp field', () => {
    const token = buildJwt({ role: 'admin' });
    expect(getAuthTokenExpiration(token)).toBeUndefined();
  });

  it('returns false when payload is invalid JSON', () => {
    const badPayload = encodeBase64Url('not-json!!!');
    expect(getAuthTokenExpiration(`h.${badPayload}.s`)).toBeUndefined();
  });

  it('returns undefined when Buffer toString throws (decodeBase64Url catch branch)', () => {
    // Force the internal decodeBase64Url to enter its catch block, which also
    // exercises the `if (!payloadAsString)` guard in parseTokenPayload.
    const spy = jest
      .spyOn(Buffer.prototype, 'toString')
      .mockImplementationOnce(() => {
        throw new Error('forced toString error');
      });

    expect(getAuthTokenExpiration('a.payload.c')).toBeUndefined();
    spy.mockRestore();
  });
});

// ─── createMockAuthToken ──────────────────────────────────────────────────────

describe('createMockAuthToken', () => {
  it('returns a valid JWT string with 3 parts', () => {
    const token = createMockAuthToken();
    expect(token.split('.')).toHaveLength(3);
  });

  it('produces a token that passes isValidAuthToken', () => {
    expect(isValidAuthToken(createMockAuthToken())).toBe(true);
  });
});

// ─── extractAuthToken ─────────────────────────────────────────────────────────

describe('extractAuthToken', () => {
  const INVALID_MSG = 'Authentication response does not contain a valid token.';

  it('returns the access_token from a valid payload', () => {
    const result = extractAuthToken({
      token_type: 'Bearer',
      access_token: 'my-jwt-token',
    });
    expect(result).toBe('my-jwt-token');
  });

  it('throws when payload is null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => extractAuthToken(null as any)).toThrow(INVALID_MSG);
  });

  it('throws when payload is a non-object primitive', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => extractAuthToken('string' as any)).toThrow(INVALID_MSG);
  });

  it('throws when access_token is missing (undefined)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => extractAuthToken({} as any)).toThrow(INVALID_MSG);
  });

  it('throws when access_token is an empty string', () => {
    expect(() =>
      extractAuthToken({ token_type: 'Bearer', access_token: '' }),
    ).toThrow(INVALID_MSG);
  });

  it('throws when access_token is whitespace only', () => {
    expect(() =>
      extractAuthToken({ token_type: 'Bearer', access_token: '   ' }),
    ).toThrow(INVALID_MSG);
  });
});
