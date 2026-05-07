import { render, screen } from '@testing-library/react';

import { PokemonMoveDetailView } from './PokemonMoveDetailView';

const usePokemonMoveDetailMock = jest.fn();

jest.mock('./usePokemonMoveDetail', () => ({
  usePokemonMoveDetail: () => usePokemonMoveDetailMock(),
}));

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, ...props }: { as?: string; children: React.ReactNode }) => React.createElement(as, props, children);

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Text,
  };
});

describe('PokemonGrowthRateDetailView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePokemonMoveDetailMock.mockReturnValue({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'move-1',
        name: 'tackle',
        order: 33,
        url: 'https://example.com/tackle',
        pp: 35,
        type: 'normal',
        power: 40,
        target: 'selected-pokemon',
        effect: 'Inflicts regular damage.',
        accuracy: 100,
        short_effect: 'Inflicts regular damage.',
        damage_class: 'physical',
        effect_chance: null,
        created_at: '2026-01-01',
      },
    });
  });

  it('renders move detail with type as non-link metadata', () => {
    render(<PokemonMoveDetailView identifier="tackle" />);

    expect(screen.getByRole('heading', { name: 'tackle' })).toBeInTheDocument();
    expect(screen.getAllByText('normal')[0]).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'normal' })).not.toBeInTheDocument();
    expect(screen.getAllByText('Inflicts regular damage.')).toHaveLength(2);
  });

  it('renders loading and alert-only error states', () => {
    usePokemonMoveDetailMock.mockReturnValueOnce({ isLoading: true, data: undefined, errorMessage: undefined });
    const { rerender } = render(<PokemonMoveDetailView identifier="tackle" />);

    expect(screen.getByText('Loading Pokemon move...')).toBeInTheDocument();

    usePokemonMoveDetailMock.mockReturnValueOnce({ isLoading: false, data: undefined, errorMessage: 'Move failed.' });
    rerender(<PokemonMoveDetailView identifier="tackle" />);

    expect(screen.getByText('Move failed.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });
});
