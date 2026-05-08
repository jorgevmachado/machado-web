import { render, screen, within } from '@testing-library/react';

import { PokemonEncounterDetailView } from './PokemonEncounterDetailView';

const usePokemonEncounterDetailMock = jest.fn();

jest.mock('./usePokemonEncounterDetail', () => ({
  usePokemonEncounterDetail: () => usePokemonEncounterDetailMock(),
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

const defaultMockData = {
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
}

describe('PokemonEncounterDetailView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePokemonEncounterDetailMock.mockReturnValue({
      isLoading: false,
      errorMessage: undefined,
      data: defaultMockData,
    });
  });

  it('renders encounter detail and attributes', () => {
    render(<PokemonEncounterDetailView identifier="cerulean-city-area" />);

    expect(screen.getByRole('heading', { name: 'Cerulean City Area' })).toBeInTheDocument();
    expect(screen.getByText('#281')).toBeInTheDocument();
    expect(screen.getByText('Method')).toBeInTheDocument();
    expect(screen.getByText('Gift')).toBeInTheDocument();
    expect(screen.getByText('Condition')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();

  });

  it('renders encounter detail and attributes with condition and without method', () => {
    usePokemonEncounterDetailMock.mockReturnValueOnce({
      data: {
        ...defaultMockData,
        method: undefined,
        condition: 'Winner',
      },
      isLoading: false,
      errorMessage: undefined
    });
    render(<PokemonEncounterDetailView identifier="cerulean-city-area" />);

    expect(screen.getByRole('heading', { name: 'Cerulean City Area' })).toBeInTheDocument();
    expect(screen.getByText('#281')).toBeInTheDocument();
    expect(screen.getByText('Method')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.getByText('Condition')).toBeInTheDocument();
    expect(screen.getByText('Winner')).toBeInTheDocument();

  });

  it('renders loading and alert-only error states', () => {
    usePokemonEncounterDetailMock.mockReturnValueOnce({ isLoading: true, data: undefined, errorMessage: undefined });
    const { rerender } = render(<PokemonEncounterDetailView identifier="cerulean-city-area" />);

    expect(screen.getByText('Loading Pokemon Encounter...')).toBeInTheDocument();

    usePokemonEncounterDetailMock.mockReturnValueOnce({ isLoading: false, data: undefined, errorMessage: 'encounter failed.' });
    rerender(<PokemonEncounterDetailView identifier="cerulean-city-area" />);

    expect(screen.getByText('encounter failed.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('renders the default not found message when loading finishes without data', () => {
    usePokemonEncounterDetailMock.mockReturnValueOnce({
      isLoading: false,
      data: undefined,
      errorMessage: undefined,
    });

    render(<PokemonEncounterDetailView identifier="missing" />);

    expect(screen.getByText('Pokemon Encounter not found.')).toBeInTheDocument();
  });
});
