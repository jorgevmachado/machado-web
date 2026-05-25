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
      .mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 'party-1' }]) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'battle-1' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'battle-2' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'battle-3' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'battle-4' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, outcome: 'CAPTURED' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 'log-1' }]) });

    const service = new TrainerService('https://api.example.com', 'token');
    await service.initialize({ nickname: 'Leaf', pokemon_name: 'bulbasaur' });
    await service.onboard({ pokemon_name: 'bulbasaur', pokeballs: 1, capture_rate: 75 });
    await service.home();
    await service.encounters();
    await service.selectActiveEncounter({ encounter_id: 'encounter-2' });
    await service.walk();
    await service.updateParty({ my_pokemon_ids: ['pokemon-1'] });
    await service.activeBattle();
    await service.useBattleMove({ move_id: 'move-1' });
    await service.switchBattlePokemon({ my_pokemon_id: 'pokemon-2' });
    await service.fleeBattle();
    await service.captureBattlePokemon({ nickname: 'Sparky' });
    await service.battleLogs();

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.example.com/trainer/initialize', expect.objectContaining({
      method: 'POST',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://api.example.com/trainer/onboarding', expect.objectContaining({
      method: 'POST',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, 'https://api.example.com/trainer/home', expect.objectContaining({
      method: 'GET',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(4, 'https://api.example.com/trainer/encounter', expect.objectContaining({
      method: 'GET',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(5, 'https://api.example.com/trainer/encounter/active', expect.objectContaining({
      method: 'PUT',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(6, 'https://api.example.com/trainer/encounter/walk', expect.objectContaining({
      method: 'POST',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(7, 'https://api.example.com/trainer/party', expect.objectContaining({
      method: 'PUT',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(8, 'https://api.example.com/trainer/battle/active', expect.objectContaining({
      method: 'GET',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(9, 'https://api.example.com/trainer/battle/move', expect.objectContaining({
      method: 'POST',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(10, 'https://api.example.com/trainer/battle/switch', expect.objectContaining({
      method: 'POST',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(11, 'https://api.example.com/trainer/battle/flee', expect.objectContaining({
      method: 'POST',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(12, 'https://api.example.com/trainer/battle/capture', expect.objectContaining({
      method: 'POST',
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(13, 'https://api.example.com/trainer/battle/logs', expect.objectContaining({
      method: 'GET',
    }));
  });

  it('uses an empty payload when capturing without arguments', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, outcome: 'FAILED_CHANCE' }),
    });

    const service = new TrainerService('https://api.example.com', 'token');
    await service.captureBattlePokemon();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/trainer/battle/capture',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({}),
      }),
    );
  });
});
