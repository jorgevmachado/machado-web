import { render, screen } from '@testing-library/react';

import { PokemonTypeDetailView } from './PokemonTypeDetailView';

const usePokemonTypeDetailMock = jest.fn();

jest.mock('./usePokemonTypeDetail', () => ({
  usePokemonTypeDetail: () => usePokemonTypeDetailMock(),
}));

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  const Text = ({ as = 'p', children, ...props }: { as?: string; children: React.ReactNode }) => React.createElement(as, props, children);

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Image: ({ alt }: { alt: string }) => <span aria-label={alt} />,
    Text,
  };
});

describe('PokemonTypeDetailView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePokemonTypeDetailMock.mockReturnValue({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'type-1',
        name: 'fire',
        order: 10,
        url: 'https://example.com/fire',
        text_color: '#fff',
        background_color: '#f00',
        badge_url: 'https://example.com/fire.png',
        strengths: [{ id: 'water', name: 'water', order: 11, background_color: '#bfdbfe', text_color: '#1d4ed8' }],
        weaknesses: [{ id: 'grass', name: 'grass', order: 12, background_color: '#bbf7d0', text_color: '#166534' }],
        created_at: '2026-01-01',
      },
    });
  });

  it('renders type detail with linked strengths and weaknesses', () => {
    render(<PokemonTypeDetailView identifier="fire" />);

    expect(screen.getByRole('heading', { name: 'Fire' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Water type' })).toHaveAttribute('href', '/pokemon/type/water');
    expect(screen.getByRole('link', { name: 'Open Grass type' })).toHaveAttribute('href', '/pokemon/type/grass');
  });

  it('renders fallback order, description and omits empty relation sections', () => {
    usePokemonTypeDetailMock.mockReturnValueOnce({
      isLoading: false,
      errorMessage: undefined,
      data: {
        id: 'type-2',
        name: 'unknown',
        order: null,
        url: 'https://example.com/unknown',
        text_color: '',
        background_color: '',
        badge_url: '',
        description: '',
        strengths: [],
        weaknesses: [],
        created_at: '2026-01-01',
      },
    });

    render(<PokemonTypeDetailView identifier="unknown" />);

    expect(screen.getByText('#---')).toBeInTheDocument();
    expect(screen.getByText('No description available.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Strengths' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Weaknesses' })).not.toBeInTheDocument();
  });

  it('renders loading and alert-only error states', () => {
    usePokemonTypeDetailMock.mockReturnValueOnce({ isLoading: true, data: undefined, errorMessage: undefined });
    const { rerender } = render(<PokemonTypeDetailView identifier="fire" />);

    expect(screen.getByText('Loading Pokemon type...')).toBeInTheDocument();

    usePokemonTypeDetailMock.mockReturnValueOnce({ isLoading: false, data: undefined, errorMessage: 'Type failed.' });
    rerender(<PokemonTypeDetailView identifier="fire" />);

    expect(screen.getByText('Type failed.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('renders the default not found message when loading finishes without data', () => {
    usePokemonTypeDetailMock.mockReturnValueOnce({
      isLoading: false,
      data: undefined,
      errorMessage: undefined,
    });

    render(<PokemonTypeDetailView identifier="missing" />);

    expect(screen.getByText('Pokemon type not found.')).toBeInTheDocument();
  });
});
