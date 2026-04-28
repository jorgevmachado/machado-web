import { BaseServiceAbstract } from '../service';

// ─── Concrete subclass for testing ───────────────────────────────────────────

class TestService extends BaseServiceAbstract {
  constructor(baseUrl: string, pathUrl: string, token?: string) {
    super(baseUrl, pathUrl, token);
  }
}

// ─── constructor ──────────────────────────────────────────────────────────────

describe('BaseServiceAbstract', () => {
  it('sets pathUrl correctly', () => {
    const svc = new TestService('http://api.test', 'pokemon');
    expect(svc.pathUrl).toBe('pokemon');
  });

  it('does not add Authorization header when no token is provided', () => {
    const svc = new TestService('http://api.test', 'pokemon');
    // config.headers should be an empty object when no token
    const headers = (svc.config.headers ?? {}) as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });

  it('adds a Bearer Authorization header when a token is provided', () => {
    const token = 'my-jwt-token';
    const svc = new TestService('http://api.test', 'pokemon', token);
    const headers = (svc.config.headers ?? {}) as Record<string, string>;
    expect(headers['Authorization']).toBe(`Bearer ${token}`);
  });

  it('inherits the base url from Http', () => {
    const svc = new TestService('http://api.test', 'pokemon');
    expect(svc.url).toBe('http://api.test');
  });
});
