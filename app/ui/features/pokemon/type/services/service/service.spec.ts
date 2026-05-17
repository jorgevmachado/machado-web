import { PokemonTypeService } from './service';

describe('PokemonTypeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('calls the type list endpoint with query params', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [], meta: { total: 0 } }),
    } as Response);
    const service = new PokemonTypeService('http://api.test', 'token');

    await service.list({ page: '2', limit: '12', name: 'fire' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/pokemon/type?page=2&limit=12&name=fire',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      }),
    );
  });

  it('calls the type detail endpoint by identifier', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: '1', name: 'fire' }),
    } as Response);
    const service = new PokemonTypeService('http://api.test');

    await service.detail('fire');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/pokemon/type/fire',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
