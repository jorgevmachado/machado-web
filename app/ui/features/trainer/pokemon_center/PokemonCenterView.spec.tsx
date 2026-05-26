import { fireEvent, render, screen } from '@testing-library/react';

import PokemonCenterView from './PokemonCenterView';

const showAlertMock = jest.fn();
const healMock = jest.fn();

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

jest.mock('@/app/ui/features/trainer/pokemon_center/usePokemonCenter', () => ({
  usePokemonCenter: jest.fn(),
}));

const { usePokemonCenter } = jest.requireMock('@/app/ui/features/trainer/pokemon_center/usePokemonCenter') as {
  usePokemonCenter: jest.Mock;
};

describe('PokemonCenterView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state while data is unavailable', () => {
    usePokemonCenter.mockReturnValue({
      home: undefined,
      history: [],
      isLoading: true,
      isHealing: false,
      errorMessage: undefined,
      lastResult: undefined,
      heal: healMock,
    });

    render(<PokemonCenterView />);

    expect(screen.getByText('pokemonCenter.loading')).toBeInTheDocument();
  });

  it('renders party, history and triggers healing', () => {
    usePokemonCenter.mockReturnValue({
      home: {
        trainer: { id: 'trainer-1' },
        party: [
          {
            id: 'party-1',
            slot: 1,
            my_pokemon: {
              id: 'my-pokemon-1',
              nickname: 'Leaf',
              hp: 12,
              max_hp: 20,
              moves: [{ pp: 8, max_pp: 10 }],
              pokemon: { name: 'bulbasaur' },
            },
          },
        ],
        last_healing: {
          id: 'healing-1',
          healed_pokemon_quantity: 1,
          restored_hp: 8,
          restored_pp: 2,
          created_at: '2026-05-25T00:00:00.000Z',
        },
      },
      history: [
        {
          id: 'history-1',
          action_type: 'REVIVE_AND_HEAL',
          restored_hp: 20,
          restored_pp: 6,
          was_revived: true,
          created_at: '2026-05-25T00:00:00.000Z',
          my_pokemon: {
            id: 'my-pokemon-1',
            name: 'bulbasaur-owned',
            nickname: 'Leaf',
            hp: 20,
            max_hp: 20,
          },
        },
      ],
      isLoading: false,
      isHealing: false,
      errorMessage: 'Healing failed',
      lastResult: {
        success: true,
        restored_pokemon: [
          {
            id: 'history-1',
            restored_hp: 20,
            restored_pp: 6,
            was_revived: true,
            my_pokemon: {
              id: 'my-pokemon-1',
              name: 'bulbasaur-owned',
              nickname: 'Leaf',
              hp: 20,
              max_hp: 20,
            },
          },
        ],
      },
      heal: healMock,
    });

    render(<PokemonCenterView />);

    expect(screen.getByRole('heading', { name: 'pokemonCenter.title' })).toBeInTheDocument();
    expect(screen.getByText('pokemonCenter.latestHealingTitle')).toBeInTheDocument();
    expect(screen.getAllByText('pokemonCenter.revived')).toHaveLength(2);

    fireEvent.click(screen.getByText('pokemonCenter.healButton'));

    expect(healMock).toHaveBeenCalledWith();
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Healing failed' });
  });

  it('renders healing state and nickname fallbacks', () => {
    usePokemonCenter.mockReturnValue({
      home: {
        trainer: { id: 'trainer-1' },
        party: [
          {
            id: 'party-1',
            slot: 1,
            my_pokemon: {
              id: 'my-pokemon-1',
              nickname: '',
              hp: 20,
              max_hp: 20,
              moves: [{ pp: 10, max_pp: 10 }],
              pokemon: { name: 'bulbasaur' },
            },
          },
        ],
        last_healing: null,
      },
      history: [
        {
          id: 'history-1',
          action_type: 'FULL_HEAL',
          restored_hp: 0,
          restored_pp: 0,
          was_revived: false,
          created_at: '2026-05-25T00:00:00.000Z',
          my_pokemon: {
            id: 'my-pokemon-1',
            name: 'bulbasaur-owned',
            nickname: '',
            hp: 20,
            max_hp: 20,
          },
        },
      ],
      isLoading: false,
      isHealing: true,
      errorMessage: undefined,
      lastResult: {
        success: true,
        restored_pokemon: [
          {
            id: 'history-2',
            restored_hp: 0,
            restored_pp: 0,
            was_revived: false,
            my_pokemon: {
              id: 'my-pokemon-1',
              name: 'bulbasaur-owned',
              nickname: '',
              hp: 20,
              max_hp: 20,
            },
          },
        ],
      },
      heal: healMock,
    });

    render(<PokemonCenterView />);

    expect(screen.getByText('pokemonCenter.healing')).toBeInTheDocument();
    expect(screen.getAllByText('Bulbasaur')).toHaveLength(2);
    expect(screen.getAllByText('Bulbasaur Owned').length).toBeGreaterThan(0);
    expect(screen.getByText('FULL_HEAL')).toBeInTheDocument();
    expect(screen.queryByText('pokemonCenter.latestHealingTitle')).not.toBeInTheDocument();
  });

  it('does not render last healing result card when there are no restored entries', () => {
    usePokemonCenter.mockReturnValue({
      home: {
        trainer: { id: 'trainer-1' },
        party: [],
        last_healing: null,
      },
      history: [],
      isLoading: false,
      isHealing: false,
      errorMessage: undefined,
      lastResult: undefined,
      heal: healMock,
    });

    render(<PokemonCenterView />);

    expect(screen.queryByText('pokemonCenter.lastHealingResult')).not.toBeInTheDocument();
    expect(screen.getByText('pokemonCenter.noParty')).toBeInTheDocument();
    expect(screen.getByText('pokemonCenter.noHistory')).toBeInTheDocument();
  });
});
