import { PokedexService } from './service';

describe('PokedexService', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    global.fetch = jest.fn();
  });

  it('calls the list endpoint', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], meta: { total: 0 } }),
    });

    const service = new PokedexService('https://api.example.com', 'token');
    await service.list({ page: '1', limit: '12' });

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/pokedex?page=1&limit=12', expect.objectContaining({
      method: 'GET',
    }));
  });

  it('calls the detail endpoint', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1' }),
    });

    const service = new PokedexService('https://api.example.com', 'token');
    await service.detail('bulbasaur');

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/pokedex/bulbasaur', expect.any(Object));
  });

  it('calls the discover endpoint', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', discovered: true }),
    });

    const service = new PokedexService('https://api.example.com', 'token');
    await service.discover('bulbasaur');

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/pokedex/bulbasaur/discover', expect.any(Object));
  });
});
