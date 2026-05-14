import { fireEvent, render, screen } from '@testing-library/react';

import { PokedexListView } from './PokedexListView';

const showAlertMock = jest.fn();
const usePokedexListMock = jest.fn();

jest.mock('./usePokedexList', () => ({
  usePokedexList: () => usePokedexListMock(),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href} {...props}>{children}</a>,
}));

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      if (key === 'pokedex.list.title') return 'Pokedex';
      if (key === 'pokedex.list.description') return 'Track discovered Pokemon.';
      if (key === 'pokedex.list.filtersAria') return 'Pokedex filters';
      if (key === 'pokedex.list.empty') return 'No Pokedex entries found.';
      if (key === 'pokedex.list.discovered') return 'Discovered';
      if (key === 'pokedex.list.undiscovered') return 'Undiscovered';
      if (key === 'pokedex.list.basePokemonLabel') return `Base Pokemon: ${params?.name}`;
      if (key === 'pokedex.list.level') return `Level ${params?.value}`;
      if (key === 'pokedex.list.experience') return `Experience ${params?.value}`;
      if (key === 'pokedex.list.hp') return `HP ${params?.current}/${params?.max}`;
      if (key === 'pokedex.list.discoveredAt') return `Discovered at ${params?.value}`;
      if (key === 'pokedex.list.notDiscoveredAt') return 'Not discovered yet';
      if (key === 'common.recordCount') return `${params?.count} records`;
      return key;
    },
  }),
}));

jest.mock('@/app/ui/features/pokemon/type', () => ({
  translatePokemonTypeName: (_t: unknown, value: string) => value,
}));

jest.mock('@/app/utils', () => ({
  displayDate: (value: string) => value,
  formatLabel: (value: string) => value,
}));

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
        <button type='button' onClick={() => onApply({ nickname: 'leaf' })}>Apply filters</button>
        <button type='button' onClick={onClear}>Clear filters</button>
      </div>
    ),
    Image: ({ alt }: { alt: string }) => <span aria-label={alt} />,
    Pagination: () => <nav />,
    Text,
    useAlert: () => ({ showAlert: showAlertMock }),
  };
});

jest.mock('@/app/ds/loading/spinner/pokeball', () => ({
  __esModule: true,
  default: () => <span>Pokeball Placeholder</span>,
}));

const defaultHookValue = {
  items: [
    {
      id: '1',
      nickname: 'Leaf',
      level: 5,
      experience: 120,
      hp: 20,
      max_hp: 24,
      attack: 10,
      defense: 9,
      special_attack: 12,
      special_defense: 11,
      speed: 8,
      discovered: true,
      discovered_at: '2026-05-14',
      created_at: '2026-05-14',
      updated_at: null,
      pokemon: {
        id: 'pokemon-1',
        name: 'bulbasaur',
        order: 1,
        external_image: 'https://example.com/bulbasaur.png',
        types: [{ id: 'type-1', name: 'grass', background_color: '', text_color: '' }],
      },
      trainer: {
        id: 'trainer-1',
        user_id: 'user-1',
        pokeballs: 1,
        capture_rate: 75,
      },
    },
  ],
  meta: { total: 1, current_page: 1, total_pages: 1 },
  isLoading: false,
  errorMessage: undefined,
  inputFilters: [],
  goToPage: jest.fn(),
  applyInputFilters: jest.fn(),
  clearInputFilters: jest.fn(),
};

describe('PokedexListView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePokedexListMock.mockReturnValue(defaultHookValue);
  });

  it('renders discovered entries as navigable cards with details', () => {
    render(<PokedexListView />);

    expect(screen.getByRole('heading', { name: 'Pokedex' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Leaf/i })).toHaveAttribute('href', '/pokedex/bulbasaur');
    expect(screen.getByText('Base Pokemon: bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Level 5')).toBeInTheDocument();
    expect(screen.getByText('grass')).toBeInTheDocument();
  });

  it('falls back to the base pokemon name in the image alt and shows missing discovered date text', () => {
    usePokedexListMock.mockReturnValue({
      ...defaultHookValue,
      items: [{
        ...defaultHookValue.items[0],
        nickname: null,
        discovered_at: null,
      }],
    });

    render(<PokedexListView />);

    expect(screen.getByLabelText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Not discovered yet')).toBeInTheDocument();
  });

  it('renders undiscovered entries with pokeball placeholder and no detail link', () => {
    usePokedexListMock.mockReturnValue({
      ...defaultHookValue,
      items: [{
        ...defaultHookValue.items[0],
        id: '2',
        nickname: null,
        discovered: false,
        discovered_at: null,
        pokemon: {
          ...defaultHookValue.items[0].pokemon,
          name: 'mew',
        },
      }],
    });

    render(<PokedexListView />);

    expect(screen.getByRole('heading', { name: 'mew' })).toBeInTheDocument();
    expect(screen.getByText('Undiscovered')).toBeInTheDocument();
    expect(screen.getByLabelText('undiscovered-pokemon-placeholder')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /mew/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Base Pokemon: mew')).not.toBeInTheDocument();
    expect(screen.queryByText(/Level/)).not.toBeInTheDocument();
  });

  it('shows an alert when the list hook returns an error message', () => {
    usePokedexListMock.mockReturnValue({
      ...defaultHookValue,
      errorMessage: 'Could not load Pokedex.',
    });

    render(<PokedexListView />);

    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'Could not load Pokedex.',
    });
  });

  it('renders the empty state when there are no entries and loading is finished', () => {
    usePokedexListMock.mockReturnValue({
      ...defaultHookValue,
      items: [],
      meta: { total: 0, current_page: 1, total_pages: 0 },
    });

    render(<PokedexListView />);

    expect(screen.getByText('No Pokedex entries found.')).toBeInTheDocument();
    expect(screen.getByText('0 records')).toBeInTheDocument();
  });

  it('forwards filter actions to the list hook', () => {
    render(<PokedexListView />);

    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(defaultHookValue.applyInputFilters).toHaveBeenCalledWith({ nickname: 'leaf' });
    expect(defaultHookValue.clearInputFilters).toHaveBeenCalledTimes(1);
  });
});
