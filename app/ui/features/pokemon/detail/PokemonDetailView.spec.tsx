import { render, screen } from '@testing-library/react';

import { PokemonDetailView } from './PokemonDetailView';

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, ...props }: { as?: string; children: React.ReactNode }) => {
    return React.createElement(as, props, children);
  };

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Image: ({ alt }: { alt: string }) => <span aria-label={alt} />,
    Text,
  };
});

jest.mock('./usePokemonDetail', () => ({
  usePokemonDetail: () => ({
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
      description: 'Seed Pokemon',
      abilities: [{ id: 'ability-1', name: 'overgrow' }],
      moves: [{ id: 'move-1', name: 'tackle' }],
      encounters: [],
    },
  }),
}));

describe('PokemonDetailView', () => {
  it('renders detail sections for a loaded pokemon', () => {
    render(<PokemonDetailView identifier="bulbasaur" />);

    expect(screen.getByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByText('Seed Pokemon')).toBeInTheDocument();
    expect(screen.getByText('overgrow')).toBeInTheDocument();
    expect(screen.getByText('tackle')).toBeInTheDocument();
    expect(screen.getByText('Weaknesses: fire')).toBeInTheDocument();
  });
});
