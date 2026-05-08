import { getServerSession } from '@/app/shared/lib/auth/server';

import { GET } from './route';

const listMock = jest.fn();

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

jest.mock('@/app/ui/features/pokemon/growth_rate', () => ({
  pokemonGrowthRateService: jest.fn(() => ({ list: listMock })),
}));

const getServerSessionMock = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('GET /api/pokemon/move', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates query params to the pokemon growth rate service', async () => {
    listMock.mockResolvedValueOnce({ items: [], meta: { total: 0 } });
    const request = { nextUrl: { searchParams: new URLSearchParams('page=2&name=tackle') } };

    const response = await GET(request as never);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ items: [], meta: { total: 0 } });
    expect(listMock).toHaveBeenCalledWith({ page: '2', name: 'tackle' });
  });

  it('returns unauthorized without a session', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false });
    const request = { nextUrl: { searchParams: new URLSearchParams() } };

    const response = await GET(request as never);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns service and fallback error messages', async () => {
    listMock.mockRejectedValueOnce(new Error('Growth rate API unavailable'));

    const errorResponse = await GET({ nextUrl: { searchParams: new URLSearchParams() } } as never);
    expect(errorResponse.status).toBe(500);
    await expect(errorResponse.json()).resolves.toEqual({ message: 'Growth rate API unavailable' });

    listMock.mockRejectedValueOnce(null);

    const fallbackResponse = await GET({ nextUrl: { searchParams: new URLSearchParams() } } as never);
    expect(fallbackResponse.status).toBe(500);
    await expect(fallbackResponse.json()).resolves.toEqual({ message: 'Could not load Pokemon Growth Rate.' });
  });
});
