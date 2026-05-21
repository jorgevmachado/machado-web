import { act, renderHook, waitFor } from '@testing-library/react';

import { useBattleSession } from './useBattleSession';

const startContentLoading = jest.fn();
const stopContentLoading = jest.fn();

const activeMock = jest.fn();
const logsMock = jest.fn();
const useMoveMock = jest.fn();
const switchPokemonMock = jest.fn();
const fleeMock = jest.fn();
const useAppTranslationMock = jest.fn();

jest.mock('@/app/ds', () => ({
  useLoading: () => ({
    startContentLoading,
    stopContentLoading,
  }),
}));

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => useAppTranslationMock(),
}));

jest.mock('../service', () => ({
  battleBffService: {
    active: (...args: unknown[]) => activeMock(...args),
    logs: (...args: unknown[]) => logsMock(...args),
    useMove: (...args: unknown[]) => useMoveMock(...args),
    switchPokemon: (...args: unknown[]) => switchPokemonMock(...args),
    flee: (...args: unknown[]) => fleeMock(...args),
    isResponseError: (response: unknown) => {
      return Boolean(response && typeof response === 'object' && 'statusCode' in response);
    },
  },
}));

const activeBattle = {
  id: 'battle-1',
  trainer_id: 'trainer-1',
  exploration_event_id: 'event-1',
  trainer_active_my_pokemon_id: 'my-pokemon-1',
  wild_pokemon_id: 'pokemon-25',
  wild_pokemon_name: 'pikachu',
  wild_pokemon_level: 3,
  turn_number: 1,
  status: 'ACTIVE' as const,
  trainer_side: {
    my_pokemon_id: 'my-pokemon-1',
    name: 'bulbasaur-owned',
    nickname: 'Bulbasaur',
    level: 5,
    current_hp: 14,
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
    level: 3,
    current_hp: 10,
    max_hp: 16,
    attack: 11,
    defense: 8,
    special_attack: 10,
    special_defense: 8,
    speed: 11,
    moves: [],
  },
  party: [],
  created_at: '2026-05-20T00:00:00Z',
};

describe('useBattleSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    activeMock.mockReset();
    logsMock.mockReset();
    useMoveMock.mockReset();
    switchPokemonMock.mockReset();
    fleeMock.mockReset();
    useAppTranslationMock.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('loads active battle and keeps logs in chronological order', async () => {
    activeMock.mockResolvedValue(activeBattle);
    logsMock.mockResolvedValue([
      {
        id: 'log-2',
        turn_number: 2,
        log_type: 'MOVE_USED',
        message: 'trainer attacked',
        payload: {},
        created_at: '2026-05-20T00:00:02.000Z',
      },
      {
        id: 'log-1',
        turn_number: 1,
        log_type: 'SESSION_STARTED',
        message: 'battle started',
        payload: {},
        created_at: '2026-05-20T00:00:01.000Z',
      },
    ]);

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.id).toBe('battle-1');
    expect(result.current.logs.map((log) => log.id)).toEqual(['log-1', 'log-2']);
    expect(startContentLoading).toHaveBeenCalled();
    expect(stopContentLoading).toHaveBeenCalled();
  });

  it('sorts logs with identical turn numbers by created_at', async () => {
    activeMock.mockResolvedValue(activeBattle);
    logsMock.mockResolvedValue([
      {
        id: 'log-late',
        turn_number: 1,
        log_type: 'MOVE_USED',
        message: 'later',
        payload: {},
        created_at: '2026-05-20T00:00:05.000Z',
      },
      {
        id: 'log-early',
        turn_number: 1,
        log_type: 'MOVE_USED',
        message: 'earlier',
        payload: {},
        created_at: '2026-05-20T00:00:01.000Z',
      },
    ]);

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.logs.map((log) => log.id)).toEqual(['log-early', 'log-late']);
    });
  });

  it('sorts logs without turn numbers after numbered turns', async () => {
    activeMock.mockResolvedValue(activeBattle);
    logsMock.mockResolvedValue([
      {
        id: 'log-without-turn',
        log_type: 'SYSTEM',
        message: 'after battle',
        payload: {},
        created_at: '2026-05-20T00:00:03.000Z',
      },
      {
        id: 'log-turn-1',
        turn_number: 1,
        log_type: 'SESSION_STARTED',
        message: 'battle started',
        payload: {},
        created_at: '2026-05-20T00:00:01.000Z',
      },
    ]);

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.logs.map((log) => log.id)).toEqual(['log-turn-1', 'log-without-turn']);
    });
  });

  it('sorts logs when the left side is missing turn_number', async () => {
    activeMock.mockResolvedValue(activeBattle);
    logsMock.mockResolvedValue([
      {
        id: 'log-turn-2',
        turn_number: 2,
        log_type: 'MOVE_USED',
        message: 'battle advanced',
        payload: {},
        created_at: '2026-05-20T00:00:02.000Z',
      },
      {
        id: 'log-without-turn',
        log_type: 'SYSTEM',
        message: 'after battle',
        payload: {},
        created_at: '2026-05-20T00:00:03.000Z',
      },
    ]);

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.logs.map((log) => log.id)).toEqual(['log-turn-2', 'log-without-turn']);
    });
  });

  it('returns empty state when no active battle exists', async () => {
    activeMock.mockResolvedValue({
      statusCode: 404,
      message: 'No active battle session',
    });

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.logs).toEqual([]);
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('returns empty state when active endpoint throws 404', async () => {
    activeMock.mockRejectedValue({
      statusCode: 404,
      message: 'No active battle session',
    });

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.logs).toEqual([]);
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('stores translated active and logs load errors for non-404 responses', async () => {
    activeMock.mockResolvedValue({
      statusCode: 500,
      message: '',
    });

    const first = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(first.result.current.errorMessage).toBe('trainer.battle.loadError');
    });

    activeMock.mockReset();
    logsMock.mockReset();
    activeMock.mockResolvedValue(activeBattle);
    logsMock.mockResolvedValue({
      statusCode: 503,
      message: '',
    });

    const second = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(second.result.current.errorMessage).toBe('trainer.battle.logsError');
    });
  });

  it('stores fallback load errors for thrown values without response shape', async () => {
    activeMock.mockRejectedValue('boom');

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('trainer.battle.loadError');
    });
  });

  it('stores thrown response error messages during load when they are not 404', async () => {
    activeMock.mockRejectedValue({
      statusCode: 500,
      message: 'load exploded',
    });

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('load exploded');
    });
  });

  it('stores translated fallback for thrown response errors without message during load', async () => {
    activeMock.mockRejectedValue({
      statusCode: 500,
      message: '',
    });

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('trainer.battle.loadError');
    });
  });

  it('stores native error messages during load', async () => {
    activeMock.mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('network down');
    });
  });

  it('executes move action and synchronizes session/logs after action', async () => {
    activeMock.mockResolvedValue(activeBattle);
    logsMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: 'log-2',
          turn_number: 2,
          log_type: 'MOVE_USED',
          message: 'trainer attacked',
          payload: {},
          created_at: '2026-05-20T00:00:02.000Z',
        },
      ]);
    useMoveMock.mockResolvedValue({ ...activeBattle, turn_number: 2 });

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.useMove('move-1');
    });

    expect(useMoveMock).toHaveBeenCalledWith({ move_id: 'move-1' });
    expect(activeMock).toHaveBeenCalledTimes(1);
    expect(result.current.logs.some((log) => log.id === 'log-2')).toBe(true);
    expect(result.current.isActing).toBe(false);
  });

  it('ignores actions when there is no active session and maps action response errors', async () => {
    activeMock.mockResolvedValue({
      ...activeBattle,
      status: 'ESCAPED',
    });
    logsMock.mockResolvedValue([]);
    useMoveMock.mockResolvedValue({
      statusCode: 409,
      message: '',
    });

    const terminalHook = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(terminalHook.result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await terminalHook.result.current.useMove('move-1');
    });

    expect(useMoveMock).not.toHaveBeenCalled();

    activeMock.mockReset();
    logsMock.mockReset();
    useMoveMock.mockReset();
    activeMock.mockResolvedValue(activeBattle);
    logsMock.mockResolvedValue([]);
    useMoveMock.mockResolvedValue({
      statusCode: 409,
      message: '',
    });

    const activeHook = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(activeHook.result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await activeHook.result.current.useMove('move-1');
    });

    expect(activeHook.result.current.errorMessage).toBe('trainer.battle.actionError');
  });

  it('maps thrown action errors and delegates switch/flee actions', async () => {
    activeMock.mockResolvedValue(activeBattle);
    logsMock.mockResolvedValue([]);
    switchPokemonMock.mockRejectedValue(new Error('switch failed'));
    fleeMock.mockResolvedValue({ ...activeBattle, status: 'ESCAPED' });

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.switchPokemon('my-pokemon-2');
    });

    expect(result.current.errorMessage).toBe('switch failed');

    await act(async () => {
      await result.current.flee();
    });

    expect(fleeMock).toHaveBeenCalled();
  });

  it('keeps prior logs when sync after action receives a response error and falls back action errors without messages', async () => {
    activeMock.mockResolvedValue(activeBattle);
    logsMock
      .mockResolvedValueOnce([
        {
          id: 'existing-log',
          turn_number: 1,
          log_type: 'SESSION_STARTED',
          message: 'battle started',
          payload: {},
          created_at: '2026-05-20T00:00:01.000Z',
        },
      ])
      .mockResolvedValueOnce({
        statusCode: 500,
        message: '',
      });
    useMoveMock.mockResolvedValue({ ...activeBattle, turn_number: 2 });
    switchPokemonMock.mockRejectedValue({});

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.useMove('move-1');
    });

    expect(result.current.logs.map((log) => log.id)).toEqual(['existing-log']);

    await act(async () => {
      await result.current.switchPokemon('my-pokemon-2');
    });

    expect(result.current.errorMessage).toBe('trainer.battle.actionError');
  });

  it('preserves the terminal snapshot when logs fail after a winning action', async () => {
    activeMock.mockResolvedValue(activeBattle);
    logsMock
      .mockResolvedValueOnce([])
      .mockRejectedValueOnce({ statusCode: 404, message: 'No active battle session' })
      .mockResolvedValueOnce({ statusCode: 404, message: 'No active battle session' });
    useMoveMock.mockResolvedValue({
      ...activeBattle,
      turn_number: 2,
      status: 'WILD_POKEMON_DEFEATED',
      wild_side: {
        ...activeBattle.wild_side,
        current_hp: 0,
      },
    });

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.useMove('move-1');
    });

    await waitFor(() => {
      expect(result.current.data?.status).toBe('WILD_POKEMON_DEFEATED');
    });

    expect(result.current.errorMessage).toBeUndefined();

    activeMock.mockReset();
    activeMock.mockResolvedValue({
      statusCode: 404,
      message: 'No active battle session',
    });

    await act(async () => {
      await result.current.load({ silent: true });
    });

    await waitFor(() => {
      expect(result.current.data?.status).toBe('WILD_POKEMON_DEFEATED');
    });

    expect(result.current.errorMessage).toBeUndefined();
  });

  it('preserves terminal logs when a later load throws 404', async () => {
    activeMock.mockResolvedValue(activeBattle);
    logsMock
      .mockResolvedValueOnce([
        {
          id: 'terminal-log',
          turn_number: 2,
          log_type: 'WILD_POKEMON_DEFEATED',
          message: 'victory',
          payload: {},
          created_at: '2026-05-20T00:00:02.000Z',
        },
      ])
      .mockRejectedValueOnce({ statusCode: 404, message: 'No active battle session' });
    useMoveMock.mockResolvedValue({
      ...activeBattle,
      turn_number: 2,
      status: 'WILD_POKEMON_DEFEATED',
      wild_side: {
        ...activeBattle.wild_side,
        current_hp: 0,
      },
    });

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.useMove('move-1');
    });

    expect(result.current.logs.map((log) => log.id)).toEqual(['terminal-log']);

    activeMock.mockReset();
    activeMock.mockRejectedValue({
      statusCode: 404,
      message: 'No active battle session',
    });

    await act(async () => {
      await result.current.load({ silent: true });
    });

    await waitFor(() => {
      expect(result.current.data?.status).toBe('WILD_POKEMON_DEFEATED');
    });

    expect(result.current.logs.map((log) => log.id)).toEqual(['terminal-log']);
  });

  it('polls while battle status remains active', async () => {
    jest.useFakeTimers();
    activeMock.mockResolvedValue(activeBattle);
    logsMock.mockResolvedValue([]);

    const { result } = renderHook(() => useBattleSession());

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      jest.advanceTimersByTime(4000);
    });

    expect(activeMock.mock.calls.length).toBeGreaterThanOrEqual(2);
    jest.useRealTimers();
  });

  it('loads only once on mount even when translation function identity changes', async () => {
    const tCalls = { count: 0 };
    useAppTranslationMock.mockImplementation(() => ({
      t: (key: string) => `${key}-${++tCalls.count}`,
    }));
    activeMock.mockResolvedValue({
      statusCode: 404,
      message: 'No active battle session',
    });

    const { result } = renderHook(() => useBattleSession());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(activeMock).toHaveBeenCalledTimes(1);
  });

  it('does not trigger overlapping loads while a previous load is still in flight', async () => {
    let resolveActive: ((value: typeof activeBattle) => void) | undefined;
    activeMock.mockImplementation(() => new Promise((resolve) => {
      resolveActive = resolve as (value: typeof activeBattle) => void;
    }));
    logsMock.mockResolvedValue([]);

    const { result } = renderHook(() => useBattleSession());

    await act(async () => {
      await result.current.load();
    });

    expect(activeMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveActive?.(activeBattle);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
