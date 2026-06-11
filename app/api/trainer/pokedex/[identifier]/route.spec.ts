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

jest.mock('@/app/ui', () => ({
  trainerService: jest.fn(() => ({ ownedPokemon: { detail: detailMock } })),
}));

describe('GET /api/trainer/pokedex/[identifier]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates identifier to the trainer service pokedex', async () => {
    detailMock.mockResolvedValueOnce({ id: '1', name: 'bulbasaur' });

    const response = await GET({} as Request, {
      params: Promise.resolve({ identifier: 'bulbasaur' }),
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ id: '1', name: 'bulbasaur' });
    expect(detailMock).toHaveBeenCalledWith('bulbasaur');
  });

  it('returns unauthorized when the token is missing', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true });

    const response = await GET({} as Request, {
      params: Promise.resolve({ identifier: 'bulbasaur' }),
    });
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
    expect(detailMock).not.toHaveBeenCalled();
  });

  it('maps service errors to response messages', async () => {
    detailMock.mockRejectedValueOnce(new Error('Not found'));

    const response = await GET({} as Request, {
      params: Promise.resolve({ identifier: 'missing' }),
    });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Not found' });
  });

  it('uses the default detail error message for unknown failures', async () => {
    detailMock.mockRejectedValueOnce(null);

    const response = await GET({} as Request, {
      params: Promise.resolve({ identifier: 'missing' }),
    });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not load Pokedex detail.' });
  });
});
