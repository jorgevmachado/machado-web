import { PokemonService } from './service';

describe('PokemonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('calls the list endpoint with query params', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [], meta: { total: 0 } }),
    } as Response);
    const service = new PokemonService('http://api.test', 'token');

    await service.list({ page: '2', limit: '12', type: 'grass' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/pokemon?page=2&limit=12&type=grass',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      }),
    );
  });

  it('calls the detail endpoint by identifier', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: '1', name: 'bulbasaur' }),
    } as Response);
    const service = new PokemonService('http://api.test');

    await service.detail('bulbasaur');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/pokemon/bulbasaur',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('exposes nested service modules through getters', () => {
    const service = new PokemonService('http://api.test', 'token');

    expect(service.ability).toBeDefined();
    expect(service.encounter).toBeDefined();
    expect(service.growthRate).toBeDefined();
    expect(service.move).toBeDefined();
    expect(service.type).toBeDefined();
  });
});
