import { PokemonAbilityService } from './service';

describe('PokemonAbilityService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('calls the ability list endpoint with query params', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [], meta: { total: 0 } }),
    } as Response);
    const service = new PokemonAbilityService('http://api.test', 'token');

    await service.list({ page: '2', limit: '12', name: 'overgrow' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/pokemon/ability?page=2&limit=12&name=overgrow',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      }),
    );
  });

  it('calls the ability detail endpoint by identifier', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: '1', name: 'overgrow' }),
    } as Response);
    const service = new PokemonAbilityService('http://api.test');

    await service.detail('overgrow');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/pokemon/ability/overgrow',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
