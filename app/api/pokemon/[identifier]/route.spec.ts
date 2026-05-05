import { GET } from './route';

const detailMock = jest.fn();

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
  pokemonService: jest.fn(() => ({ detail: detailMock })),
}));

describe('GET /api/pokemon/[identifier]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates identifier to the pokemon service', async () => {
    detailMock.mockResolvedValueOnce({ id: '1', name: 'bulbasaur' });

    const response = await GET({} as Request, {
      params: Promise.resolve({ identifier: 'bulbasaur' }),
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ id: '1', name: 'bulbasaur' });
    expect(detailMock).toHaveBeenCalledWith('bulbasaur');
  });
});
