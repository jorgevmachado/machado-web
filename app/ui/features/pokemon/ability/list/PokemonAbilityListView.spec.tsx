import { fireEvent, render, screen } from '@testing-library/react';

import { PokemonAbilityListView } from './PokemonAbilityListView';

const showAlertMock = jest.fn();
const usePokemonAbilityListMock = jest.fn();

jest.mock('./usePokemonAbilityList', () => ({
  usePokemonAbilityList: () => usePokemonAbilityListMock(),
}));

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, ...props }: { as?: string; children: React.ReactNode }) => React.createElement(as, props, children);

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Filters: ({ onApply, onClear }: { onApply: (filters: unknown) => void; onClear: () => void }) => (
      <div aria-label="filters">
        <button type="button" onClick={() => onApply({ name: 'overgrow' })}>Apply filters</button>
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
  }],
  meta: { total: 1, current_page: 1, total_pages: 1 },
  isLoading: false,
  errorMessage: undefined,
  inputFilters: [],
  goToPage: jest.fn(),
  applyInputFilters: jest.fn(),
  clearInputFilters: jest.fn(),
};

describe('PokemonAbilityListView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePokemonAbilityListMock.mockReturnValue(defaultHookValue);
  });

  it('renders ability cards prioritizing effects', () => {
    render(<PokemonAbilityListView />);

    expect(screen.getByRole('heading', { name: 'Pokemon Abilities' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'overgrow' })).toBeInTheDocument();
    expect(screen.getByText('Boosts Grass moves in a pinch.')).toBeInTheDocument();
  });

  it('renders hidden ability fallback copy without the empty state while loading', () => {
    usePokemonAbilityListMock.mockReturnValue({
      ...defaultHookValue,
      isLoading: true,
      items: [{
        ...defaultHookValue.items[0],
        short_effect: '',
        effect: '',
        flavor_text: '',
        is_hidden: true,
      }],
    });

    render(<PokemonAbilityListView />);

    expect(screen.getByText('Effect pending.')).toBeInTheDocument();
    expect(screen.getByText('Hidden')).toBeInTheDocument();
    expect(screen.queryByText('No Pokemon abilities found.')).not.toBeInTheDocument();
  });

  it('forwards filter actions to the list hook', () => {
    render(<PokemonAbilityListView />);

    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(defaultHookValue.applyInputFilters).toHaveBeenCalledWith({ name: 'overgrow' });
    expect(defaultHookValue.clearInputFilters).toHaveBeenCalledTimes(1);
  });

  it('renders empty and alert-only error states', () => {
    usePokemonAbilityListMock.mockReturnValue({ ...defaultHookValue, items: [], errorMessage: 'Could not load Pokemon abilities.' });

    render(<PokemonAbilityListView />);

    expect(screen.getByText('No Pokemon abilities found.')).toBeInTheDocument();
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Could not load Pokemon abilities.' });
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });
});
