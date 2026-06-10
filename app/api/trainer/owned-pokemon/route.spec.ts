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

jest.mock('@/app/ui', () => ({
  pokemonService: jest.fn(() => ({ list: listMock })),
}));

describe('GET /api/pokemon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates query params to the pokemon service', async () => {
    listMock.mockResolvedValueOnce({ items: [], meta: { total: 0 } });
    const request = {
      nextUrl: {
        searchParams: new URLSearchParams('page=2&type=grass'),
      },
    };

    const response = await GET(request as never);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ items: [], meta: { total: 0 } });
    expect(listMock).toHaveBeenCalledWith({ page: '2', type: 'grass' });
  });

  it('returns unauthorized when there is no valid session', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false });

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams() },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
    expect(listMock).not.toHaveBeenCalled();
  });

  it('maps service errors to a fallback response', async () => {
    listMock.mockRejectedValueOnce(new Error('Service unavailable'));

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams() },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Service unavailable' });
  });

  it('uses the default error message for unknown failures', async () => {
    listMock.mockRejectedValueOnce('broken');

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams() },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not load Trainer Pokemon.' });
  });
});
