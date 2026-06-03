import { PokemonEncounterBffService } from './bffService';

class TestPokemonEncounterBffService extends PokemonEncounterBffService {
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

describe('PokemonEncounterBffService', () => {
  it('sets domain, pathUrl and baseUrl in constructor', () => {
    const service = new TestPokemonEncounterBffService('pokemon/encounter');

    expect(service.getDomain()).toBe('pokemon.encounter');
    expect(service.getPathUrl()).toBe('pokemon/encounter');
    expect(service.getBaseUrl()).toBe('/api');
  });

  it('builds detail endpoint and domain i18n message on fetchOne', async () => {
    const service = new TestPokemonEncounterBffService('pokemon/encounter');
    const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce({ id: 1, name: 'name' } as never);

    const response = await service.fetchOne('name');

    expect(getSpy).toHaveBeenCalledWith('pokemon/encounter/name');
    expect(response).toEqual({
      data: { id: 1, name: 'name' },
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'pokemon.encounter.detail.loadError',
    });
  });

  it('builds list endpoint and domain i18n message on fetchAll', async () => {
    const service = new TestPokemonEncounterBffService('pokemon/encounter');
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

    expect(getSpy).toHaveBeenCalledWith('pokemon/encounter?page=1&limit=10&name=name');
    expect(response).toEqual({
      data,
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'pokemon.encounter.list.loadError',
    });
  });
});
