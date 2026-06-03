import { PokemonGrowthRateBffService } from './bffService';

class TestPokemonGrowthRateBffService extends PokemonGrowthRateBffService {
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

describe('PokemonGrowthRateBffService', () => {
  it('sets domain, pathUrl and baseUrl in constructor', () => {
    const service = new TestPokemonGrowthRateBffService('pokemon/growth_rate');

    expect(service.getDomain()).toBe('pokemon.growth-rate');
    expect(service.getPathUrl()).toBe('pokemon/growth_rate');
    expect(service.getBaseUrl()).toBe('/api');
  });

  it('builds detail endpoint and domain i18n message on fetchOne', async () => {
    const service = new TestPokemonGrowthRateBffService('pokemon/growth_rate');
    const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce({ id: 1, name: 'name' } as never);

    const response = await service.fetchOne('name');

    expect(getSpy).toHaveBeenCalledWith('pokemon/growth_rate/name');
    expect(response).toEqual({
      data: { id: 1, name: 'name' },
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'pokemon.growth-rate.detail.loadError',
    });
  });

  it('builds list endpoint and domain i18n message on fetchAll', async () => {
    const service = new TestPokemonGrowthRateBffService('pokemon/growth_rate');
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

    expect(getSpy).toHaveBeenCalledWith('pokemon/growth_rate?page=1&limit=10&name=name');
    expect(response).toEqual({
      data,
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'pokemon.growth-rate.list.loadError',
    });
  });
});
