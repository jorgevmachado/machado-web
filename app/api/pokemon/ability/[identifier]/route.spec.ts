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

jest.mock('@/app/ui/features/pokemon/ability', () => ({
  pokemonAbilityService: jest.fn(() => ({ detail: detailMock })),
}));

describe('GET /api/pokemon/ability/[identifier]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates identifier to the pokemon ability service', async () => {
    detailMock.mockResolvedValueOnce({ id: '1', name: 'overgrow' });

    const response = await GET({} as Request, { params: Promise.resolve({ identifier: 'overgrow' }) });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ id: '1', name: 'overgrow' });
    expect(detailMock).toHaveBeenCalledWith('overgrow');
  });

  it('returns unauthorized without a token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true });

    const response = await GET({} as Request, { params: Promise.resolve({ identifier: 'overgrow' }) });
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
    expect(detailMock).not.toHaveBeenCalled();
  });

  it('returns service error messages and fallback errors', async () => {
    detailMock.mockRejectedValueOnce(new Error('Ability missing'));

    const errorResponse = await GET({} as Request, { params: Promise.resolve({ identifier: 'missing' }) });
    expect(errorResponse.status).toBe(500);
    await expect(errorResponse.json()).resolves.toEqual({ message: 'Ability missing' });

    detailMock.mockRejectedValueOnce(undefined);

    const fallbackResponse = await GET({} as Request, { params: Promise.resolve({ identifier: 'missing' }) });
    expect(fallbackResponse.status).toBe(500);
    await expect(fallbackResponse.json()).resolves.toEqual({ message: 'Could not load Pokemon ability detail.' });
  });
});
