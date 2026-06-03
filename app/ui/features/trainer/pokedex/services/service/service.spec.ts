import { TrainerPokedexService } from './service';

describe('TrainerPokedexService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('calls the Trainer Pokedex list endpoint with query params', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [], meta: { total: 0 } }),
    } as Response);
    const service = new TrainerPokedexService('http://api.test', 'token');

    await service.list({ page: '2', limit: '12', pokemon_name: 'name' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/trainer/pokedex?page=2&limit=12&pokemon_name=name',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      }),
    );
  });

  it('calls the Trainer Pokedex detail endpoint by identifier', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: '1', name: 'name' }),
    } as Response);
    const service = new TrainerPokedexService('http://api.test');

    await service.detail('name');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/trainer/pokedex/name',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
