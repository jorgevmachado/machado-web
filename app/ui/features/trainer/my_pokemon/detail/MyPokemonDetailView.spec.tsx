import { render, screen } from '@testing-library/react';

import { MyPokemonDetailView } from './MyPokemonDetailView';

const useMyPokemonDetailMock = jest.fn();

jest.mock('./useMyPokemonDetail', () => ({
  useMyPokemonDetail: () => useMyPokemonDetailMock(),
}));

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      if (params?.value !== undefined) {
        return `${key}:${params.value}`;
      }
      if (params?.current !== undefined && params?.max !== undefined) {
        return `${key}:${params.current}/${params.max}`;
      }
      if (params?.name !== undefined) {
        return `${key}:${params.name}`;
      }
      return key;
    },
  }),
}));

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, ...props }: { as?: string; children: React.ReactNode }) => {
    return React.createElement(as, props, children);
  };

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    BarChart: ({ label, value }: { label: string; value: number }) => <div>{label}: {value}</div>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Text,
  };
});

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => <a href={href} {...props}>{children}</a>,
}));

describe('MyPokemonDetailView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMyPokemonDetailMock.mockReturnValue({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: '1',
        name: 'bulbasaur-1',
        nickname: 'Bulba',
        level: 1,
        experience: 0,
        hp: 45,
        max_hp: 45,
        attack: 49,
        defense: 49,
        special_attack: 65,
        special_defense: 65,
        speed: 45,
        captured_at: '2026-05-12T00:00:00Z',
        created_at: '2026-05-12T00:00:00Z',
        pokemon: {
          id: 'pokemon-1',
          name: 'bulbasaur',
          order: 1,
          external_image: 'https://example.com/bulbasaur.png',
          types: [{
            id: 'type-1',
            name: 'grass',
            background_color: '',
            text_color: '',
          }],
        },
        trainer: { id: 'trainer-1', user_id: 'user-1', pokeballs: 1, capture_rate: 75 },
        moves: [{
          id: 'move-1',
          pp: 35,
          max_pp: 35,
          pokemon_move_id: 'base-1',
          pokemon_move_name: 'tackle',
          pokemon_move_type: 'normal',
          pokemon_move_power: 40,
          pokemon_move_accuracy: 100,
        }],
      },
    });
  });

  it('renders detail data', () => {
    render(<MyPokemonDetailView name='bulbasaur-1' />);

    expect(screen.getByRole('heading', { name: 'Bulba' })).toBeInTheDocument();
    expect(screen.getByText('myPokemon.detail.publicName:bulbasaur-1')).toBeInTheDocument();
    expect(screen.getByText('pokemon.type.names.grass')).toBeInTheDocument();
    expect(screen.getByText('myPokemon.detail.basePokemon:Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('pokemon.detail.labels.hp: 45')).toBeInTheDocument();
    expect(screen.getByText('myPokemon.detail.moveMeta')).toBeInTheDocument();
    expect(screen.getByText('myPokemon.detail.movePp:35/35')).toBeInTheDocument();
  });

  it('renders loading and not found states', () => {
    useMyPokemonDetailMock.mockReturnValueOnce({
      isLoading: true,
      errorMessage: undefined,
      data: undefined,
    });
    const { rerender } = render(<MyPokemonDetailView name='bulbasaur-1' />);

    expect(screen.getByText('myPokemon.detail.loading')).toBeInTheDocument();

    useMyPokemonDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: 'Missing',
      data: undefined,
    });
    rerender(<MyPokemonDetailView name='missing' />);

    expect(screen.getByText('Missing')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'myPokemon.detail.back' })).toHaveAttribute('href', '/my-pokemon');
  });

  it('falls back to the translated not-found message when no explicit error exists', () => {
    useMyPokemonDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: undefined,
      data: undefined,
    });

    render(<MyPokemonDetailView name='missing' />);

    expect(screen.getByText('myPokemon.detail.notFound')).toBeInTheDocument();
  });
});
