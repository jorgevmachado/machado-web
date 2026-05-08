import { convertSubPathUrl, formatUrl, getBaseUrl, sanitizedParams, serialize_url } from './url';

describe('url utils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns the first configured service base url', () => {
    delete process.env.POKEDEX_SERVICE_BASE_URL;
    delete process.env.NEXT_PUBLIC_POKEDEX_SERVICE_BASE_URL;
    process.env.AUTH_SERVICE_BASE_URL = 'http://auth.local';

    expect(getBaseUrl()).toBe('http://auth.local');
  });

  it('falls back to the local API url', () => {
    delete process.env.POKEDEX_SERVICE_BASE_URL;
    delete process.env.NEXT_PUBLIC_POKEDEX_SERVICE_BASE_URL;
    delete process.env.AUTH_SERVICE_BASE_URL;
    delete process.env.NEXT_PUBLIC_AUTH_SERVICE_BASE_URL;

    expect(getBaseUrl()).toBe('http://127.0.0.1:8000');
  });

  it('formats urls with optional query params', () => {
    expect(formatUrl('http://api.local', 'pokemon', { name: 'pikachu' }))
      .toBe('http://api.local/pokemon?name=pikachu');
    expect(formatUrl('http://api.local', '', {})).toBe('http://api.local');
  });

  it('serializes params only when keys exist', () => {
    expect(serialize_url({ name: 'pikachu', page: '1' })).toBe('name=pikachu&page=1');
    expect(serialize_url({})).toBeUndefined();
  });

  it('converts sub paths for collection and item routes', () => {
    expect(convertSubPathUrl({ pathUrl: 'pokemon' })).toBe('pokemon');
    expect(convertSubPathUrl({ pathUrl: 'pokemon', by: 'type' })).toBe('pokemon/type');
    expect(convertSubPathUrl({ pathUrl: 'pokemon', isParam: true, conectorPath: 'pikachu' }))
      .toBe('pokemon/pikachu');
    expect(convertSubPathUrl({ pathUrl: 'pokemon', subPathUrl: 'move' })).toBe('pokemon/move');
    expect(convertSubPathUrl({ pathUrl: 'pokemon', conectorPath: 'pikachu', subPathUrl: 'move' }))
      .toBe('pokemon/pikachu/move');
  });

  it('sanitizes query param values', () => {
    expect(sanitizedParams(' pikachu ')).toBe('pikachu');
    expect(sanitizedParams('   ')).toBeUndefined();
    expect(sanitizedParams(null)).toBeUndefined();
  });
});
