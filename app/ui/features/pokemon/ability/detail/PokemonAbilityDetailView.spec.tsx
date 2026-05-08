import { render, screen } from '@testing-library/react';

import { PokemonAbilityDetailView } from './PokemonAbilityDetailView';

const usePokemonAbilityDetailMock = jest.fn();

jest.mock('./usePokemonAbilityDetail', () => ({
  usePokemonAbilityDetail: () => usePokemonAbilityDetailMock(),
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

describe('PokemonAbilityDetailView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePokemonAbilityDetailMock.mockReturnValue({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'ability-1',
        name: 'overgrow',
        order: 65,
        url: 'https://example.com/overgrow',
        slot: 1,
        effect: 'Powers up Grass-type moves when HP is low.',
        short_effect: 'Boosts Grass moves in a pinch.',
        flavor_text: 'Boosts grass moves.',
        is_hidden: false,
        created_at: '2026-01-01',
      },
    });
  });

  it('renders ability detail text sections', () => {
    render(<PokemonAbilityDetailView identifier="overgrow" />);

    expect(screen.getByRole('heading', { name: 'overgrow' })).toBeInTheDocument();
    expect(screen.getByText('Boosts Grass moves in a pinch.')).toBeInTheDocument();
    expect(screen.getByText('Powers up Grass-type moves when HP is low.')).toBeInTheDocument();
    expect(screen.getByText('Boosts grass moves.')).toBeInTheDocument();
  });

  it('renders hidden ability and pending copy fallbacks', () => {
    usePokemonAbilityDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'ability-2',
        name: 'chlorophyll',
        order: 66,
        url: 'https://example.com/chlorophyll',
        slot: 3,
        effect: '',
        short_effect: '',
        flavor_text: '',
        is_hidden: true,
        created_at: '2026-01-01',
      },
    });

    render(<PokemonAbilityDetailView identifier="chlorophyll" />);

    expect(screen.getByText('Hidden')).toBeInTheDocument();
    expect(screen.getByText('Short effect pending.')).toBeInTheDocument();
    expect(screen.getByText('Effect pending.')).toBeInTheDocument();
    expect(screen.getByText('Flavor text pending.')).toBeInTheDocument();
  });

  it('renders loading and alert-only error states', () => {
    usePokemonAbilityDetailMock.mockReturnValueOnce({ isLoading: true, data: undefined, errorMessage: undefined });
    const { rerender } = render(<PokemonAbilityDetailView identifier="overgrow" />);

    expect(screen.getByText('Loading Pokemon ability...')).toBeInTheDocument();

    usePokemonAbilityDetailMock.mockReturnValueOnce({ isLoading: false, data: undefined, errorMessage: 'Ability failed.' });
    rerender(<PokemonAbilityDetailView identifier="overgrow" />);

    expect(screen.getByText('Ability failed.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('renders the default not found message when loading finishes without data', () => {
    usePokemonAbilityDetailMock.mockReturnValueOnce({
      isLoading: false,
      data: undefined,
      errorMessage: undefined,
    });

    render(<PokemonAbilityDetailView identifier="missing" />);

    expect(screen.getByText('Pokemon ability not found.')).toBeInTheDocument();
  });
});
