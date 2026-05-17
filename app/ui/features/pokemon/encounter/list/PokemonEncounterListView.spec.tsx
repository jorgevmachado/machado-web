import { fireEvent, render, screen } from '@testing-library/react';

import { PokemonEncounterListView } from './PokemonEncounterListView';

const showAlertMock = jest.fn();
const paginatedListMock = jest.fn();

jest.mock('@/app/ui/hooks/list/usePaginatedList', () => ({
  __esModule: true,
  default: (...args: unknown[]) => paginatedListMock(...args),
}));

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, ...props }: { as?: string; children: React.ReactNode }) => React.createElement(as, props, children);

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Filters: ({ onApply, onClear }: { onApply: (filters: unknown) => void; onClear: () => void }) => (
      <div aria-label="filters">
        <button type="button" onClick={() => onApply({ name: 'medium' })}>Apply filters</button>
        <button type="button" onClick={onClear}>Clear filters</button>
      </div>
    ),
    Pagination: () => <nav aria-label="pagination" />,
    Text,
    useAlert: () => ({ showAlert: showAlertMock }),
  };
});

const defaultHookValue = {
  items: [{
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
  meta: { total: 1, current_page: 1, total_pages: 1 },
  isLoading: false,
  errorMessage: undefined,
  inputFilters: [],
  goToPage: jest.fn(),
  applyInputFilters: jest.fn(),
  clearInputFilters: jest.fn(),
};

describe('PokemonEncounterListView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    paginatedListMock.mockReturnValue(defaultHookValue);
  });

  it('renders encounters cards prioritizing name', () => {
    render(<PokemonEncounterListView />);

    expect(screen.getByRole('heading', { name: 'Pokemon Encounters' })).toBeInTheDocument();
    expect(screen.getByText('Cerulean City Area')).toBeInTheDocument();
  });

  it('renders empty and alert-only error states', () => {
    paginatedListMock.mockReturnValue({
      ...defaultHookValue,
      items: [],
      errorMessage: 'Could not load Pokemon encounters.',
    });

    render(<PokemonEncounterListView />);

    expect(screen.getByText('No Pokemon encounter found.')).toBeInTheDocument();
    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'Could not load Pokemon encounters.',
    });
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('renders fallback copy and forwards filter actions', () => {
    paginatedListMock.mockReturnValue({
      ...defaultHookValue,
      items: [{
        ...defaultHookValue.items[0],
        method: '',
      }],
    });

    render(<PokemonEncounterListView />);
    const method =  screen.getByTestId('pokemon-encounter-list-method');
    expect(method).toBeInTheDocument();
    expect(method).toHaveTextContent('Method: Encounter pending.');

    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(defaultHookValue.applyInputFilters).toHaveBeenCalledWith({ name: 'medium' });
    expect(defaultHookValue.clearInputFilters).toHaveBeenCalledTimes(1);
  });

  it('configures direct list normalization for the shared hook', () => {
    render(<PokemonEncounterListView />);

    const config = paginatedListMock.mock.calls[0][0] as {
      normalizeFilters: (filters: { name?: string; order?: string }) => unknown;
    };

    expect(config.normalizeFilters({ name: ' route-1 ', order: ' 10 ' })).toEqual({
      name: 'route-1',
      order: '10',
    });
    expect(config.normalizeFilters({ name: '', order: '' })).toEqual({
      name: undefined,
      order: undefined,
    });
  });
});
