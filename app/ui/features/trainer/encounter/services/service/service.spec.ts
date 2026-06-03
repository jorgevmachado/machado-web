import { TrainerEncounterService } from './service';

describe('TrainerEncounterService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('calls the Trainer Encounter list endpoint with query params', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [], meta: { total: 0 } }),
    } as Response);
    const service = new TrainerEncounterService('http://api.test', 'token');

    await service.list({ page: '2', limit: '12', name: 'name' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/trainer/encounter?page=2&limit=12&name=name',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      }),
    );
  });

  it('calls the Trainer Encounter detail endpoint by identifier', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: '1', name: 'name' }),
    } as Response);
    const service = new TrainerEncounterService('http://api.test');

    await service.detail('name');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/trainer/encounter/name',
      expect.objectContaining({ method: 'GET' }),
    );
  });
  
  it('calls the Trainer Encounter active endpoint by encounter_id', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: '1', name: 'name' }),
    } as Response);
    const service = new TrainerEncounterService('http://api.test');

    await service.active({ encounter_id: 'encounter_id' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/trainer/encounter/active',
      expect.objectContaining({ method: 'PUT' }),
    );
  });
});
