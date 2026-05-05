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

jest.mock('@/app/ui/features/pokemon', () => ({
  pokemonService: jest.fn(() => ({ list: listMock })),
}));

describe('GET /api/pokemon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
