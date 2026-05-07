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

jest.mock('@/app/ui/features/pokemon/type', () => ({
  pokemonTypeService: jest.fn(() => ({ list: listMock })),
}));

const getServerSessionMock = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('GET /api/pokemon/type', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates query params to the pokemon type service', async () => {
    listMock.mockResolvedValueOnce({ items: [], meta: { total: 0 } });
    const request = { nextUrl: { searchParams: new URLSearchParams('page=2&name=fire') } };

    const response = await GET(request as never);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ items: [], meta: { total: 0 } });
    expect(listMock).toHaveBeenCalledWith({ page: '2', name: 'fire' });
  });

  it('returns unauthorized without a session', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false });
    const request = { nextUrl: { searchParams: new URLSearchParams() } };

    const response = await GET(request as never);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
    expect(listMock).not.toHaveBeenCalled();
  });

  it('returns an error response when the service fails', async () => {
    listMock.mockRejectedValueOnce(new Error('API unavailable'));
    const request = { nextUrl: { searchParams: new URLSearchParams() } };

    const response = await GET(request as never);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'API unavailable' });
  });
});
