import { render, screen } from '@testing-library/react';

import { PokemonDetailView } from './PokemonDetailView';

const usePokemonDetailMock = jest.fn();

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, lineClamp, ...props }: {
    as?: string;
    children: React.ReactNode;
    lineClamp?: number;
  }) => {
    void lineClamp;

    return React.createElement(as, props, children);
  };

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    BarChart: ({ label, value }: { label: string; value: number }) => <div>{label}: {value}</div>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Image: ({ alt }: { alt: string }) => <span aria-label={alt} />,
    Text,
  };
});

jest.mock('./usePokemonDetail', () => ({
  usePokemonDetail: () => usePokemonDetailMock(),
}));

describe('PokemonDetailView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePokemonDetailMock.mockReturnValue({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: '1',
        order: 1,
        name: 'bulbasaur',
        external_image: 'https://example.com/bulbasaur.png',
        status: 'COMPLETE',
        types: [{
          id: 'type-1',
          name: 'grass',
          background_color: '#DCFCE7',
          text_color: '#166534',
          weaknesses: [{ id: 'type-2', name: 'fire' }],
          strengths: [{ id: 'type-3', name: 'water' }],
        }],
        images: {
          front_image: 'https://example.com/bulbasaur-front.png',
          back_image: '',
          images: [],
        },
        hp: 45,
        attack: 49,
        defense: 49,
        special_attack: 65,
        special_defense: 65,
        speed: 45,
        height: 7,
        weight: 69,
        habitat: { id: 'habitat-1', name: 'grassland' },
        shape: { id: 'shape-1', name: 'quadruped' },
        hatch_counter: 20,
        capture_rate: 45,
        base_happiness: 50,
        base_experience: 64,
        is_baby: true,
        is_mythical: true,
        is_legendary: true,
        has_gender_differences: true,
        growth_rate: { id: 'growth-1', name: 'medium-fast' },
        description: 'Seed Pokemon',
        abilities: [{ id: 'ability-1', name: 'overgrow', is_hidden: false }],
        moves: [{
          id: 'move-1',
          name: 'tackle',
          type: 'normal',
          damage_class: 'physical',
          priority: 0,
          power: 40,
          accuracy: 100,
          pp: 35,
          short_effect: 'Inflicts regular damage.',
          effect: 'Inflicts regular damage.',
        }],
        encounters: [{
          id: 'b0d43225-73f4-4c39-8ad9-9300bbd97a46',
          url: 'https://pokeapi.co/api/v2/location-area/281/',
          name: 'cerulean-city-area',
          order: 281,
          chance: 100,
          method: 'gift',
          version: 'yellow',
          min_level: 10,
          max_level: 10,
          condition: '',
          max_chance: 100,
          created_at: '2026-05-07T15:03:35.795702Z',
          updated_at: null,
          deleted_at: null
        }],
        evolutions: [],
      },
    });
  });

  it('renders detail sections for a loaded pokemon', () => {
    render(<PokemonDetailView identifier='bulbasaur' />);

    expect(screen.getByRole('heading', { level: 1, name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overgrow' })).toHaveAttribute('href', '/pokemon/ability/overgrow');
    expect(screen.getByRole('heading', { name: 'Tackle' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Fire' })).toHaveAttribute('href', '/pokemon/type/fire');
    expect(screen.getByRole('link', { name: 'Medium Fast' })).toHaveAttribute('href', '/pokemon/growth-rate/medium-fast');
    expect(screen.getByText('Is Baby')).toBeInTheDocument();
    expect(screen.getAllByText('Yes')).toHaveLength(4);
  });

  it('renders loading, explicit error, and default not found states', () => {
    usePokemonDetailMock.mockReturnValueOnce({ isLoading: true, data: undefined, errorMessage: undefined });
    const { rerender } = render(<PokemonDetailView identifier='bulbasaur' />);

    expect(screen.getByText('Loading Pokemon...')).toBeInTheDocument();

    usePokemonDetailMock.mockReturnValueOnce({ isLoading: false, data: undefined, errorMessage: 'Pokemon failed.' });
    rerender(<PokemonDetailView identifier='bulbasaur' />);

    expect(screen.getByText('Pokemon failed.')).toBeInTheDocument();

    usePokemonDetailMock.mockReturnValueOnce({ isLoading: false, data: undefined, errorMessage: undefined });
    rerender(<PokemonDetailView identifier='missing' />);

    expect(screen.getByText('Pokemon not found.')).toBeInTheDocument();
  });

  it('renders fallback values for optional pokemon attributes', () => {
    usePokemonDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: '2',
        order: 2,
        name: 'ivysaur',
        external_image: '',
        status: 'INCOMPLETE',
        types: [{
          id: 'type-1',
          name: 'grass',
          background_color: '',
          text_color: '',
          weaknesses: undefined,
          strengths: undefined,
        }],
        images: null,
        hp: null,
        attack: null,
        defense: null,
        special_attack: null,
        special_defense: null,
        speed: null,
        height: null,
        weight: undefined,
        habitat: null,
        shape: null,
        hatch_counter: null,
        capture_rate: null,
        base_happiness: null,
        base_experience: null,
        is_baby: false,
        is_mythical: false,
        is_legendary: false,
        has_gender_differences: false,
        growth_rate: null,
        description: '',
        abilities: [{ id: 'ability-2', name: 'chlorophyll', is_hidden: true }],
        moves: [],
        encounters: [],
        evolutions: [],
      },
    });

    render(<PokemonDetailView identifier='ivysaur' />);

    expect(screen.getByRole('heading', { level: 1, name: 'ivysaur' })).toBeInTheDocument();
    expect(screen.getAllByText('Unknown')).toHaveLength(10);
    expect(screen.getAllByText('No')).toHaveLength(4);
    expect(screen.getByText('HP: 0')).toBeInTheDocument();
  });
});
