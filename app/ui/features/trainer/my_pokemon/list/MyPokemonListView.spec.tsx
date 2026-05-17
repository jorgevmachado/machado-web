import { fireEvent, render, screen } from '@testing-library/react';

import { MyPokemonListView } from './MyPokemonListView';

const showAlertMock = jest.fn();
const paginatedListMock = jest.fn();
let hookValue: ReturnType<typeof buildHookValue>;

jest.mock('@/app/ui/hooks/list/usePaginatedList', () => ({
  __esModule: true,
  default: (...args: unknown[]) => paginatedListMock(...args),
}));

jest.mock('machado-web/app/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      if (params?.count !== undefined) {
        return `${key}:${params.count}`;
      }
      if (params?.value !== undefined) {
        return `${key}:${params.value}`;
      }
      if (params?.name !== undefined) {
        return `${key}:${params.name}`;
      }
      if (params?.current !== undefined && params?.max !== undefined) {
        return `${key}:${params.current}/${params.max}`;
      }
      return key;
    },
  }),
}));

jest.mock('machado-web/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, ...props }: { as?: string; children: React.ReactNode }) => {
    return React.createElement(as, props, children);
  };

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Filters: ({ onApply, onClear }: { onApply: (filters: unknown) => void; onClear: () => void }) => (
      <div>
        <button type="button" onClick={() => onApply({ name: 'leaf' })}>Apply filters</button>
        <button type="button" onClick={onClear}>Clear filters</button>
      </div>
    ),
    Image: ({ alt }: { alt: string }) => <span aria-label={alt} />,
    Pagination: ({ onPageChange }: { onPageChange?: (page: number) => void }) => (
      <button type="button" onClick={() => onPageChange?.(2)}>Go next</button>
    ),
    Text,
    useAlert: () => ({ showAlert: showAlertMock }),
  };
});

describe('MyPokemonListView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    hookValue = buildHookValue();
    paginatedListMock.mockReturnValue(hookValue);
  });

  it('renders roster cards and forwards filter actions', () => {
    render(<MyPokemonListView />);

    expect(screen.getByRole('heading', { name: 'myPokemon.list.title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Bulba' })).toBeInTheDocument();
    expect(screen.getByText('pokemon.type.names.bulbasaur')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Go next' }));

    expect(hookValue.applyInputFilters).toHaveBeenCalledWith({ name: 'leaf' });
    expect(hookValue.clearInputFilters).toHaveBeenCalledTimes(1);
    expect(hookValue.goToPage).toHaveBeenCalledWith(2);
  });

  it('shows the empty state and error alert when needed', () => {
    paginatedListMock.mockReturnValueOnce({
      items: [],
      meta: { total: 0, current_page: 1, total_pages: 0 },
      isLoading: false,
      errorMessage: 'Could not load your Pokemon.',
      inputFilters: [],
      goToPage: jest.fn(),
      applyInputFilters: jest.fn(),
      clearInputFilters: jest.fn(),
    });

    render(<MyPokemonListView />);

    expect(screen.getByText('myPokemon.list.empty')).toBeInTheDocument();
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Could not load your Pokemon.' });
  });

  it('configures direct list normalization for the shared hook', () => {
    render(<MyPokemonListView />);

    const config = paginatedListMock.mock.calls[0][0] as {
      normalizeFilters: (filters: { name?: string; pokemon_name?: string }) => unknown;
    };

    expect(config.normalizeFilters({ name: ' leaf ', pokemon_name: ' bulbasaur ' })).toEqual({
      name: 'leaf',
      pokemon_name: 'bulbasaur',
    });
    expect(config.normalizeFilters({ name: '', pokemon_name: '' })).toEqual({
      name: undefined,
      pokemon_name: undefined,
    });
  });
});

function buildHookValue() {
  return {
    items: [{
      id: '1',
      name: 'bulbasaur-1',
      nickname: 'Bulba',
      level: 1,
      experience: 0,
      hp: 45,
      max_hp: 45,
      attack: 49,
      defense: 49,
      special_attack: 65,
      special_defense: 65,
      speed: 45,
      captured_at: '2026-05-12T00:00:00Z',
      created_at: '2026-05-12T00:00:00Z',
      pokemon: {
        id: 'pokemon-1',
        name: 'bulbasaur',
        order: 1,
        external_image: 'https://example.com/bulbasaur.png',
        types: [
          {
            id: 'type-1',
            name: 'bulbasaur',
            background_color: '#78C850',
            text_color: '#111827',
          },
          {
            id: 'type-2',
            name: 'poison',
            background_color: '',
            text_color: '',
          },
        ],
      },
      trainer: { id: 'trainer-1', user_id: 'user-1', pokeballs: 1, capture_rate: 75 },
      moves: [],
    }],
    meta: { total: 1, current_page: 1, total_pages: 1 },
    isLoading: false,
    errorMessage: undefined,
    inputFilters: [],
    goToPage: jest.fn(),
    applyInputFilters: jest.fn(),
    clearInputFilters: jest.fn(),
  };
}
