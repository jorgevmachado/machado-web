import { fireEvent, render, screen } from '@testing-library/react';

import { PokemonGrowthRateListView } from './PokemonGrowthRateListView';

const showAlertMock = jest.fn();
const usePokemonGrowthRateListMock = jest.fn();

jest.mock('./usePokemonGrowthRateList', () => ({
  usePokemonGrowthRateList: () => usePokemonGrowthRateListMock(),
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
    id: 'growth-1',
    name: 'medium',
    order: 1,
    url: 'https://example.com/medium',
    formula: 'x ** 3',
    description: 'Medium growth rate.',
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
    usePokemonGrowthRateListMock.mockReturnValue(defaultHookValue);
  });

  it('renders growth rate cards prioritizing formulas', () => {
    render(<PokemonGrowthRateListView />);

    expect(screen.getByRole('heading', { name: 'Pokemon Growth Rate' })).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('x ** 3')).toBeInTheDocument();
  });

  it('renders empty and alert-only error states', () => {
    usePokemonGrowthRateListMock.mockReturnValue({
      ...defaultHookValue,
      items: [],
      errorMessage: 'Could not load Pokemon growth rates.',
    });

    render(<PokemonGrowthRateListView />);

    expect(screen.getByText('No Pokemon growth rate found.')).toBeInTheDocument();
    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'Could not load Pokemon growth rates.',
    });
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('renders fallback copy and forwards filter actions', () => {
    usePokemonGrowthRateListMock.mockReturnValue({
      ...defaultHookValue,
      items: [{
        ...defaultHookValue.items[0],
        formula: '',
        description: '',
      }],
    });

    render(<PokemonGrowthRateListView />);

    expect(screen.getByText('Formula pending.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(defaultHookValue.applyInputFilters).toHaveBeenCalledWith({ name: 'medium' });
    expect(defaultHookValue.clearInputFilters).toHaveBeenCalledTimes(1);
  });
});
