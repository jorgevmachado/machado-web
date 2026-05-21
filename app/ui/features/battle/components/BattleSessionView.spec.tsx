import { fireEvent, render, screen } from '@testing-library/react';

import { BattleSessionView } from './BattleSessionView';

const showAlertMock = jest.fn();
const replaceMock = jest.fn();
const loadMock = jest.fn();
const useMoveMock = jest.fn();
const switchPokemonMock = jest.fn();
const fleeMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

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
        status: 'FLED',
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
    expect(replaceMock).toHaveBeenCalledWith('/home');
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'battle over' });
  });
});
