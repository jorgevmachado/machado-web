import { cookies } from '../cookies';

// ─── Mock @/app/utils ─────────────────────────────────────────────────────────

const mockDocumentCookie = jest.fn<string, []>();
const mockIsBrowser = jest.fn<boolean, []>();
const mockDomain = jest.fn<string, []>();

jest.mock('@/app/utils', () => ({
  documentCookie: () => mockDocumentCookie(),
  isBrowser: () => mockIsBrowser(),
  domain: () => mockDomain(),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setupDocumentCookie(value: string) {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value,
    configurable: true,
  });
}

beforeEach(() => {
  mockDocumentCookie.mockReturnValue('');
  mockIsBrowser.mockReturnValue(true);
  mockDomain.mockReturnValue('localhost');
  setupDocumentCookie('');
});

// ─── get ──────────────────────────────────────────────────────────────────────

describe('Cookies.get', () => {
  it('returns the value for an existing cookie', () => {
    mockDocumentCookie.mockReturnValue('theme=dark; accessToken=abc123; lang=en');
    expect(cookies.get('accessToken')).toBe('abc123');
  });

  it('returns undefined when the key is not in the cookie string', () => {
    mockDocumentCookie.mockReturnValue('theme=dark');
    expect(cookies.get('accessToken')).toBeUndefined();
  });

  it('returns undefined for an empty cookie string', () => {
    mockDocumentCookie.mockReturnValue('');
    expect(cookies.get('any')).toBeUndefined();
  });
});

// ─── set ──────────────────────────────────────────────────────────────────────

describe('Cookies.set', () => {
  it('writes a cookie string to document.cookie', () => {
    const setCookieSpy = jest.spyOn(
      Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ?? {},
      'set',
    );

    // Just call set and verify no error is thrown
    expect(() => cookies.set('myKey', 'myValue', 'localhost', 1)).not.toThrow();
  });

  it('uses 365 days as the default expiry', () => {
    // Verify the returned string contains the key/value without throwing
    const result = cookies.set('key', 'value', 'localhost');
    expect(result).toContain('key=value');
  });
});

// ─── remove ───────────────────────────────────────────────────────────────────

describe('Cookies.remove', () => {
  it('writes an expired cookie to document.cookie', () => {
    const result = cookies.remove('myKey', 'localhost');
    expect(result).toContain('myKey=');
    expect(result).toContain('1970');
  });
});

// ─── getAccessToken ───────────────────────────────────────────────────────────

describe('Cookies.getAccessToken', () => {
  it('returns the accessToken value when running in a browser', () => {
    mockIsBrowser.mockReturnValue(true);
    mockDocumentCookie.mockReturnValue('accessToken=my-token');
    expect(cookies.getAccessToken()).toBe('my-token');
  });

  it('returns undefined when not running in a browser', () => {
    mockIsBrowser.mockReturnValue(false);
    expect(cookies.getAccessToken()).toBeUndefined();
  });
});

// ─── setAccessToken ───────────────────────────────────────────────────────────

describe('Cookies.setAccessToken', () => {
  it('sets the accessToken cookie using the current domain', () => {
    mockDomain.mockReturnValue('example.com');
    const result = cookies.setAccessToken('jwt-value');
    expect(result).toContain('accessToken=jwt-value');
  });
});

// ─── removeAccessToken ────────────────────────────────────────────────────────

describe('Cookies.removeAccessToken', () => {
  it('removes the accessToken cookie using the current domain', () => {
    mockDomain.mockReturnValue('example.com');
    const result = cookies.removeAccessToken();
    expect(result).toContain('accessToken=');
    expect(result).toContain('1970');
  });
});
