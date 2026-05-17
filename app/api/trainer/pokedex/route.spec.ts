import { GET } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const listMock = jest.fn();
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

jest.mock('@/app/ui/features/trainer/pokedex', () => ({
  pokedexService: jest.fn(() => ({ list: listMock })),
}));

describe('GET /api/pokedex', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates query params to the pokedex service', async () => {
    listMock.mockResolvedValueOnce({ items: [], meta: { total: 0 } });

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams('page=2&pokemon_name=bulbasaur') },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ items: [], meta: { total: 0 } });
    expect(listMock).toHaveBeenCalledWith({ page: '2', pokemon_name: 'bulbasaur' });
  });

  it('returns unauthorized when there is no valid session', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false });

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams() },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns the service error message when list fails', async () => {
    listMock.mockRejectedValueOnce(new Error('Could not fetch pokedex'));

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams() },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not fetch pokedex' });
  });

  it('returns the fallback message when list fails without an Error instance', async () => {
    listMock.mockRejectedValueOnce(null);

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams() },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not load Pokedex.' });
  });
});
