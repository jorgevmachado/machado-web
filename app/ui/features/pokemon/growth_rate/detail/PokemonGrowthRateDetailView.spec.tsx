import { render, screen, within } from '@testing-library/react';

import { PokemonGrowthRateDetailView } from './PokemonGrowthRateDetailView';

const usePokemonGrowthRateDetailMock = jest.fn();

jest.mock('./usePokemonGrowthRateDetail', () => ({
  usePokemonGrowthRateDetail: () => usePokemonGrowthRateDetailMock(),
}));

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, ...props }: { as?: string; children: React.ReactNode }) => React.createElement(as, props, children);

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Text,
  };
});

describe('PokemonGrowthRateDetailView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePokemonGrowthRateDetailMock.mockReturnValue({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'growth-rate-1',
        name: 'medium-fast',
        order: 33,
        url: 'https://example.com/medium-fast',
        formula: 'x^3',
        description: 'Experience grows following the x^3 curve.',
        created_at: '2026-01-01',
      },
    });
  });

  it('renders growth rate detail and level experience table', () => {
    render(<PokemonGrowthRateDetailView identifier="medium-fast" />);

    expect(screen.getByRole('heading', { name: 'medium-fast' })).toBeInTheDocument();
    expect(screen.getByText('x^3')).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(101);
    expect(within(rows[1]).getByRole('cell', { name: '1' })).toBeInTheDocument();
    expect(within(rows[1]).getByRole('cell', { name: '0' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: '2' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: '8' })).toBeInTheDocument();
    expect(within(rows[3]).getByRole('cell', { name: '3' })).toBeInTheDocument();
    expect(within(rows[3]).getByRole('cell', { name: '27' })).toBeInTheDocument();
  });

  it('renders experience values from fractional polynomial formula', () => {
    usePokemonGrowthRateDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'growth-rate-2',
        name: 'slow',
        order: 34,
        url: 'https://example.com/slow',
        formula: '\\frac{6x^3}{5} - 15x^2 + 100x - 140',
        description: 'Slow growth curve.',
        created_at: '2026-01-01',
      },
    });

    render(<PokemonGrowthRateDetailView identifier="slow" />);

    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByRole('cell', { name: '1' })).toBeInTheDocument();
    expect(within(rows[1]).getByRole('cell', { name: '0' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: '2' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: '9' })).toBeInTheDocument();
    expect(within(rows[3]).getByRole('cell', { name: '3' })).toBeInTheDocument();
    expect(within(rows[3]).getByRole('cell', { name: '57' })).toBeInTheDocument();
  });

  it('normalizes formula braces before calculating experience', () => {
    usePokemonGrowthRateDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'growth-rate-braces',
        name: 'braced',
        order: 34,
        url: 'https://example.com/braced',
        formula: '{x}^2',
        description: 'Braced curve.',
        created_at: '2026-01-01',
      },
    });

    render(<PokemonGrowthRateDetailView identifier="braced" />);

    const rows = screen.getAllByRole('row');
    expect(within(rows[3]).getByRole('cell', { name: '9' })).toBeInTheDocument();
  });

  it('renders pending formula and unknown experience for unsafe formulas', () => {
    usePokemonGrowthRateDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'growth-rate-3',
        name: 'unknown',
        order: 35,
        url: 'https://example.com/unknown',
        formula: '',
        description: 'Unknown growth curve.',
        created_at: '2026-01-01',
      },
    });

    render(<PokemonGrowthRateDetailView identifier="unknown" />);

    expect(screen.getByText('Formula pending.')).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    expect(within(rows[2]).getByRole('cell', { name: '-' })).toBeInTheDocument();
  });

  it('renders unknown experience when a formula produces a non-finite value', () => {
    usePokemonGrowthRateDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'growth-rate-infinite',
        name: 'infinite',
        order: 35,
        url: 'https://example.com/infinite',
        formula: '1/0',
        description: 'Infinite curve.',
        created_at: '2026-01-01',
      },
    });

    render(<PokemonGrowthRateDetailView identifier="infinite" />);

    const rows = screen.getAllByRole('row');
    expect(within(rows[2]).getByRole('cell', { name: '-' })).toBeInTheDocument();
  });

  it('renders unknown experience for invalid and failing formulas', () => {
    usePokemonGrowthRateDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'growth-rate-4',
        name: 'invalid',
        order: 36,
        url: 'https://example.com/invalid',
        formula: 'x + pokemon',
        description: 'Invalid growth curve.',
        created_at: '2026-01-01',
      },
    });

    const { rerender } = render(<PokemonGrowthRateDetailView identifier="invalid" />);

    let rows = screen.getAllByRole('row');
    expect(within(rows[2]).getByRole('cell', { name: '-' })).toBeInTheDocument();

    usePokemonGrowthRateDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'growth-rate-5',
        name: 'failing',
        order: 37,
        url: 'https://example.com/failing',
        formula: '1..2 + x',
        description: 'Failing growth curve.',
        created_at: '2026-01-01',
      },
    });

    rerender(<PokemonGrowthRateDetailView identifier="failing" />);

    rows = screen.getAllByRole('row');
    expect(within(rows[2]).getByRole('cell', { name: '-' })).toBeInTheDocument();
  });

  it('renders loading and alert-only error states', () => {
    usePokemonGrowthRateDetailMock.mockReturnValueOnce({ isLoading: true, data: undefined, errorMessage: undefined });
    const { rerender } = render(<PokemonGrowthRateDetailView identifier="medium-fast" />);

    expect(screen.getByText('Loading Pokemon growth rate...')).toBeInTheDocument();

    usePokemonGrowthRateDetailMock.mockReturnValueOnce({ isLoading: false, data: undefined, errorMessage: 'Growth rate failed.' });
    rerender(<PokemonGrowthRateDetailView identifier="medium-fast" />);

    expect(screen.getByText('Growth rate failed.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('renders the default not found message when loading finishes without data', () => {
    usePokemonGrowthRateDetailMock.mockReturnValueOnce({
      isLoading: false,
      data: undefined,
      errorMessage: undefined,
    });

    render(<PokemonGrowthRateDetailView identifier="missing" />);

    expect(screen.getByText('Pokemon growth rate not found.')).toBeInTheDocument();
  });
});
