import { act, fireEvent, render, screen } from '@testing-library/react';

import TrainerDashboard from './TrainerDashboard';

const showAlertMock = jest.fn();
const openModalMock = jest.fn();
const closeModalMock = jest.fn();
const selectEncounterMock = jest.fn();
const walkMock = jest.fn();
const togglePartySelectionMock = jest.fn();
const savePartyMock = jest.fn();
const loadMock = jest.fn();

jest.mock('@/app/ds', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type='button' onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Text: ({
    as: Component = 'p',
    children,
  }: {
    as?: 'h1' | 'h2' | 'h3' | 'p';
    children: React.ReactNode;
  }) => <Component>{children}</Component>,
  useAlert: () => ({ showAlert: showAlertMock }),
  useModal: () => ({
    modal: <div data-testid='battle-modal' />,
    openModal: openModalMock,
    closeModal: closeModalMock,
  }),
}));

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string, values?: Record<string, string | number>) => {
      if (!values) {
        return key;
      }
      return `${key}:${JSON.stringify(values)}`;
    },
  }),
}));

jest.mock('@/app/ui/features/trainer/home/useTrainerHome', () => ({
  useTrainerHome: jest.fn(),
}));

const { useTrainerHome } = jest.requireMock('@/app/ui/features/trainer/home/useTrainerHome') as {
  useTrainerHome: jest.Mock;
};

describe('TrainerDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading state while data is unavailable', () => {
    useTrainerHome.mockReturnValue({
      data: undefined,
      encounters: [],
      roster: [],
      partySelection: [],
      lastEvent: undefined,
      isLoading: true,
      isSavingParty: false,
      isWalking: false,
      isUpdatingEncounter: false,
      errorMessage: undefined,
      activeEncounter: undefined,
      selectEncounter: selectEncounterMock,
      walk: walkMock,
      togglePartySelection: togglePartySelectionMock,
      saveParty: savePartyMock,
      load: loadMock,
    });

    render(<TrainerDashboard />);

    expect(screen.getByText('home.dashboard.loading')).toBeInTheDocument();
  });

  it('renders the trainer summary, latest event, discoveries, and delegates interactions', () => {
    useTrainerHome.mockReturnValue({
      data: {
        trainer: {
          id: 'trainer-1',
          pokeballs: 5,
          capture_rate: 75,
        },
        active_encounter: {
          id: 'encounter-1',
          is_active: true,
          pokemon_encounter: {
            id: 'pokemon-encounter-1',
            name: 'route-1',
            method: 'walk',
          },
        },
        party: [
          {
            id: 'party-1',
            slot: 1,
            my_pokemon: {
              id: 'my-pokemon-1',
              nickname: 'Leaf',
              pokemon: { name: 'bulbasaur' },
            },
          },
        ],
        latest_discoveries: [
          {
            id: 'pokedex-1',
            discovered_at: '2026-05-14T00:00:00.000Z',
            pokemon: { name: 'bulbasaur' },
          },
        ],
        last_healing: {
          id: 'healing-1',
          healed_pokemon_quantity: 2,
          restored_hp: 30,
          restored_pp: 12,
          created_at: '2026-05-25T00:00:00.000Z',
        },
        active_battle: {
          battle_session_id: 'battle-1',
          status: 'ACTIVE',
          turn_number: 3,
          wild_pokemon_name: 'pikachu',
          wild_pokemon_level: 5,
          trainer_active_my_pokemon_id: 'my-pokemon-1',
          has_active_battle: true,
        },
      },
      encounters: [
        {
          id: 'encounter-1',
          is_active: true,
          pokemon_encounter: {
            id: 'pokemon-encounter-1',
            name: 'route-1',
            method: 'walk',
          },
        },
      ],
      roster: [
        {
          id: 'my-pokemon-1',
          nickname: 'Leaf',
          pokemon: { name: 'bulbasaur' },
        },
      ],
      partySelection: ['my-pokemon-1'],
      lastEvent: {
        id: 'event-1',
        event_type: 'WILD_POKEMON',
        pokemon: { name: 'pikachu' },
        has_active_battle: true,
        battle_session_id: 'battle-1',
      },
      isLoading: false,
      isSavingParty: false,
      isWalking: false,
      isUpdatingEncounter: false,
      errorMessage: 'Walk failed',
      activeEncounter: {
        id: 'encounter-1',
        pokemon_encounter: {
          id: 'pokemon-encounter-1',
          name: 'route-1',
          method: 'walk',
        },
      },
      selectEncounter: selectEncounterMock,
      walk: walkMock,
      togglePartySelection: togglePartySelectionMock,
      saveParty: savePartyMock,
      load: loadMock,
    });

    render(<TrainerDashboard />);

    expect(screen.getByRole('heading', { name: 'home.dashboard.trainerTitle' })).toBeInTheDocument();
    expect(screen.getByText('home.dashboard.pokeballs:{"value":5}')).toBeInTheDocument();
    expect(screen.getByText('home.dashboard.lastHealingTitle')).toBeInTheDocument();
    expect(screen.getByText('home.dashboard.lastHealingHp:{"value":30}')).toBeInTheDocument();
    expect(screen.getByText('home.dashboard.eventType.WILD_POKEMON')).toBeInTheDocument();
    expect(screen.getByText('home.dashboard.foundPokemon:{"name":"Pikachu"}')).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('Route 1')[1]);
    fireEvent.click(screen.getByText('home.dashboard.walkButton'));
    fireEvent.click(screen.getByText('Leaf'));
    fireEvent.click(screen.getByText('home.dashboard.saveParty'));
    fireEvent.click(screen.getByText('home.dashboard.openBattle'));
    fireEvent.click(screen.getByText('home.dashboard.resumeBattle'));

    expect(selectEncounterMock).toHaveBeenCalledWith('encounter-1');
    expect(walkMock).toHaveBeenCalledWith();
    expect(togglePartySelectionMock).toHaveBeenCalledWith('my-pokemon-1');
    expect(savePartyMock).toHaveBeenCalledWith();
    expect(openModalMock).toHaveBeenCalledTimes(2);
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Walk failed' });
  });

  it('renders empty-state labels and nickname fallback branches', () => {
    useTrainerHome.mockReturnValue({
      data: {
        trainer: {
          id: 'trainer-1',
          pokeballs: 1,
          capture_rate: 50,
        },
        active_encounter: null,
        party: [],
        latest_discoveries: [
          {
            id: 'pokedex-2',
            discovered_at: null,
            pokemon: { name: 'eevee' },
          },
        ],
      },
      encounters: [
        {
          id: 'encounter-2',
          is_active: false,
          pokemon_encounter: {
            id: 'pokemon-encounter-2',
            name: 'route-2',
            method: 'surf',
          },
        },
      ],
      roster: [
        {
          id: 'my-pokemon-2',
          nickname: '',
          pokemon: { name: 'squirtle' },
        },
      ],
      partySelection: [],
      lastEvent: {
        id: 'event-2',
        event_type: 'POKEBALLS',
        pokeballs_found: 2,
      },
      isLoading: false,
      isSavingParty: true,
      isWalking: true,
      isUpdatingEncounter: true,
      errorMessage: undefined,
      activeEncounter: undefined,
      selectEncounter: selectEncounterMock,
      walk: walkMock,
      togglePartySelection: togglePartySelectionMock,
      saveParty: savePartyMock,
      load: loadMock,
    });

    render(<TrainerDashboard />);

    expect(screen.getByText('home.dashboard.noActiveEncounter')).toBeInTheDocument();
    expect(screen.getByText('home.dashboard.noDiscoveryDate')).toBeInTheDocument();
    expect(screen.getAllByText('Squirtle')).toHaveLength(2);
    expect(screen.getByText('home.dashboard.foundPokeballs:{"value":2}')).toBeInTheDocument();
    expect(screen.getByText('home.dashboard.walking')).toBeInTheDocument();
    expect(screen.getByText('home.dashboard.savingParty')).toBeInTheDocument();
  });

  it('hides the last-event card and renders the discoveries empty state when applicable', () => {
    useTrainerHome.mockReturnValue({
      data: {
        trainer: {
          id: 'trainer-1',
          pokeballs: 1,
          capture_rate: 50,
        },
        active_encounter: {
          id: 'encounter-3',
          is_active: false,
          pokemon_encounter: {
            id: 'pokemon-encounter-3',
            name: 'route-3',
            method: 'old-rod',
          },
        },
        party: [],
        latest_discoveries: [],
      },
      encounters: [],
      roster: [],
      partySelection: [],
      lastEvent: undefined,
      isLoading: false,
      isSavingParty: false,
      isWalking: false,
      isUpdatingEncounter: false,
      errorMessage: undefined,
      activeEncounter: {
        id: 'encounter-3',
        pokemon_encounter: {
          id: 'pokemon-encounter-3',
          name: 'route-3',
          method: 'old-rod',
        },
      },
      selectEncounter: selectEncounterMock,
      walk: walkMock,
      togglePartySelection: togglePartySelectionMock,
      saveParty: savePartyMock,
      load: loadMock,
    });

    render(<TrainerDashboard />);

    expect(screen.queryByText('home.dashboard.lastEvent')).not.toBeInTheDocument();
    expect(screen.getByText('home.dashboard.noDiscoveries')).toBeInTheDocument();
  });

  it('opens the battle modal only when walk returns an active battle and closes it through the modal body callback', async () => {
    walkMock.mockResolvedValueOnce(undefined).mockResolvedValueOnce({
      has_active_battle: true,
      battle_session_id: 'battle-1',
    });

    useTrainerHome.mockReturnValue({
      data: {
        trainer: {
          id: 'trainer-1',
          pokeballs: 1,
          capture_rate: 50,
        },
        active_encounter: {
          id: 'encounter-1',
          is_active: true,
          pokemon_encounter: {
            id: 'pokemon-encounter-1',
            name: 'route-1',
            method: 'walk',
          },
        },
        party: [],
        latest_discoveries: [],
      },
      encounters: [],
      roster: [],
      partySelection: [],
      lastEvent: undefined,
      isLoading: false,
      isSavingParty: false,
      isWalking: false,
      isUpdatingEncounter: false,
      errorMessage: undefined,
      activeEncounter: {
        id: 'encounter-1',
        pokemon_encounter: {
          id: 'pokemon-encounter-1',
          name: 'route-1',
          method: 'walk',
        },
      },
      selectEncounter: selectEncounterMock,
      walk: walkMock,
      togglePartySelection: togglePartySelectionMock,
      saveParty: savePartyMock,
      load: loadMock,
    });

    render(<TrainerDashboard />);

    await act(async () => {
      fireEvent.click(screen.getByText('home.dashboard.walkButton'));
    });
    expect(openModalMock).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(screen.getByText('home.dashboard.walkButton'));
    });

    expect(openModalMock).toHaveBeenCalledTimes(1);

    const modalConfig = openModalMock.mock.calls[0][0] as {
      body: { props: { onClose: () => Promise<void> } };
    };

    await act(async () => {
      await modalConfig.body.props.onClose();
    });

    expect(closeModalMock).toHaveBeenCalled();
    expect(loadMock).toHaveBeenCalled();
  });
});
