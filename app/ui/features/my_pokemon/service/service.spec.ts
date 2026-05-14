import { MyPokemonService } from './service';

describe('MyPokemonService', () => {
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

    const service = new MyPokemonService('https://api.example.com', 'token');
    await service.list({ page: '1', limit: '12' });

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/my-pokemon?page=1&limit=12', expect.objectContaining({
      method: 'GET',
    }));
  });

  it('calls the detail endpoint', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1' }),
    });

    const service = new MyPokemonService('https://api.example.com', 'token');
    await service.detail('bulbasaur-1');

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/my-pokemon/bulbasaur-1', expect.any(Object));
  });

  it('calls the create endpoint', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1' }),
    });

    const service = new MyPokemonService('https://api.example.com', 'token');
    await service.create({
      nickname: 'Bulbasaur',
      pokemon_name: 'bulbasaur-1',
    });

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/my-pokemon', expect.any(Object));
  });
});
