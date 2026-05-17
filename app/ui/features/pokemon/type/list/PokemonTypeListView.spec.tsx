import { fireEvent, render, screen } from '@testing-library/react';

import { PokemonTypeListView } from './PokemonTypeListView';

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
        <button type="button" onClick={() => onApply({ name: 'fire' })}>Apply filters</button>
        <button type="button" onClick={onClear}>Clear filters</button>
      </div>
    ),
    Image: ({ alt }: { alt: string }) => <span aria-label={alt} />,
    Pagination: () => <nav aria-label="pagination" />,
    Text,
    useAlert: () => ({ showAlert: showAlertMock }),
  };
});

const defaultHookValue = {
  items: [{
    id: 'type-1',
    name: 'fire',
    order: 10,
    url: 'https://example.com/fire',
    text_color: '#fff',
    background_color: '#f00',
    badge_url: 'https://example.com/fire.png',
    strengths: [],
    weaknesses: [],
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

describe('PokemonTypeListView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    paginatedListMock.mockReturnValue(defaultHookValue);
  });

  it('renders type cards with badge image', () => {
    render(<PokemonTypeListView />);

    expect(screen.getByRole('heading', { name: 'Pokemon Types' })).toBeInTheDocument();
    expect(screen.getByLabelText('Fire badge')).toBeInTheDocument();
    expect(screen.getByText('1 record')).toBeInTheDocument();
  });

  it('renders existing empty pattern for no results', () => {
    paginatedListMock.mockReturnValue({ ...defaultHookValue, items: [], meta: { total: 0, current_page: 1, total_pages: 0 } });

    render(<PokemonTypeListView />);

    expect(screen.getByText('No Pokemon types found.')).toBeInTheDocument();
  });

  it('renders fallback description and keeps empty state hidden while loading', () => {
    paginatedListMock.mockReturnValue({
      ...defaultHookValue,
      isLoading: true,
      items: [{
        ...defaultHookValue.items[0],
        badge_url: '',
        background_color: '',
        text_color: '',
        description: undefined,
      }],
    });

    render(<PokemonTypeListView />);

    expect(screen.getByRole('heading', { name: 'Fire' })).toBeInTheDocument();
    expect(screen.getByText('Explore damage relations and visual identity for this type.')).toBeInTheDocument();
    expect(screen.queryByText('No Pokemon types found.')).not.toBeInTheDocument();
  });

  it('forwards filter actions to the list hook', () => {
    render(<PokemonTypeListView />);

    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(defaultHookValue.applyInputFilters).toHaveBeenCalledWith({ name: 'fire' });
    expect(defaultHookValue.clearInputFilters).toHaveBeenCalledTimes(1);
  });

  it('shows alert for errors only', () => {
    paginatedListMock.mockReturnValue({ ...defaultHookValue, errorMessage: 'Could not load Pokemon types.' });

    render(<PokemonTypeListView />);

    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Could not load Pokemon types.' });
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('configures direct list normalization for the shared hook', () => {
    render(<PokemonTypeListView />);

    const config = paginatedListMock.mock.calls[0][0] as {
      normalizeFilters: (filters: { name?: string; order?: string }) => unknown;
    };

    expect(config.normalizeFilters({ name: ' fire ', order: ' 10 ' })).toEqual({
      name: 'fire',
      order: '10',
    });
    expect(config.normalizeFilters({ name: '', order: '' })).toEqual({
      name: undefined,
      order: undefined,
    });
  });
});
