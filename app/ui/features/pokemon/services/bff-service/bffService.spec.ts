import { PokemonBffService } from './bffService';

class TestPokemonBffService extends PokemonBffService {
  public getDomain(): string {
    return this.domain;
  }

  public getPathUrl(): string {
    return this.pathUrl;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }
}

describe('PokemonBffService', () => {
  it('sets domain, pathUrl and baseUrl in constructor', () => {
    const service = new TestPokemonBffService('pokemon');

    expect(service.getDomain()).toBe('pokemon');
    expect(service.getPathUrl()).toBe('pokemon');
    expect(service.getBaseUrl()).toBe('/api');
  });

  it('builds detail endpoint and domain i18n message on fetchOne', async () => {
    const service = new TestPokemonBffService('pokemon');
    const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce({ id: 1, name: 'name' } as never);

    const response = await service.fetchOne('name');

    expect(getSpy).toHaveBeenCalledWith('pokemon/name');
    expect(response).toEqual({
      data: { id: 1, name: 'name' },
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'pokemon.detail.loadError',
    });
  });

  it('builds list endpoint and domain i18n message on fetchAll', async () => {
    const service = new TestPokemonBffService('pokemon');
    const data = {
      items: [{ id: 1, name: 'name' }],
      meta: {
        total: 1,
        limit: 10,
        offset: 0,
        next_page: undefined,
        previous_page: undefined,
        total_pages: 1,
        current_page: 1,
      },
    };
    const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce(data as never);

    const response = await service.fetchAll({ name: 'name' }, 1, 10);

    expect(getSpy).toHaveBeenCalledWith('pokemon?page=1&limit=10&name=name');
    expect(response).toEqual({
      data,
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'pokemon.list.loadError',
    });
  });

  it('exposes feature modules through getters', () => {
    const service = new PokemonBffService('https://api.example.com');

    expect(service.ability).toBeDefined();
    expect(service.encounter).toBeDefined();
    expect(service.growthRate).toBeDefined();
    expect(service.move).toBeDefined();
    expect(service.type).toBeDefined();
  });
});
