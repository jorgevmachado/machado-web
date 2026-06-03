import { __DOMAIN_BFF_SERVICE__ } from './bffService';

class Test__DOMAIN_BFF_SERVICE__ extends __DOMAIN_BFF_SERVICE__ {
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

describe('__DOMAIN_BFF_SERVICE__', () => {
  it('sets domain, pathUrl and baseUrl in constructor', () => {
    const service = new Test__DOMAIN_BFF_SERVICE__('__DOMAIN_PATH__');

    expect(service.getDomain()).toBe('__DOMAIN_TRANSLATE__');
    expect(service.getPathUrl()).toBe('__DOMAIN_PATH__');
    expect(service.getBaseUrl()).toBe('/api');
  });

  it('builds detail endpoint and domain i18n message on fetchOne', async () => {
    const service = new Test__DOMAIN_BFF_SERVICE__('__DOMAIN_PATH__');
    const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce({ id: 1, name: 'name' } as never);

    const response = await service.fetchOne('name');

    expect(getSpy).toHaveBeenCalledWith('__DOMAIN_PATH__/name');
    expect(response).toEqual({
      data: { id: 1, name: 'name' },
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: '__DOMAIN_TRANSLATE__.detail.loadError',
    });
  });

  it('builds list endpoint and domain i18n message on fetchAll', async () => {
    const service = new Test__DOMAIN_BFF_SERVICE__('__DOMAIN_PATH__');
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

    expect(getSpy).toHaveBeenCalledWith('__DOMAIN_PATH__?page=1&limit=10&name=name');
    expect(response).toEqual({
      data,
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: '__DOMAIN_TRANSLATE__.list.loadError',
    });
  });
});
