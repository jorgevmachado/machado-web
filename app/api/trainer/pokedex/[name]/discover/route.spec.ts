import { POST } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const discoverMock = jest.fn();
const getServerSessionMock = getServerSession as jest.Mock;

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

jest.mock('@/app/shared/lib/auth/server', () => ({
  getServerSession: jest.fn(async () => ({ isAuthenticated: true, token: 'token' })),
}));

jest.mock('@/app/ui', () => ({
  pokedexService: jest.fn(() => ({ discover: discoverMock })),
}));

describe('POST /api/pokedex/[name]/discover', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates name to the discover service', async () => {
    discoverMock.mockResolvedValueOnce({ id: '1', discovered: true });

    const response = await POST({} as Request, {
      params: Promise.resolve({ name: 'bulbasaur' }),
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ id: '1', discovered: true });
    expect(discoverMock).toHaveBeenCalledWith('bulbasaur');
  });

  it('returns unauthorized when there is no token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true, token: undefined });

    const response = await POST({} as Request, {
      params: Promise.resolve({ name: 'bulbasaur' }),
    });
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns the fallback message when discover fails without an Error instance', async () => {
    discoverMock.mockRejectedValueOnce(undefined);

    const response = await POST({} as Request, {
      params: Promise.resolve({ name: 'bulbasaur' }),
    });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not discover Pokedex entry.' });
  });

  it('returns the service error message when discover fails with an Error instance', async () => {
    discoverMock.mockRejectedValueOnce(new Error('Discover failed'));

    const response = await POST({} as Request, {
      params: Promise.resolve({ name: 'bulbasaur' }),
    });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Discover failed' });
  });
});
