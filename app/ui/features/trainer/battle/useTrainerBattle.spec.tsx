import { act, renderHook, waitFor } from '@testing-library/react';

import { useTrainerBattle } from './useTrainerBattle';

const startContentLoading = jest.fn();
const stopContentLoading = jest.fn();

jest.mock('@/app/ds', () => ({
  useLoading: () => ({
    startContentLoading,
    stopContentLoading,
  }),
}));

jest.mock('@/app/i18n', () => {
  const stableT = (key: string) => key;
  return {
    useAppTranslation: () => ({
      t: stableT,
    }),
  };
});

const battle = {
  id: 'battle-1',
  trainer_id: 'trainer-1',
  exploration_event_id: 'event-1',
  trainer_active_my_pokemon_id: 'my-pokemon-1',
  wild_pokemon_id: 'pokemon-25',
  wild_pokemon_name: 'pikachu',
  wild_pokemon_level: 1,
  turn_number: 1,
  status: 'ACTIVE',
  trainer_side: {
    my_pokemon_id: 'my-pokemon-1',
    name: 'bulbasaur-owned',
    nickname: 'Bulbasaur',
    level: 5,
    current_hp: 16,
    max_hp: 20,
    attack: 12,
    defense: 9,
    special_attack: 10,
    special_defense: 10,
    speed: 10,
    moves: [{ id: 'move-1', name: 'tackle', type: 'normal', power: 8, accuracy: 100, pp: 9, max_pp: 10 }],
  },
  wild_side: {
    pokemon_id: 'pokemon-25',
    name: 'pikachu',
    level: 1,
    current_hp: 4,
    max_hp: 18,
    attack: 11,
    defense: 8,
    special_attack: 10,
    special_defense: 8,
    speed: 11,
    moves: [{ id: 'move-2', name: 'scratch', type: 'normal', power: 5, accuracy: 100, pp: 14, max_pp: 15 }],
  },
  party: [],
  created_at: '2026-05-20T00:00:00Z',
};

const logs = [
  {
    id: 'log-1',
    log_type: 'SESSION_STARTED',
    message: 'Wild pikachu battle started',
    payload: {},
    created_at: '2026-05-20T00:00:00Z',
  },
];

describe('useTrainerBattle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn((url: string) => {
      if (url === '/api/trainer/battle/active') {
        return Promise.resolve({ ok: true, json: async () => battle } as Response);
      }
      if (url === '/api/trainer/battle/logs') {
        return Promise.resolve({ ok: true, json: async () => logs } as Response);
      }
      if (url === '/api/trainer/battle/move') {
        return Promise.resolve({ ok: true, json: async () => battle } as Response);
      }
      if (url === '/api/trainer/battle/switch') {
        return Promise.resolve({ ok: true, json: async () => ({ ...battle, trainer_active_my_pokemon_id: 'my-pokemon-2' }) } as Response);
      }
      if (url === '/api/trainer/battle/flee') {
        return Promise.resolve({ ok: true, json: async () => ({ ...battle, status: 'FLED' }) } as Response);
      }
      return Promise.resolve({ ok: false, json: async () => ({ message: 'unexpected' }) } as Response);
    }) as jest.Mock;
  });

  it('loads the active battle and logs on mount', async () => {
    const { result } = renderHook(() => useTrainerBattle());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.id).toBe('battle-1');
    expect(result.current.logs).toEqual(logs);
    expect(startContentLoading).toHaveBeenCalled();
    expect(stopContentLoading).toHaveBeenCalled();
  });

  it('executes move, switch and flee actions', async () => {
    const { result } = renderHook(() => useTrainerBattle());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.useMove('move-1');
    });
    expect(result.current.data?.id).toBe('battle-1');

    await act(async () => {
      await result.current.switchPokemon('my-pokemon-2');
    });
    expect(result.current.data?.trainer_active_my_pokemon_id).toBe('my-pokemon-2');

    await act(async () => {
      await result.current.flee();
    });

    await waitFor(() => {
      expect(result.current.data?.status).toBe('FLED');
    });
  });

  it('stores load errors from invalid responses and thrown exceptions', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/trainer/battle/active') {
        return Promise.resolve({ ok: false, json: async () => ({ message: 'battle failed' }) } as Response);
      }
      if (url === '/api/trainer/battle/logs') {
        return Promise.resolve({ ok: true, json: async () => logs } as Response);
      }
      return Promise.resolve({ ok: false, json: async () => ({ message: 'unexpected' }) } as Response);
    });

    const invalidResponse = renderHook(() => useTrainerBattle());

    await waitFor(() => {
      expect(invalidResponse.result.current.errorMessage).toBe('battle failed');
    });

    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      throw new Error('load exploded');
    });

    await act(async () => {
      await invalidResponse.result.current.load();
    });

    expect(invalidResponse.result.current.errorMessage).toBe('load exploded');
  });

  it('uses the battle logs message and load fallback when the load request fails without an Error message', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/trainer/battle/active') {
        return Promise.resolve({ ok: false, json: async () => ({}) } as Response);
      }
      if (url === '/api/trainer/battle/logs') {
        return Promise.resolve({ ok: true, json: async () => ({ message: 'logs failed' }) } as Response);
      }
      return Promise.resolve({ ok: false, json: async () => ({}) } as Response);
    });

    const { result } = renderHook(() => useTrainerBattle());

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('logs failed');
    });

    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      throw 'load boom';
    });

    await act(async () => {
      await result.current.load();
    });

    expect(result.current.errorMessage).toBe('trainer.battle.loadError');
  });

  it('uses translated load fallback and action fallbacks when messages are missing', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/trainer/battle/active' || url === '/api/trainer/battle/logs') {
        return Promise.resolve({ ok: true, json: async () => ({}) } as Response);
      }
      return Promise.resolve({ ok: false, json: async () => ({}) } as Response);
    });

    const loadFallback = renderHook(() => useTrainerBattle());

    await waitFor(() => {
      expect(loadFallback.result.current.errorMessage).toBe('trainer.battle.loadError');
    });

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/trainer/battle/active') {
        return Promise.resolve({ ok: true, json: async () => battle } as Response);
      }
      if (url === '/api/trainer/battle/logs') {
        return Promise.resolve({ ok: true, json: async () => logs } as Response);
      }
      if (url === '/api/trainer/battle/move') {
        return Promise.resolve({ ok: false, json: async () => ({}) } as Response);
      }
      return Promise.resolve({ ok: true, json: async () => logs } as Response);
    });

    const actionFallback = renderHook(() => useTrainerBattle());

    await waitFor(() => {
      expect(actionFallback.result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await actionFallback.result.current.useMove('move-1');
    });

    expect(actionFallback.result.current.errorMessage).toBe('trainer.battle.actionError');

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/trainer/battle/move') {
        throw 'boom';
      }
      if (url === '/api/trainer/battle/active') {
        return Promise.resolve({ ok: true, json: async () => battle } as Response);
      }
      if (url === '/api/trainer/battle/logs') {
        return Promise.resolve({ ok: true, json: async () => logs } as Response);
      }
      return Promise.resolve({ ok: true, json: async () => logs } as Response);
    });

    await act(async () => {
      await actionFallback.result.current.useMove('move-1');
    });

    expect(actionFallback.result.current.errorMessage).toBe('trainer.battle.actionError');
  });

  it('uses the battle action response message and Error message when the action fails', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/trainer/battle/active') {
        return Promise.resolve({ ok: true, json: async () => battle } as Response);
      }
      if (url === '/api/trainer/battle/logs') {
        return Promise.resolve({ ok: true, json: async () => logs } as Response);
      }
      if (url === '/api/trainer/battle/move') {
        return Promise.resolve({ ok: false, json: async () => ({ message: 'move failed' }) } as Response);
      }
      return Promise.resolve({ ok: true, json: async () => logs } as Response);
    });

    const responseMessage = renderHook(() => useTrainerBattle());

    await waitFor(() => {
      expect(responseMessage.result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await responseMessage.result.current.useMove('move-1');
    });

    expect(responseMessage.result.current.errorMessage).toBe('move failed');

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/trainer/battle/active') {
        return Promise.resolve({ ok: true, json: async () => battle } as Response);
      }
      if (url === '/api/trainer/battle/logs') {
        return Promise.resolve({ ok: true, json: async () => logs } as Response);
      }
      if (url === '/api/trainer/battle/move') {
        throw new Error('action exploded');
      }
      return Promise.resolve({ ok: true, json: async () => logs } as Response);
    });

    await act(async () => {
      await responseMessage.result.current.useMove('move-1');
    });

    expect(responseMessage.result.current.errorMessage).toBe('action exploded');
  });

  it('keeps previous logs when the post-action logs payload is invalid', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/trainer/battle/active') {
        return Promise.resolve({ ok: true, json: async () => battle } as Response);
      }
      if (url === '/api/trainer/battle/logs') {
        return Promise.resolve({ ok: true, json: async () => logs } as Response);
      }
      if (url === '/api/trainer/battle/move') {
        return Promise.resolve({ ok: true, json: async () => battle } as Response);
      }
      return Promise.resolve({ ok: true, json: async () => ({}) } as Response);
    });

    const { result } = renderHook(() => useTrainerBattle());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const previousLogs = result.current.logs;

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/trainer/battle/move') {
        return Promise.resolve({ ok: true, json: async () => battle } as Response);
      }
      if (url === '/api/trainer/battle/logs') {
        return Promise.resolve({ ok: true, json: async () => ({ message: 'invalid logs' }) } as Response);
      }
      if (url === '/api/trainer/battle/active') {
        return Promise.resolve({ ok: true, json: async () => battle } as Response);
      }
      return Promise.resolve({ ok: true, json: async () => battle } as Response);
    });

    await act(async () => {
      await result.current.useMove('move-1');
    });

    expect(result.current.logs).toEqual(previousLogs);
  });
});
