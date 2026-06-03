import { __DOMAIN_SERVICE__ } from './service';

describe('__DOMAIN_SERVICE__', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('calls the __DOMAIN_TEST_NAME__ list endpoint with query params', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [], meta: { total: 0 } }),
    } as Response);
    const service = new __DOMAIN_SERVICE__('http://api.test', 'token');

    await service.list({ page: '2', limit: '12', name: 'name' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/__DOMAIN_PATH__?page=2&limit=12&name=name',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      }),
    );
  });

  it('calls the __DOMAIN_TEST_NAME__ detail endpoint by identifier', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: '1', name: 'name' }),
    } as Response);
    const service = new __DOMAIN_SERVICE__('http://api.test');

    await service.detail('name');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/__DOMAIN_PATH__/name',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
