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

jest.mock('@/app/ui/features/pokemon/move', () => ({
  pokemonMoveService: jest.fn(() => ({ detail: detailMock })),
}));

describe('GET /api/pokemon/move/[identifier]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates identifier to the pokemon move service', async () => {
    detailMock.mockResolvedValueOnce({ id: '1', name: 'tackle' });

    const response = await GET({} as Request, { params: Promise.resolve({ identifier: 'tackle' }) });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ id: '1', name: 'tackle' });
    expect(detailMock).toHaveBeenCalledWith('tackle');
  });
});
