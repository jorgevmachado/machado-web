import { PokemonEncounterService } from './service';

describe('PokemonEncounterService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('calls the encounter list endpoint with query params', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [], meta: { total: 0 } }),
    } as Response);
    const service = new PokemonEncounterService('http://api.test', 'token');

    await service.list({ page: '2', limit: '12', name: 'tackle' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/pokemon/encounter?page=2&limit=12&name=tackle',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      }),
    );
  });

  it('calls the encounter detail endpoint by identifier', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: '1', name: 'tackle' }),
    } as Response);
    const service = new PokemonEncounterService('http://api.test');

    await service.detail('tackle');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/pokemon/encounter/tackle',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
