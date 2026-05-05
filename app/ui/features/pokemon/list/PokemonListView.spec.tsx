import { render, screen } from '@testing-library/react';

import { PokemonListView } from './PokemonListView';

jest.mock('./usePokemonList', () => ({
  usePokemonList: () => ({
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
  }),
}));

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, ...props }: { as?: string; children: React.ReactNode }) => {
    return React.createElement(as, props, children);
  };

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Filters: () => <div />,
    Image: ({ alt }: { alt: string }) => <span aria-label={alt} />,
    Pagination: () => <nav />,
    Text,
    useAlert: () => ({ showAlert: jest.fn() }),
  };
});

describe('PokemonListView', () => {
  it('renders pokemon cards and pagination summary data', () => {
    render(<PokemonListView />);

    expect(screen.getByRole('heading', { name: 'Pokemon' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByText('#0001')).toBeInTheDocument();
    expect(screen.getByText('1 records')).toBeInTheDocument();
  });
});
