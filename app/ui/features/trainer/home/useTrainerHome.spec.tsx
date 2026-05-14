import { act, renderHook, waitFor } from '@testing-library/react';

import { useTrainerHome } from './useTrainerHome';

const startContentLoadingMock = jest.fn();
const stopContentLoadingMock = jest.fn();

jest.mock('@/app/ds', () => ({
  useLoading: () => ({
    startContentLoading: startContentLoadingMock,
    stopContentLoading: stopContentLoadingMock,
  }),
}));

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string) => key,
  }),
}));

function jsonResponse(body: unknown, ok = true) {
  return {
    ok,
    json: async () => body,
  };
}

function fetchByUrl(
  handlers: Record<string, ReturnType<typeof jsonResponse> | ((init?: RequestInit) => ReturnType<typeof jsonResponse>)>,
) {
  return jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const handler = handlers[url];

    if (!handler) {
      return undefined;
    }

    return typeof handler === 'function' ? handler(init) : handler;
  });
}

const trainerHome = {
  trainer: {
    id: 'trainer-1',
    user_id: 'user-1',
    pokeballs: 3,
    capture_rate: 75,
    created_at: '2026-05-14T00:00:00.000Z',
  },
  active_encounter: {
    id: 'encounter-1',
    is_active: true,
    created_at: '2026-05-14T00:00:00.000Z',
    pokemon_encounter: {
      id: 'encounter-base-1',
      url: 'https://pokeapi.co/api/v2/pokemon-encounter/1/',
      name: 'route-1',
      order: 1,
      chance: 20,
      method: 'walk',
      version: 'red',
      min_level: 2,
      max_level: 4,
      condition: 'day',
      max_chance: 20,
      created_at: '2026-05-14T00:00:00.000Z',
    },
  },
  party: [
    {
      id: 'party-1',
      slot: 1,
      is_active: true,
      created_at: '2026-05-14T00:00:00.000Z',
      my_pokemon: {
        id: 'my-pokemon-1',
        name: 'leaf-buddy',
        nickname: 'Leaf',
        level: 5,
        experience: 0,
        hp: 20,
        max_hp: 20,
        attack: 10,
        defense: 10,
        special_attack: 10,
        special_defense: 10,
        speed: 10,
        captured_at: '2026-05-14T00:00:00.000Z',
        created_at: '2026-05-14T00:00:00.000Z',
        pokemon: {
          id: 'pokemon-1',
          name: 'bulbasaur',
          order: 1,
          external_image: 'https://example.com/bulbasaur.png',
          types: [],
        },
        trainer: {
          id: 'trainer-1',
          user_id: 'user-1',
          pokeballs: 3,
          capture_rate: 75,
        },
        moves: [],
      },
    },
  ],
  latest_discoveries: [],
};

const encounters = [
  trainerHome.active_encounter,
  {
    ...trainerHome.active_encounter,
    id: 'encounter-2',
    is_active: false,
    pokemon_encounter: {
      ...trainerHome.active_encounter.pokemon_encounter,
      id: 'encounter-base-2',
      name: 'route-2',
      order: 2,
    },
  },
];

const roster = {
  items: [
    trainerHome.party[0].my_pokemon,
    {
      ...trainerHome.party[0].my_pokemon,
      id: 'my-pokemon-2',
      nickname: 'Shell',
      pokemon: {
        ...trainerHome.party[0].my_pokemon.pokemon,
        id: 'pokemon-2',
        name: 'squirtle',
        order: 7,
      },
    },
  ],
};

describe('useTrainerHome', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads home, encounters, and roster data on mount', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(startContentLoadingMock).toHaveBeenCalledWith();
    expect(stopContentLoadingMock).toHaveBeenCalledWith();
    expect(result.current.data?.trainer.id).toBe('trainer-1');
    expect(result.current.encounters).toHaveLength(2);
    expect(result.current.partySelection).toEqual(['my-pokemon-1']);
    expect(result.current.activeEncounter?.id).toBe('encounter-1');
  });

  it('falls back to the active encounter from the encounters list when home has no active encounter', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse({
        ...trainerHome,
        active_encounter: undefined,
      }),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.activeEncounter?.id).toBe('encounter-1');
  });

  it('supports manual reloads through the returned load function', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.load();
    });

    expect(startContentLoadingMock).toHaveBeenCalled();
    expect(stopContentLoadingMock).toHaveBeenCalled();
  });

  it('updates the active encounter after selection', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/encounters/active': jsonResponse({
        ...encounters[1],
        is_active: true,
      }),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.selectEncounter('encounter-2');
    });

    await waitFor(() => {
      expect(result.current.activeEncounter?.id).toBe('encounter-2');
    });

    expect(result.current.encounters.find((item) => item.id === 'encounter-1')?.is_active).toBe(false);
    expect(result.current.encounters.find((item) => item.id === 'encounter-2')?.is_active).toBe(true);
  });

  it('stores the last walk event and updates trainer pokeballs', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/walk': jsonResponse({
        id: 'event-1',
        event_type: 'POKEBALLS',
        created_at: '2026-05-14T00:00:00.000Z',
        pokeballs_found: 2,
        trainer_pokeballs: 5,
      }),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.walk();
    });

    await waitFor(() => {
      expect(result.current.lastEvent?.id).toBe('event-1');
    });

    expect(result.current.data?.trainer.pokeballs).toBe(5);
  });

  it('keeps the current pokeball count when the walk event omits trainer_pokeballs', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/walk': jsonResponse({
        id: 'event-2',
        event_type: 'WILD_POKEMON',
        created_at: '2026-05-14T00:00:00.000Z',
      }),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.walk();
    });

    await waitFor(() => {
      expect(result.current.lastEvent?.id).toBe('event-2');
    });

    expect(result.current.data?.trainer.pokeballs).toBe(3);
  });

  it('saves the selected main party and enforces the max party size in memory', async () => {
    const largeRoster = {
      items: Array.from({ length: 7 }, (_, index) => ({
        ...trainerHome.party[0].my_pokemon,
        id: `my-pokemon-${index + 1}`,
        nickname: `Pokemon ${index + 1}`,
        pokemon: {
          ...trainerHome.party[0].my_pokemon.pokemon,
          id: `pokemon-${index + 1}`,
          name: `pokemon-${index + 1}`,
          order: index + 1,
        },
      })),
    };

    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(largeRoster),
      '/api/trainer/party': jsonResponse([
        {
          ...trainerHome.party[0],
          my_pokemon: largeRoster.items[0],
        },
        {
          ...trainerHome.party[0],
          id: 'party-2',
          slot: 2,
          my_pokemon: largeRoster.items[1],
        },
      ]),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      result.current.togglePartySelection('my-pokemon-2');
      result.current.togglePartySelection('my-pokemon-3');
      result.current.togglePartySelection('my-pokemon-4');
      result.current.togglePartySelection('my-pokemon-5');
      result.current.togglePartySelection('my-pokemon-6');
      result.current.togglePartySelection('my-pokemon-7');
    });

    expect(result.current.partySelection).toHaveLength(6);
    expect(result.current.partySelection).not.toContain('my-pokemon-7');

    await act(async () => {
      await result.current.saveParty();
    });

    await waitFor(() => {
      expect(result.current.data?.party).toHaveLength(2);
    });

    expect(result.current.partySelection).toEqual(['my-pokemon-1', 'my-pokemon-2']);
  });

  it('exposes a load error when the initial payload is invalid', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse({ message: 'broken' }, false),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('broken');
  });

  it('uses translated load fallback when invalid responses have no message', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse({}),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('home.dashboard.loadError');
  });

  it('prefers encounter and roster error messages during load validation', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse({ message: 'encounters failed' }, false),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
    }) as never;

    const encounterError = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(encounterError.result.current.isLoading).toBe(false);
    });

    expect(encounterError.result.current.errorMessage).toBe('encounters failed');
    encounterError.unmount();

    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse({ message: 'roster failed' }, false),
    }) as never;

    const rosterError = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(rosterError.result.current.isLoading).toBe(false);
    });

    expect(rosterError.result.current.errorMessage).toBe('roster failed');
  });

  it('uses the thrown Error message during load failures', async () => {
    global.fetch = jest.fn(async () => {
      throw new Error('load exploded');
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('load exploded');
  });

  it('uses the translated load fallback when fetch throws a non-Error value', async () => {
    global.fetch = jest.fn(async () => {
      throw undefined;
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('home.dashboard.loadError');
  });

  it('stores encounter selection errors from invalid payloads and thrown errors', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/encounters/active': () => jsonResponse({ message: 'cannot select' }, false),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.selectEncounter('encounter-2');
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('cannot select');
    });

    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/encounters/active': () => {
        throw new Error('select exploded');
      },
    }) as never;

    await act(async () => {
      await result.current.selectEncounter('encounter-2');
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('select exploded');
    });
  });

  it('uses the translated selection fallback when the response has no message or throws non-Error', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/encounters/active': jsonResponse({}, false),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.selectEncounter('encounter-2');
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('home.dashboard.encounterSelectError');
    });

    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/encounters/active': () => {
        throw undefined;
      },
    }) as never;

    await act(async () => {
      await result.current.selectEncounter('encounter-2');
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('home.dashboard.encounterSelectError');
    });
  });

  it('stores walk errors from invalid payloads and thrown errors', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/walk': jsonResponse({ message: 'cannot walk' }, false),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.walk();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('cannot walk');
    });

    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/walk': () => {
        throw new Error('walk exploded');
      },
    }) as never;

    await act(async () => {
      await result.current.walk();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('walk exploded');
    });
  });

  it('uses the translated walk fallback when the response has no message or throws non-Error', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/walk': jsonResponse({}, false),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.walk();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('home.dashboard.walkError');
    });

    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/walk': () => {
        throw undefined;
      },
    }) as never;

    await act(async () => {
      await result.current.walk();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('home.dashboard.walkError');
    });
  });

  it('allows removing a pokemon from party selection', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.togglePartySelection('my-pokemon-1');
    });

    expect(result.current.partySelection).toEqual([]);
  });

  it('clears the scheduled initial load on unmount', () => {
    const originalSetTimeout = globalThis.setTimeout;
    const originalClearTimeout = globalThis.clearTimeout;
    const setTimeoutMock = jest.fn(() => 99 as unknown as ReturnType<typeof setTimeout>);
    const clearTimeoutMock = jest.fn();

    globalThis.setTimeout = setTimeoutMock as typeof setTimeout;
    globalThis.clearTimeout = clearTimeoutMock as typeof clearTimeout;

    const { unmount } = renderHook(() => useTrainerHome());

    expect(setTimeoutMock).toHaveBeenCalled();

    unmount();

    expect(clearTimeoutMock).toHaveBeenCalledWith(99);

    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
  });

  it('stores party-save errors from invalid payloads and thrown errors', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/party': jsonResponse({ message: 'cannot save' }, false),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.saveParty();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('cannot save');
    });

    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/party': () => {
        throw new Error('save exploded');
      },
    }) as never;

    await act(async () => {
      await result.current.saveParty();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('save exploded');
    });
  });

  it('uses the translated party-save fallback when the response has no message or throws non-Error', async () => {
    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/party': jsonResponse({}, false),
    }) as never;

    const { result } = renderHook(() => useTrainerHome());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.saveParty();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('home.dashboard.partySaveError');
    });

    global.fetch = fetchByUrl({
      '/api/trainer/home': jsonResponse(trainerHome),
      '/api/trainer/encounters': jsonResponse(encounters),
      '/api/my-pokemon?page=1&limit=100': jsonResponse(roster),
      '/api/trainer/party': () => {
        throw undefined;
      },
    }) as never;

    await act(async () => {
      await result.current.saveParty();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('home.dashboard.partySaveError');
    });
  });
});
