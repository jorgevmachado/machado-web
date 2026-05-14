import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import HomeOnboarding from './HomeOnboarding';

const showAlertMock = jest.fn();
const refreshUserMock = jest.fn().mockResolvedValue(undefined);
const onCreatedMock = jest.fn();
let currentUserRole = 'USER';
const translateMock = (key: string, params?: Record<string, string | number>) => {
  if (params?.value !== undefined) {
    return `${key}:${params.value}`;
  }
  return key;
};

type Option = {
  value: string;
};

type AutocompleteMockProps = {
  name: string;
  value: string;
  options: Option[];
  onValueChange?: (value: string) => void;
  onSelectOption?: (option: Option) => void;
};

type BasicChildrenProps = {
  children?: React.ReactNode;
};

type ButtonMockProps = BasicChildrenProps & {
  onClick?: () => void;
  isLoading?: boolean;
};

type InputMockProps = {
  id?: string;
  name?: string;
  value?: string;
  onValueChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
};

type TextMockProps = BasicChildrenProps & {
  as?: keyof React.JSX.IntrinsicElements;
};

jest.mock('machado-web/app/i18n', () => ({
  useAppTranslation: () => ({
    t: translateMock,
  }),
}));

jest.mock('machado-web/app/ui/features/auth', () => ({
  useUser: () => ({
    user: {
      id: 'user-1',
      role: currentUserRole,
    },
    refreshUser: refreshUserMock,
  }),
}));

jest.mock('machado-web/app/ds', () => ({
  Autocomplete: ({ value, onValueChange, onSelectOption, options, name }: AutocompleteMockProps) => (
    <div>
      <span>{`${name}-options:${options.length}`}</span>
      <input
        aria-label={name}
        value={value}
        onChange={(event) => {
          onValueChange?.(event.target.value);
          const option = options.find((item) => item.value === event.target.value);
          if (option) {
            onSelectOption?.(option);
          }
        }}
      />
      <button
        type='button'
        aria-label={`${name}-select-first`}
        onClick={() => {
          const firstOption = options[0];
          if (firstOption) {
            onSelectOption?.(firstOption);
          }
        }}
      >
        select first
      </button>
    </div>
  ),
  Badge: ({ children }: BasicChildrenProps) => <span>{children}</span>,
  Button: ({ children, onClick, isLoading }: ButtonMockProps) => (
    <button type='button' onClick={onClick} disabled={isLoading}>
      {children}
    </button>
  ),
  Card: ({ children }: BasicChildrenProps) => <div>{children}</div>,
  Input: ({ name, value, onValueChange, ...props }: InputMockProps) => (
    <input
      aria-label={props.id ?? name}
      value={value}
      onChange={(event) => onValueChange?.(event.target.value, event)}
    />
  ),
  Text: ({ as: Component = 'span', children, ...props }: TextMockProps) => <Component {...props}>{children}</Component>,
  useAlert: () => ({
    showAlert: showAlertMock,
  }),
}));

describe('HomeOnboarding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    refreshUserMock.mockResolvedValue(undefined);
    currentUserRole = 'USER';
    global.fetch = jest.fn() as jest.Mock;
  });

  it('renders starter choices for non-admin users and submits the selected pokemon', async () => {
    mockFetchByUrl({
      '/api/pokemon?page=1&limit=151': {
        ok: true,
        json: async () => ({
          items: buildPokemonOptions(),
        }),
      },
      '/api/trainer/onboarding': {
        ok: true,
        json: async () => ({ id: 'owned-1' }),
      },
    });

    render(<HomeOnboarding onCreated={onCreatedMock} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /bulbasaur/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /bulbasaur/i }));
    fireEvent.change(screen.getByRole('textbox', { name: 'nickname' }), {
      target: { value: 'Leaf' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'myPokemon.onboarding.submit' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/pokemon?page=1&limit=151', expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      }));
      expect(global.fetch).toHaveBeenCalledWith('/api/trainer/onboarding', expect.objectContaining({
        method: 'POST',
      }));
    });

    await waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith({
        type: 'success',
        message: 'myPokemon.onboarding.success',
      });
    });

    expect(refreshUserMock).toHaveBeenCalledTimes(1);
    expect(onCreatedMock).toHaveBeenCalledTimes(1);
  });

  it('shows a validation error when submitting without selecting a pokemon', async () => {
    mockFetchByUrl({
      '/api/pokemon?page=1&limit=151': {
        ok: true,
        json: async () => ({ items: buildPokemonOptions() }),
      },
    });

    render(<HomeOnboarding />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /bulbasaur/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'myPokemon.onboarding.submit' }));

    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'myPokemon.onboarding.validation.selectPokemon',
    });
    expect(global.fetch).not.toHaveBeenCalledWith(
      '/api/trainer/onboarding',
      expect.anything(),
    );
  });

  it('shows an alert when loading pokemon options fails', async () => {
    mockFetchByUrl({
      '/api/pokemon?page=1&limit=151': {
        ok: false,
        json: async () => ({ message: 'Could not load options' }),
      },
    });

    render(<HomeOnboarding />);

    await waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith({
        type: 'error',
        message: 'Could not load options',
      });
    });
  });

  it('uses the translated fallback when loading pokemon options returns no message', async () => {
    mockFetchByUrl({
      '/api/pokemon?page=1&limit=151': {
        ok: false,
        json: async () => ({}),
      },
    });

    render(<HomeOnboarding />);

    await waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith({
        type: 'error',
        message: 'myPokemon.onboarding.loadOptionsError',
      });
    });
  });

  it('uses the translated fallback when loading pokemon options returns an invalid array payload', async () => {
    mockFetchByUrl({
      '/api/pokemon?page=1&limit=151': {
        ok: false,
        json: async () => [],
      },
    });

    render(<HomeOnboarding />);

    await waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith({
        type: 'error',
        message: 'myPokemon.onboarding.loadOptionsError',
      });
    });
  });

  it('renders admin controls and submits custom values', async () => {
    currentUserRole = 'ADMIN';
    mockFetchByUrl({
      '/api/pokemon?page=1&limit=151': {
        ok: true,
        json: async () => buildPokemonOptions(),
      },
      '/api/trainer/onboarding': {
        ok: true,
        json: async () => ({ id: 'owned-2' }),
      },
    });

    render(<HomeOnboarding />);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'starter-admin' })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('starter-admin-options:3')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'starter-admin-select-first' }));
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'starter-admin' })).toHaveValue('bulbasaur');
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'nickname' }), {
      target: { value: 'Leaf' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'pokeballs' }), {
      target: { value: '8' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'capture_rate' }), {
      target: { value: '120' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'myPokemon.onboarding.submit' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/trainer/onboarding',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            pokemon_name: 'bulbasaur',
            nickname: 'Leaf',
            pokeballs: 8,
            capture_rate: 120,
          }),
        }),
      );
    });

    expect(screen.getByRole('heading', { name: 'Bulbasaur' })).toBeInTheDocument();
    expect(screen.getByText('pokemon.type.names.grass')).toBeInTheDocument();
  });

  it('shows an error alert when submit fails', async () => {
    mockFetchByUrl({
      '/api/pokemon?page=1&limit=151': {
        ok: true,
        json: async () => ({ items: buildPokemonOptions() }),
      },
      '/api/trainer/onboarding': {
        ok: false,
        json: async () => ({ message: 'Could not create trainer' }),
      },
    });

    render(<HomeOnboarding />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /bulbasaur/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /bulbasaur/i }));
    fireEvent.click(screen.getByRole('button', { name: 'myPokemon.onboarding.submit' }));

    await waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith({
        type: 'error',
        message: 'Could not create trainer',
      });
    });
  });

  it('uses the translated fallback when submit fails without a message', async () => {
    mockFetchByUrl({
      '/api/pokemon?page=1&limit=151': {
        ok: true,
        json: async () => ({ items: buildPokemonOptions() }),
      },
      '/api/trainer/onboarding': {
        ok: false,
        json: async () => ({}),
      },
    });

    render(<HomeOnboarding />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /bulbasaur/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /bulbasaur/i }));
    fireEvent.click(screen.getByRole('button', { name: 'myPokemon.onboarding.submit' }));

    await waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith({
        type: 'error',
        message: 'myPokemon.onboarding.submitError',
      });
    });
  });

  it('uses translated fallbacks when fetch rejects with a non-Error value', async () => {
    (global.fetch as jest.Mock).mockImplementation((input: string) => {
      if (input === '/api/pokemon?page=1&limit=151') {
        return Promise.reject('');
      }

      return Promise.reject('');
    });

    render(<HomeOnboarding />);

    await waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith({
        type: 'error',
        message: 'myPokemon.onboarding.loadOptionsError',
      });
    });
  });

  it('uses the translated submit fallback when onboarding fetch rejects with a non-Error value', async () => {
    (global.fetch as jest.Mock).mockImplementation((input: string) => {
      if (input === '/api/pokemon?page=1&limit=151') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ items: buildPokemonOptions() }),
        });
      }

      return Promise.reject('');
    });

    render(<HomeOnboarding />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /bulbasaur/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /bulbasaur/i }));
    fireEvent.click(screen.getByRole('button', { name: 'myPokemon.onboarding.submit' }));

    await waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith({
        type: 'error',
        message: 'myPokemon.onboarding.submitError',
      });
    });
  });
});

function buildPokemonOptions() {
  return [
    {
      id: '1',
      order: 1,
      name: 'bulbasaur',
      external_image: 'https://example.com/1.png',
      status: 'COMPLETE',
      types: [
        { id: 'grass', name: 'grass', background_color: '#78C850', text_color: '#111827' },
        { id: 'poison', name: 'poison', background_color: '', text_color: '' },
      ],
    },
    {
      id: '4',
      order: 4,
      name: 'charmander',
      external_image: 'https://example.com/4.png',
      status: 'COMPLETE',
      types: [{ id: 'fire', name: 'fire', background_color: '#F08030', text_color: '#111827' }],
    },
    {
      id: '7',
      order: 7,
      name: 'squirtle',
      external_image: 'https://example.com/7.png',
      status: 'COMPLETE',
      types: [{ id: 'water', name: 'water', background_color: '#6890F0', text_color: '#FFFFFF' }],
    },
  ];
}

function mockFetchByUrl(
  responses: Record<string, { ok: boolean; json: () => Promise<unknown> }>,
) {
  (global.fetch as jest.Mock).mockImplementation((input: string) => {
    const response = responses[input];

    if (!response) {
      throw new Error(`Unhandled fetch mock for ${input}`);
    }

    return Promise.resolve(response);
  });
}
