import { render, screen } from '@testing-library/react';

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
    Filters: () => <div aria-label="filters" />,
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

  it('renders empty and alert-only error states', () => {
    usePokemonAbilityListMock.mockReturnValue({ ...defaultHookValue, items: [], errorMessage: 'Could not load Pokemon abilities.' });

    render(<PokemonAbilityListView />);

    expect(screen.getByText('No Pokemon abilities found.')).toBeInTheDocument();
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Could not load Pokemon abilities.' });
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });
});
