import { fireEvent, render, screen } from '@testing-library/react';

import { BattleSessionView } from './BattleSessionView';

const showAlertMock = jest.fn();
const loadMock = jest.fn();
const useMoveMock = jest.fn();
const switchPokemonMock = jest.fn();
const fleeMock = jest.fn();

jest.mock('@/app/ds', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type='button' disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Text: ({
    as: Component = 'p',
    children,
  }: {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small';
    children: React.ReactNode;
  }) => <Component>{children}</Component>,
  useAlert: () => ({ showAlert: showAlertMock }),
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

jest.mock('../hooks/useBattleSession', () => ({
  useBattleSession: jest.fn(),
}));

const { useBattleSession } = jest.requireMock('../hooks/useBattleSession') as {
  useBattleSession: jest.Mock;
};

describe('BattleSessionView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the empty state and allows retry', () => {
    useBattleSession.mockReturnValue({
      data: undefined,
      logs: [],
      isLoading: false,
      isActing: false,
      errorMessage: undefined,
      isTerminal: false,
      load: loadMock,
      useMove: useMoveMock,
      switchPokemon: switchPokemonMock,
      flee: fleeMock,
    });

    render(<BattleSessionView />);

    expect(screen.getByText('trainer.battle.empty')).toBeInTheDocument();
    fireEvent.click(screen.getByText('trainer.battle.retry'));
    expect(loadMock).toHaveBeenCalledWith();
  });

  it('renders modal empty state close action and loading state', () => {
    const onCloseMock = jest.fn();
    useBattleSession.mockReturnValueOnce({
      data: undefined,
      logs: [],
      isLoading: true,
      isActing: false,
      errorMessage: undefined,
      isTerminal: false,
      load: loadMock,
      useMove: useMoveMock,
      switchPokemon: switchPokemonMock,
      flee: fleeMock,
    });

    const { rerender } = render(<BattleSessionView variant='modal' onClose={onCloseMock} />);

    expect(screen.getByText('trainer.battle.loading')).toBeInTheDocument();

    useBattleSession.mockReturnValueOnce({
      data: undefined,
      logs: [],
      isLoading: false,
      isActing: false,
      errorMessage: undefined,
      isTerminal: false,
      load: loadMock,
      useMove: useMoveMock,
      switchPokemon: switchPokemonMock,
      flee: fleeMock,
    });

    rerender(<BattleSessionView variant='modal' onClose={onCloseMock} />);
    fireEvent.click(screen.getByText('trainer.battle.close'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('renders active battle details, logs and action handlers', () => {
    useBattleSession.mockReturnValue({
      data: {
        id: 'battle-1',
        trainer_id: 'trainer-1',
        exploration_event_id: 'event-1',
        trainer_active_my_pokemon_id: 'my-pokemon-1',
        wild_pokemon_id: 'pokemon-25',
        wild_pokemon_name: 'pikachu',
        wild_pokemon_level: 5,
        turn_number: 2,
        status: 'ACTIVE',
        trainer_side: {
          my_pokemon_id: 'my-pokemon-1',
          name: 'bulbasaur-owned',
          nickname: '',
          level: 7,
          current_hp: 10,
          max_hp: 0,
          attack: 12,
          defense: 10,
          special_attack: 11,
          special_defense: 10,
          speed: 10,
          moves: [{ id: 'move-1', name: 'tackle', type: 'normal', power: 8, accuracy: 100, pp: 3, max_pp: 10 }],
        },
        wild_side: {
          pokemon_id: 'pokemon-25',
          name: 'pikachu',
          level: 5,
          current_hp: 5,
          max_hp: 0,
          attack: 11,
          defense: 8,
          special_attack: 10,
          special_defense: 8,
          speed: 11,
          moves: [],
        },
        party: [
          {
            my_pokemon_id: 'my-pokemon-1',
            name: 'bulbasaur-owned',
            nickname: 'Leaf',
            level: 7,
            current_hp: 10,
            max_hp: 20,
            attack: 12,
            defense: 10,
            special_attack: 11,
            special_defense: 10,
            speed: 10,
            moves: [],
          },
          {
            my_pokemon_id: null,
            name: 'egg',
            nickname: 'Egg',
            level: 1,
            current_hp: 5,
            max_hp: 5,
            attack: 1,
            defense: 1,
            special_attack: 1,
            special_defense: 1,
            speed: 1,
            moves: [],
          },
          {
            my_pokemon_id: 'my-pokemon-2',
            name: 'ivysaur-owned',
            nickname: 'Bud',
            level: 6,
            current_hp: 16,
            max_hp: 22,
            attack: 11,
            defense: 11,
            special_attack: 11,
            special_defense: 11,
            speed: 9,
            moves: [],
          },
        ],
        created_at: '2026-05-20T00:00:00Z',
      },
      logs: [
        {
          id: 'log-1',
          log_type: 'SESSION_STARTED',
          message: 'battle started',
          payload: {},
          created_at: '2026-05-20T00:00:00Z',
        },
      ],
      isLoading: false,
      isActing: false,
      errorMessage: undefined,
      isTerminal: false,
      load: loadMock,
      useMove: useMoveMock,
      switchPokemon: switchPokemonMock,
      flee: fleeMock,
    });

    render(<BattleSessionView />);

    fireEvent.click(screen.getByRole('button', { name: /Tackle/ }));
    fireEvent.click(screen.getByRole('button', { name: /Bud/ }));
    fireEvent.click(screen.getByRole('button', { name: 'trainer.battle.flee' }));
    fireEvent.click(screen.getByRole('button', { name: 'trainer.battle.refresh' }));

    expect(useMoveMock).toHaveBeenCalledWith('move-1');
    expect(switchPokemonMock).toHaveBeenCalledWith('my-pokemon-2');
    expect(fleeMock).toHaveBeenCalled();
    expect(loadMock).toHaveBeenCalledWith({ silent: true });
    expect(screen.getByText('battle started')).toBeInTheDocument();
  });

  it('falls back to formatted switch target name when nickname is empty', () => {
    useBattleSession.mockReturnValue({
      data: {
        id: 'battle-1',
        trainer_id: 'trainer-1',
        exploration_event_id: 'event-1',
        trainer_active_my_pokemon_id: 'my-pokemon-1',
        wild_pokemon_id: 'pokemon-25',
        wild_pokemon_name: 'pikachu',
        wild_pokemon_level: 5,
        turn_number: 2,
        status: 'ACTIVE',
        trainer_side: {
          my_pokemon_id: 'my-pokemon-1',
          name: 'bulbasaur-owned',
          nickname: 'Leaf',
          level: 7,
          current_hp: 10,
          max_hp: 20,
          attack: 12,
          defense: 10,
          special_attack: 11,
          special_defense: 10,
          speed: 10,
          moves: [],
        },
        wild_side: {
          pokemon_id: 'pokemon-25',
          name: 'pikachu',
          level: 5,
          current_hp: 5,
          max_hp: 18,
          attack: 11,
          defense: 8,
          special_attack: 10,
          special_defense: 8,
          speed: 11,
          moves: [],
        },
        party: [
          {
            my_pokemon_id: 'my-pokemon-2',
            name: 'mr-mime-owned',
            nickname: '',
            level: 6,
            current_hp: 16,
            max_hp: 22,
            attack: 11,
            defense: 11,
            special_attack: 11,
            special_defense: 11,
            speed: 9,
            moves: [],
          },
        ],
        created_at: '2026-05-20T00:00:00Z',
      },
      logs: [],
      isLoading: false,
      isActing: false,
      errorMessage: undefined,
      isTerminal: false,
      load: loadMock,
      useMove: useMoveMock,
      switchPokemon: switchPokemonMock,
      flee: fleeMock,
    });

    render(<BattleSessionView />);

    fireEvent.click(screen.getByRole('button', { name: /Mr Mime Owned/i }));
    expect(switchPokemonMock).toHaveBeenCalledWith('my-pokemon-2');
  });

  it('does not switch when a rendered target becomes invalid before click', () => {
    const mutablePartyMember = {
      my_pokemon_id: 'my-pokemon-2' as string | null,
      name: 'ivysaur-owned',
      nickname: 'Bud',
      level: 6,
      current_hp: 16,
      max_hp: 22,
      attack: 11,
      defense: 11,
      special_attack: 11,
      special_defense: 11,
      speed: 9,
      moves: [],
    };

    useBattleSession.mockReturnValue({
      data: {
        id: 'battle-1',
        trainer_id: 'trainer-1',
        exploration_event_id: 'event-1',
        trainer_active_my_pokemon_id: 'my-pokemon-1',
        wild_pokemon_id: 'pokemon-25',
        wild_pokemon_name: 'pikachu',
        wild_pokemon_level: 5,
        turn_number: 2,
        status: 'ACTIVE',
        trainer_side: {
          my_pokemon_id: 'my-pokemon-1',
          name: 'bulbasaur-owned',
          nickname: 'Leaf',
          level: 7,
          current_hp: 10,
          max_hp: 20,
          attack: 12,
          defense: 10,
          special_attack: 11,
          special_defense: 10,
          speed: 10,
          moves: [],
        },
        wild_side: {
          pokemon_id: 'pokemon-25',
          name: 'pikachu',
          level: 5,
          current_hp: 5,
          max_hp: 18,
          attack: 11,
          defense: 8,
          special_attack: 10,
          special_defense: 8,
          speed: 11,
          moves: [],
        },
        party: [mutablePartyMember],
        created_at: '2026-05-20T00:00:00Z',
      },
      logs: [],
      isLoading: false,
      isActing: false,
      errorMessage: undefined,
      isTerminal: false,
      load: loadMock,
      useMove: useMoveMock,
      switchPokemon: switchPokemonMock,
      flee: fleeMock,
    });

    render(<BattleSessionView />);

    mutablePartyMember.my_pokemon_id = null;
    fireEvent.click(screen.getByRole('button', { name: /Bud/i }));

    expect(switchPokemonMock).not.toHaveBeenCalled();
  });

  it('renders no switch targets when only invalid party members remain', () => {
    useBattleSession.mockReturnValue({
      data: {
        id: 'battle-1',
        trainer_id: 'trainer-1',
        exploration_event_id: 'event-1',
        trainer_active_my_pokemon_id: 'my-pokemon-1',
        wild_pokemon_id: 'pokemon-25',
        wild_pokemon_name: 'pikachu',
        wild_pokemon_level: 5,
        turn_number: 2,
        status: 'ACTIVE',
        trainer_side: {
          my_pokemon_id: 'my-pokemon-1',
          name: 'bulbasaur-owned',
          nickname: 'Leaf',
          level: 7,
          current_hp: 10,
          max_hp: 20,
          attack: 12,
          defense: 10,
          special_attack: 11,
          special_defense: 10,
          speed: 10,
          moves: [],
        },
        wild_side: {
          pokemon_id: 'pokemon-25',
          name: 'pikachu',
          level: 5,
          current_hp: 5,
          max_hp: 18,
          attack: 11,
          defense: 8,
          special_attack: 10,
          special_defense: 8,
          speed: 11,
          moves: [],
        },
        party: [
          {
            my_pokemon_id: 'my-pokemon-1',
            name: 'bulbasaur-owned',
            nickname: 'Leaf',
            level: 7,
            current_hp: 10,
            max_hp: 20,
            attack: 12,
            defense: 10,
            special_attack: 11,
            special_defense: 10,
            speed: 10,
            moves: [],
          },
        ],
        created_at: '2026-05-20T00:00:00Z',
      },
      logs: [],
      isLoading: false,
      isActing: false,
      errorMessage: undefined,
      isTerminal: false,
      load: loadMock,
      useMove: useMoveMock,
      switchPokemon: switchPokemonMock,
      flee: fleeMock,
    });

    render(<BattleSessionView />);

    expect(screen.getByText('trainer.battle.noSwitchTargets')).toBeInTheDocument();
  });

  it('renders terminal modal actions and refreshes silently', () => {
    const onCloseMock = jest.fn();
    useBattleSession.mockReturnValue({
      data: {
        id: 'battle-1',
        trainer_id: 'trainer-1',
        exploration_event_id: 'event-1',
        trainer_active_my_pokemon_id: 'my-pokemon-1',
        wild_pokemon_id: 'pokemon-25',
        wild_pokemon_name: 'pikachu',
        wild_pokemon_level: 5,
        turn_number: 3,
        status: 'WILD_POKEMON_DEFEATED',
        trainer_side: {
          my_pokemon_id: 'my-pokemon-1',
          name: 'bulbasaur-owned',
          nickname: 'Leaf',
          level: 7,
          current_hp: 8,
          max_hp: 20,
          attack: 12,
          defense: 10,
          special_attack: 11,
          special_defense: 10,
          speed: 10,
          moves: [],
        },
        wild_side: {
          pokemon_id: 'pokemon-25',
          name: 'pikachu',
          level: 5,
          current_hp: 0,
          max_hp: 18,
          attack: 11,
          defense: 8,
          special_attack: 10,
          special_defense: 8,
          speed: 11,
          moves: [],
        },
        party: [],
        created_at: '2026-05-20T00:00:00Z',
      },
      logs: [],
      isLoading: false,
      isActing: false,
      errorMessage: undefined,
      isTerminal: true,
      load: loadMock,
      useMove: useMoveMock,
      switchPokemon: switchPokemonMock,
      flee: fleeMock,
    });

    render(<BattleSessionView variant='modal' onClose={onCloseMock} />);

    fireEvent.click(screen.getAllByText('trainer.battle.refresh')[0]);
    fireEvent.click(screen.getByText('trainer.battle.close'));

    expect(loadMock).toHaveBeenCalledWith({ silent: true });
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('disables battle actions when session is terminal', () => {
    useBattleSession.mockReturnValue({
      data: {
        id: 'battle-1',
        trainer_id: 'trainer-1',
        exploration_event_id: 'event-1',
        trainer_active_my_pokemon_id: 'my-pokemon-1',
        wild_pokemon_id: 'pokemon-25',
        wild_pokemon_name: 'pikachu',
        wild_pokemon_level: 5,
        turn_number: 5,
        status: 'ESCAPED',
        trainer_side: {
          my_pokemon_id: 'my-pokemon-1',
          name: 'bulbasaur-owned',
          nickname: 'Leaf',
          level: 7,
          current_hp: 10,
          max_hp: 20,
          attack: 12,
          defense: 10,
          special_attack: 11,
          special_defense: 10,
          speed: 10,
          moves: [{ id: 'move-1', name: 'tackle', type: 'normal', power: 8, accuracy: 100, pp: 0, max_pp: 10 }],
        },
        wild_side: {
          pokemon_id: 'pokemon-25',
          name: 'pikachu',
          level: 5,
          current_hp: 0,
          max_hp: 18,
          attack: 11,
          defense: 8,
          special_attack: 10,
          special_defense: 8,
          speed: 11,
          moves: [],
        },
        party: [
          {
            my_pokemon_id: 'my-pokemon-2',
            name: 'ivysaur-owned',
            nickname: 'Bud',
            level: 6,
            current_hp: 16,
            max_hp: 22,
            attack: 11,
            defense: 11,
            special_attack: 11,
            special_defense: 11,
            speed: 9,
            moves: [],
          },
        ],
        created_at: '2026-05-20T00:00:00Z',
      },
      logs: [],
      isLoading: false,
      isActing: false,
      errorMessage: 'battle over',
      isTerminal: true,
      load: loadMock,
      useMove: useMoveMock,
      switchPokemon: switchPokemonMock,
      flee: fleeMock,
    });

    render(<BattleSessionView />);

    expect(screen.getByText('trainer.battle.finished')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tackle/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Bud/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'trainer.battle.flee' })).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'trainer.battle.refresh' })).toHaveLength(2);
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'battle over' });
  });
});
