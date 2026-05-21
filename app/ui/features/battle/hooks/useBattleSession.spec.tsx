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
    jest.useFakeTimers();
    activeMock.mockImplementation(() => new Promise(() => {}));

    renderHook(() => useBattleSession());

    await act(async () => {
      jest.runOnlyPendingTimers();
      jest.advanceTimersByTime(12000);
    });

    expect(activeMock).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
