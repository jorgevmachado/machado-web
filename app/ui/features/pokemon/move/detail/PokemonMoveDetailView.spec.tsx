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

describe('PokemonMoveDetailView', () => {
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

  it('renders pending copy and empty move metadata fallbacks', () => {
    usePokemonMoveDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'move-2',
        name: 'splash',
        order: 34,
        url: 'https://example.com/splash',
        pp: null,
        type: 'normal',
        power: null,
        target: '',
        effect: '',
        accuracy: null,
        short_effect: '',
        damage_class: '',
        effect_chance: undefined,
        created_at: '2026-01-01',
      },
    });

    render(<PokemonMoveDetailView identifier="splash" />);

    expect(screen.getByText('Short effect pending.')).toBeInTheDocument();
    expect(screen.getByText('Effect pending.')).toBeInTheDocument();
    expect(screen.getAllByText('-')).toHaveLength(6);
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

  it('renders the default not found message when loading finishes without data', () => {
    usePokemonMoveDetailMock.mockReturnValueOnce({
      isLoading: false,
      data: undefined,
      errorMessage: undefined,
    });

    render(<PokemonMoveDetailView identifier="missing" />);

    expect(screen.getByText('Pokemon move not found.')).toBeInTheDocument();
  });
});
