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
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'trainer-0' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ trainer: { id: 'trainer-1' } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 'encounter-1' }]) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'encounter-2' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'event-1' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 'party-1' }]) });

    const service = new TrainerService('https://api.example.com', 'token');
    await service.initialize({ nickname: 'Leaf', pokemon_name: 'bulbasaur' });
    await service.onboard({ pokemon_name: 'bulbasaur', pokeballs: 1, capture_rate: 75 });
    await service.home();
    await service.encounters();
    await service.selectActiveEncounter({ encounter_id: 'encounter-2' });
    await service.walk();
    await service.updateParty({ my_pokemon_ids: ['pokemon-1'] });

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.example.com/trainer/initialize', expect.objectContaining({
      method: 'POST',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://api.example.com/trainer/onboarding', expect.objectContaining({
      method: 'POST',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, 'https://api.example.com/trainer/home', expect.objectContaining({
      method: 'GET',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(4, 'https://api.example.com/trainer/exploration/encounters', expect.objectContaining({
      method: 'GET',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(5, 'https://api.example.com/trainer/exploration/encounters/active', expect.objectContaining({
      method: 'PUT',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(6, 'https://api.example.com/trainer/exploration/walk', expect.objectContaining({
      method: 'POST',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(7, 'https://api.example.com/trainer/party', expect.objectContaining({
      method: 'PUT',
    }));
  });
});
