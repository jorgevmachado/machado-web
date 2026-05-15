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
  myPokemonService: jest.fn(() => ({ detail: detailMock })),
}));

describe('GET /api/my-pokemon/[name]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates name to the detail service', async () => {
    detailMock.mockResolvedValueOnce({ id: '1', name: 'bulbasaur' });

    const response = await GET({} as Request, {
      params: Promise.resolve({ name: 'bulbasaur' }),
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ id: '1', name: 'bulbasaur' });
    expect(detailMock).toHaveBeenCalledWith('bulbasaur');
  });

  it('returns unauthorized when there is no valid token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true, token: undefined });

    const response = await GET({} as Request, {
      params: Promise.resolve({ name: 'bulbasaur' }),
    });
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns the service error message when detail fails', async () => {
    detailMock.mockRejectedValueOnce(new Error('Detail failed'));

    const response = await GET({} as Request, {
      params: Promise.resolve({ name: 'bulbasaur' }),
    });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Detail failed' });
  });

  it('returns the fallback message when detail fails without an Error instance', async () => {
    detailMock.mockRejectedValueOnce(undefined);

    const response = await GET({} as Request, {
      params: Promise.resolve({ name: 'bulbasaur' }),
    });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not load My Pokemon detail.' });
  });
});
