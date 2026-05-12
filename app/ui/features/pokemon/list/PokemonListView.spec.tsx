import { fireEvent, render, screen } from '@testing-library/react';

import { PokemonListView } from './PokemonListView';

const showAlertMock = jest.fn();
const usePokemonListMock = jest.fn();

jest.mock('./usePokemonList', () => ({
  usePokemonList: () => usePokemonListMock(),
}));

const defaultHookValue = {
  items: [{
    id: '1',
    order: 1,
    name: 'bulbasaur',
    external_image: 'https://example.com/bulbasaur.png',
    status: 'INCOMPLETE',
    types: [],
  }],
  meta: { total: 1, current_page: 1, total_pages: 1 },
  isLoading: false,
  errorMessage: undefined,
  inputFilters: [],
  goToPage: jest.fn(),
  applyInputFilters: jest.fn(),
  clearInputFilters: jest.fn(),
};

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, ...props }: { as?: string; children: React.ReactNode }) => {
    return React.createElement(as, props, children);
  };

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Filters: ({ onApply, onClear }: { onApply: (filters: unknown) => void; onClear: () => void }) => (
      <div>
        <button type="button" onClick={() => onApply({ name: 'bulbasaur' })}>Apply filters</button>
        <button type="button" onClick={onClear}>Clear filters</button>
      </div>
    ),
    Image: ({ alt }: { alt: string }) => <span aria-label={alt} />,
    Pagination: () => <nav />,
    Text,
    useAlert: () => ({ showAlert: showAlertMock }),
  };
});

describe('PokemonListView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePokemonListMock.mockReturnValue(defaultHookValue);
  });

  it('renders pokemon cards and pagination summary data', () => {
    render(<PokemonListView />);

    expect(screen.getByRole('heading', { name: 'Pokemon' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByText('#0001')).toBeInTheDocument();
    expect(screen.getByText('1 record')).toBeInTheDocument();
  });

  it('renders complete pokemon types and reports load errors', () => {
    usePokemonListMock.mockReturnValue({
      ...defaultHookValue,
      errorMessage: 'Could not load Pokemon.',
      items: [{
        id: '2',
        order: 25,
        name: 'pikachu',
        external_image: 'https://example.com/pikachu.png',
        status: 'COMPLETE',
        types: [{
          id: 'type-1',
          name: 'electric',
          background_color: '',
          text_color: '',
        }],
      }],
    });

    render(<PokemonListView />);

    expect(screen.getByRole('heading', { name: 'pikachu' })).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('COMPLETE')).toBeInTheDocument();
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Could not load Pokemon.' });
  });

  it('renders the empty state after loading finishes', () => {
    usePokemonListMock.mockReturnValue({
      ...defaultHookValue,
      items: [],
      meta: { total: 0, current_page: 1, total_pages: 0 },
    });

    render(<PokemonListView />);

    expect(screen.getByText('No Pokemon found.')).toBeInTheDocument();
    expect(screen.getByText('0 records')).toBeInTheDocument();
  });

  it('does not render the empty state while loading', () => {
    usePokemonListMock.mockReturnValue({
      ...defaultHookValue,
      items: [],
      isLoading: true,
    });

    render(<PokemonListView />);

    expect(screen.queryByText('No Pokemon found.')).not.toBeInTheDocument();
  });

  it('renders configured pokemon type colors when available', () => {
    usePokemonListMock.mockReturnValue({
      ...defaultHookValue,
      items: [{
        id: '2',
        order: 25,
        name: 'pikachu',
        external_image: 'https://example.com/pikachu.png',
        status: 'COMPLETE',
        types: [{
          id: 'type-1',
          name: 'electric',
          background_color: '#FDE68A',
          text_color: '#78350F',
        }],
      }],
    });

    render(<PokemonListView />);

    expect(screen.getByText('Electric')).toHaveStyle({
      backgroundColor: '#FDE68A',
      color: '#78350F',
    });
  });

  it('forwards filter actions to the list hook', () => {
    render(<PokemonListView />);

    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(defaultHookValue.applyInputFilters).toHaveBeenCalledWith({ name: 'bulbasaur' });
    expect(defaultHookValue.clearInputFilters).toHaveBeenCalledTimes(1);
  });
});
