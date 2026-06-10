import { getServerSession } from '@/app/shared/lib/auth/server';

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

jest.mock('@/app/ui', () => ({
  pokemonService: jest.fn(() => ({ type: { detail: detailMock } })),
}));

const getServerSessionMock = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('GET /api/pokemon/type/[identifier]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates identifier to the pokemon type service', async () => {
    detailMock.mockResolvedValueOnce({ id: '1', name: 'fire' });

    const response = await GET({} as Request, { params: Promise.resolve({ identifier: 'fire' }) });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ id: '1', name: 'fire' });
    expect(detailMock).toHaveBeenCalledWith('fire');
  });

  it('returns unauthorized without a session', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false });

    const response = await GET({} as Request, { params: Promise.resolve({ identifier: 'fire' }) });
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
    expect(detailMock).not.toHaveBeenCalled();
  });

  it('returns service and fallback error messages', async () => {
    detailMock.mockRejectedValueOnce(new Error('Type missing'));

    const errorResponse = await GET({} as Request, { params: Promise.resolve({ identifier: 'missing' }) });
    expect(errorResponse.status).toBe(500);
    await expect(errorResponse.json()).resolves.toEqual({ message: 'Type missing' });

    detailMock.mockRejectedValueOnce(null);

    const fallbackResponse = await GET({} as Request, { params: Promise.resolve({ identifier: 'missing' }) });
    expect(fallbackResponse.status).toBe(500);
    await expect(fallbackResponse.json()).resolves.toEqual({ message: 'Could not load Pokemon type detail.' });
  });
});
