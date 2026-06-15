import { TrainerService } from './service';

describe('TrainerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('list', () => {
    it('calls the Trainer list endpoint with query params', async () => {
      const fetchMock = global.fetch as jest.Mock;
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ items: [], meta: { total: 0 } }),
      } as Response);
      const service = new TrainerService('http://api.test', 'token');

      await service.list({ page: '2', limit: '12', name: 'name' });

      expect(fetchMock).toHaveBeenCalledWith(
        'http://api.test/trainer?page=2&limit=12&name=name',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({ Authorization: 'Bearer token' }),
        }),
      );
    });
  });

  describe('detail', () => {
    it('calls the Trainer detail endpoint by identifier', async () => {
      const fetchMock = global.fetch as jest.Mock;
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: '1', name: 'name' }),
      } as Response);
      const service = new TrainerService('http://api.test');

      await service.detail('name');

      expect(fetchMock).toHaveBeenCalledWith(
        'http://api.test/trainer/name',
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('explore', () => {
    it('calls the Trainer explore endpoint', async () => {
      const fetchMock = global.fetch as jest.Mock;
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: '1', name: 'name' }),
      } as Response);
      const service = new TrainerService('http://api.test');

      await service.explore();

      expect(fetchMock).toHaveBeenCalledWith(
        'http://api.test/trainer/explore',
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

});
