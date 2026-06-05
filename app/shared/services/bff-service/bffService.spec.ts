import { BffBaseServiceAbstract } from '../bff-service';

type TestBffItem = {
  id: string;
  name: string;
};

class TestBffService extends BffBaseServiceAbstract<TestBffItem> {
  constructor(pathUrl: string) {
    super('domain', pathUrl);
  }

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

describe('BffBaseServiceAbstract', () => {
  it('sets domain, pathUrl and baseUrl correctly', () => {
    const service = new TestBffService('test');

    expect(service.getDomain()).toBe('domain');
    expect(service.getPathUrl()).toBe('test');
    expect(service.getBaseUrl()).toBe('/api');
  });

  describe('isResponseError', () => {
    it('returns true when response has statusCode', () => {
      const service = new TestBffService('test');

      expect(
        service.isResponseError({ statusCode: 404, message: 'Not found' } as never),
      ).toBe(true);
    });

    it('returns false when response is a valid data object', () => {
      const service = new TestBffService('test');

      expect(service.isResponseError({ id: '1', name: 'pikachu' })).toBe(false);
    });
  });

  describe('fetchOne', () => {
    it('returns success response when fetchOne succeeds', async () => {
      const service = new TestBffService('pokemon');
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce({ id: '1', name: 'pikachu' });

      const response = await service.fetchOne('pikachu');

      expect(getSpy).toHaveBeenCalledWith('pokemon/pikachu');
      expect(response).toEqual({
        data: { id: '1', name: 'pikachu' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.detail.loadError',
      });
    });

    it('returns error response when fetchOne returns ResponseError', async () => {
      const service = new TestBffService('pokemon');
      jest.spyOn(service, 'get').mockResolvedValueOnce({
        statusCode: 503,
        message: 'Service unavailable',
      } as never);

      const response = await service.fetchOne('pikachu');

      expect(response).toEqual({
        error: true,
        status: 503,
        message: 'Service unavailable',
        i18nMessage: 'domain.detail.loadError',
      });
    });
  });

  describe('fetchAll', () => {
    it('returns success response fetchAll and builds query string with filters and pagination', async () => {
      const service = new TestBffService('pokemon');
      const data = {
        items: [{ id: '1', name: 'pikachu' }],
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
      const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce(data);

      const response = await service.fetchAll({ name: 'pikachu' }, 1, 10);

      expect(getSpy).toHaveBeenCalledWith('pokemon?page=1&limit=10&name=pikachu');
      expect(response).toEqual({
        data,
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.list.loadError',
      });
    });

    it('calls fetchAll  without query string when filters are empty and no pagination is provided', async () => {
      const service = new TestBffService('pokemon');
      const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce([]);

      await service.fetchAll({});

      expect(getSpy).toHaveBeenCalledWith('pokemon');
    });

    it('returns error response fetchAll when get returns ResponseError', async () => {
      const service = new TestBffService('pokemon');
      jest.spyOn(service, 'get').mockResolvedValueOnce({
        statusCode: 500,
        message: 'Internal Server Error',
      } as never);

      const response = await service.fetchAll({ name: 'pikachu' });

      expect(response).toEqual({
        error: true,
        status: 500,
        message: 'Internal Server Error',
        i18nMessage: 'domain.list.loadError',
      });
    });
  });

  describe('fetchList', () => {
    it('fetchList delegates to fetchAll with the same arguments', async () => {
      const service = new TestBffService('pokemon');
      const fetchAllSpy = jest.spyOn(service, 'fetchAll').mockResolvedValueOnce({
        data: [],
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.list.loadError',
      });

      const response = await service.fetchList({ name: 'pikachu' }, 2, 20);

      expect(fetchAllSpy).toHaveBeenCalledWith({ name: 'pikachu' }, 2, 20);
      expect(response).toEqual({
        data: [],
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.list.loadError',
      });
    });
  });
  
  describe('bff_get', () => {
    it('returns success response when bff_get succeeds', async () => {
      const service = new TestBffService('pokemon');
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce([{ id: '1', name: 'pikachu' }]);

      const response = await service.bff_get();

      expect(getSpy).toHaveBeenCalledWith('pokemon', undefined);
      expect(response).toEqual({
        data: [{ id: '1', name: 'pikachu' }],
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.list.loadError',
      });
    });

    it('returns success response with param when bff_get succeeds', async () => {
      const service = new TestBffService('pokemon');
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce({ id: '1', name: 'pikachu' });

      const response = await service.bff_get({ param: 'pikachu' });

      expect(getSpy).toHaveBeenCalledWith('pokemon/pikachu', undefined);
      expect(response).toEqual({
        data: { id: '1', name: 'pikachu' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.list.loadError',
      });
    });

    it('returns success response with param has / when bff_get succeeds', async () => {
      const service = new TestBffService('pokemon');
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce({ id: '1', name: 'pikachu' });

      const response = await service.bff_get({ param: '/pikachu' });

      expect(getSpy).toHaveBeenCalledWith('pokemon/pikachu', undefined);
      expect(response).toEqual({
        data: { id: '1', name: 'pikachu' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.list.loadError',
      });
    });

    it('returns success response with param and queryString when bff_get succeeds', async () => {
      const service = new TestBffService('pokemon');
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce([{ id: '1', name: 'pikachu' }]);

      const response = await service.bff_get({ param:'/pikachu',  queryString: 'name=pikachu' });

      expect(getSpy).toHaveBeenCalledWith('pokemon/pikachu?name=pikachu', undefined);
      expect(response).toEqual({
        data: [{ id: '1', name: 'pikachu' }],
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.list.loadError',
      });
    });
  });

  describe('bff_path', () => {
    it('returns success response when bff_path succeeds', async () => {
      const service = new TestBffService('trainer/encounter');
      const dataResponse = { id: 'encounter_id', name: 'pallet', is_active: true };
      const getSpy = jest
        .spyOn(service, 'path')
        .mockResolvedValueOnce(dataResponse);
      const config = { body: { encounter_id: 'encounter_id' } };
      const response = await service.bff_path({ param: 'active', config });

      expect(getSpy).toHaveBeenCalledWith('trainer/encounter/active', config);
      expect(response).toEqual({
        data: dataResponse,
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.update.loadError',
      });
    });

    it('returns success response with param has / when bff_path  succeeds', async () => {
      const service = new TestBffService('trainer/encounter');
      const dataResponse = { id: 'encounter_id', name: 'pallet', is_active: true };
      const getSpy = jest
        .spyOn(service, 'path')
        .mockResolvedValueOnce(dataResponse);
      const config = { body: { encounter_id: 'encounter_id' } };
      const response = await service.bff_path({ param: '/active', config });

      expect(getSpy).toHaveBeenCalledWith('trainer/encounter/active', config);
      expect(response).toEqual({
        data: dataResponse,
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.update.loadError',
      });
    });
  });

  describe('bff_post', () => {
    it('returns success response when bff_post succeeds', async () => {
      const service = new TestBffService('trainer');
      const dataResponse = {
        id: 'trainer_id',
        name: 'ash',
        pokemon: { name: 'pikachu' },
        pokeballs: 1,
        capture_rate: 70,
      };
      const getSpy = jest
        .spyOn(service, 'post')
        .mockResolvedValueOnce(dataResponse);
      const response = await service.bff_post();

      expect(getSpy).toHaveBeenCalledWith('trainer', undefined);
      expect(response).toEqual({
        data: dataResponse,
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.create.loadError',
      });
    });

    it('returns success response with param has / when bff_post  succeeds', async () => {
      const service = new TestBffService('trainer');
      const dataResponse = {
        id: 'trainer_id',
        name: 'ash',
        pokemon: { name: 'pikachu' },
        pokeballs: 1,
        capture_rate: 70,
      };
      const getSpy = jest
        .spyOn(service, 'post')
        .mockResolvedValueOnce(dataResponse);
      const config = { body: { pokeballs: 1, capture_Rate: 70 } };
      const response = await service.bff_post({ param: '/onboard', config });

      expect(getSpy).toHaveBeenCalledWith('trainer/onboard', config);
      expect(response).toEqual({
        data: dataResponse,
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'domain.create.loadError',
      });
    });
  });
});