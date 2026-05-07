import { render, screen } from '@testing-library/react';

import { PokemonGrowthRateListView } from './PokemonGrowthRateListView';

const showAlertMock = jest.fn();
const usePokemonMoveListMock = jest.fn();

jest.mock('./usePokemonGrowthRateList', () => ({
  usePokemonMoveList: () => usePokemonMoveListMock(),
}));

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, ...props }: { as?: string; children: React.ReactNode }) => React.createElement(as, props, children);

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Filters: () => <div aria-label="filters" />,
    Pagination: () => <nav aria-label="pagination" />,
    Text,
    useAlert: () => ({ showAlert: showAlertMock }),
  };
});

const defaultHookValue = {
  items: [{
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
    created_at: '2026-01-01',
  }],
  meta: { total: 1, current_page: 1, total_pages: 1 },
  isLoading: false,
  errorMessage: undefined,
  inputFilters: [],
  goToPage: jest.fn(),
  applyInputFilters: jest.fn(),
  clearInputFilters: jest.fn(),
};

describe('PokemonGrowthRateListView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePokemonMoveListMock.mockReturnValue(defaultHookValue);
  });

  it('renders move cards prioritizing effects', () => {
    render(<PokemonGrowthRateListView />);

    expect(screen.getByRole('heading', { name: 'Pokemon Moves' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'tackle' })).toBeInTheDocument();
    expect(screen.getByText('Inflicts regular damage.')).toBeInTheDocument();
  });

  it('renders empty and alert-only error states', () => {
    usePokemonMoveListMock.mockReturnValue({ ...defaultHookValue, items: [], errorMessage: 'Could not load Pokemon moves.' });

    render(<PokemonGrowthRateListView />);

    expect(screen.getByText('No Pokemon moves found.')).toBeInTheDocument();
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Could not load Pokemon moves.' });
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });
});
