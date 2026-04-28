import { Http } from '../http';

// ─── Concrete subclass for testing ───────────────────────────────────────────

class TestHttp extends Http {
  constructor(url = 'http://api.test', config: RequestInit = {}) {
    super(url, config);
  }

  // Expose protected url/config via the inherited getters
}

// ─── fetch mock setup ────────────────────────────────────────────────────────

const mockFetch = jest.fn();

beforeAll(() => {
  global.fetch = mockFetch;
});

afterEach(() => {
  mockFetch.mockReset();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockOkResponse(body: unknown, status = 200) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status,
    json: () => Promise.resolve(body),
  });
}

function mockErrorResponse(body: unknown, status = 400) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  });
}

// ─── url / config getters ────────────────────────────────────────────────────

describe('Http getters', () => {
  it('exposes the base url', () => {
    const http = new TestHttp('http://example.com');
    expect(http.url).toBe('http://example.com');
  });

  it('exposes the config object', () => {
    const config = { headers: { 'X-App': 'test' } };
    const http = new TestHttp('http://example.com', config);
    expect(http.config).toEqual(config);
  });
});

// ─── GET ──────────────────────────────────────────────────────────────────────

describe('Http.get', () => {
  it('sends a GET request and returns the parsed response', async () => {
    const http = new TestHttp();
    mockOkResponse({ id: 1, name: 'Pikachu' });

    const result = await http.get<{ id: number; name: string }>('pokemon/1');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain('pokemon/1');
    expect(init.method).toBe('GET');
    expect(result).toEqual({ id: 1, name: 'Pikachu' });
  });

  it('includes query params in the URL', async () => {
    const http = new TestHttp();
    mockOkResponse([]);

    await http.get('pokemon', { params: { page: '1', limit: '20' } });

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('page=1');
    expect(url).toContain('limit=20');
  });

  it('uses default empty config when none is provided', async () => {
    const http = new TestHttp();
    mockOkResponse({});

    await http.get('path');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

// ─── POST ────────────────────────────────────────────────────────────────────

describe('Http.post', () => {
  it('sends a POST request with a JSON body', async () => {
    const http = new TestHttp();
    mockOkResponse({ created: true });

    const body = { username: 'ash', password: 'pikachu' };
    await http.post('auth/login', { body });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain('auth/login');
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify(body));
    expect(init.headers?.['content-type']).toContain('application/json');
  });

  it('sends a POST request with a FormData body (no content-type header override)', async () => {
    const http = new TestHttp();
    mockOkResponse({ ok: true });

    const fd = new FormData();
    fd.append('file', new Blob(['hello'], { type: 'text/plain' }), 'hello.txt');
    await http.post('upload', { body: fd });

    const [, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(FormData);
    // content-type is NOT overridden for FormData (browser sets multipart boundary)
    expect(init.headers?.['content-type']).toBeUndefined();
  });

  it('uses default empty config when none is provided', async () => {
    const http = new TestHttp();
    mockOkResponse({});

    await http.post('path');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

// ─── PUT (path method) ────────────────────────────────────────────────────────

describe('Http.path (PUT)', () => {
  it('sends a PUT request with a JSON body', async () => {
    const http = new TestHttp();
    mockOkResponse({ updated: true });

    await http.path('pokemon/1', { body: { name: 'Raichu' } });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain('pokemon/1');
    expect(init.method).toBe('PUT');
    expect(init.headers?.['content-type']).toContain('application/json');
  });

  it('sends a PUT request with a FormData body', async () => {
    const http = new TestHttp();
    mockOkResponse({});

    const fd = new FormData();
    await http.path('resource/1', { body: fd });

    const [, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe('PUT');
    expect(init.body).toBeInstanceOf(FormData);
  });

  it('uses default empty config when none is provided', async () => {
    const http = new TestHttp();
    mockOkResponse({});

    await http.path('resource');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

// ─── DELETE ───────────────────────────────────────────────────────────────────

describe('Http.remove', () => {
  it('sends a DELETE request', async () => {
    const http = new TestHttp();
    mockOkResponse({ deleted: true });

    await http.remove('pokemon/1');

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain('pokemon/1');
    expect(init.method).toBe('DELETE');
  });

  it('uses default empty config when none is provided', async () => {
    const http = new TestHttp();
    mockOkResponse({});

    await http.remove('resource');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

// ─── handle – error responses ─────────────────────────────────────────────────

describe('Http error handling', () => {
  it('throws a ResponseError when the response is not ok', async () => {
    const http = new TestHttp();
    mockErrorResponse({ detail: 'Not found' }, 404);

    await expect(http.get('missing')).rejects.toMatchObject({
      error: 'Not found',
      message: 'Not found',
      statusCode: 404,
    });
  });

  it('uses default values when no error detail is provided', async () => {
    const http = new TestHttp();
    // Simulate a network error (fetch itself rejects)
    mockFetch.mockRejectedValueOnce(undefined);

    await expect(http.get('path')).rejects.toMatchObject({
      error: 'internal Server Error',
      message: 'Internal Server Error',
      statusCode: 500,
    });
  });

  it('handles response.json() failure gracefully', async () => {
    const http = new TestHttp();
    // Response is ok but json() throws
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.reject(new Error('bad json')),
    });

    // json failure → data.response is undefined → result is undefined cast to T
    const result = await http.get('path');
    expect(result).toBeUndefined();
  });

  it('includes extra config headers and merges them correctly', async () => {
    const http = new TestHttp('http://api.test', {
      headers: { Authorization: 'Bearer token123' },
    });
    mockOkResponse({ ok: true });

    await http.get('protected');

    const [, init] = mockFetch.mock.calls[0];
    expect(init.headers?.['Authorization']).toBe('Bearer token123');
  });
});
