import { GET } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const detailMock = jest.fn();
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

jest.mock('@/app/ui/features/pokemon/move', () => ({
  pokemonMoveService: jest.fn(() => ({ detail: detailMock })),
}));

describe('GET /api/pokemon/move/[identifier]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates identifier to the pokemon move service', async () => {
    detailMock.mockResolvedValueOnce({ id: '1', name: 'tackle' });

    const response = await GET({} as Request, { params: Promise.resolve({ identifier: 'tackle' }) });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ id: '1', name: 'tackle' });
    expect(detailMock).toHaveBeenCalledWith('tackle');
  });

  it('returns unauthorized and error responses', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false });

    const unauthorizedResponse = await GET({} as Request, { params: Promise.resolve({ identifier: 'tackle' }) });
    expect(unauthorizedResponse.status).toBe(401);
    await expect(unauthorizedResponse.json()).resolves.toEqual({ message: 'Unauthorized' });

    detailMock.mockRejectedValueOnce(new Error('Move missing'));

    const errorResponse = await GET({} as Request, { params: Promise.resolve({ identifier: 'missing' }) });
    expect(errorResponse.status).toBe(500);
    await expect(errorResponse.json()).resolves.toEqual({ message: 'Move missing' });

    detailMock.mockRejectedValueOnce(null);

    const fallbackResponse = await GET({} as Request, { params: Promise.resolve({ identifier: 'missing' }) });
    expect(fallbackResponse.status).toBe(500);
    await expect(fallbackResponse.json()).resolves.toEqual({ message: 'Could not load Pokemon move detail.' });
  });
});
