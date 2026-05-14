import { TrainerService } from './service';

describe('TrainerService', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    global.fetch = jest.fn();
  });

  it('calls create and onboarding endpoints', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: '2' }) });

    const service = new TrainerService('https://api.example.com', 'token');
    await service.onboard({ pokemon_name: 'bulbasaur', pokeballs: 1, capture_rate: 75 });

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.example.com/trainer/onboarding', expect.objectContaining({
      method: 'POST',
    }));
  });
});
