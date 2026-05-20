import { GET } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const activeBattleMock = jest.fn();
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

jest.mock('@/app/ui/features/trainer', () => ({
  trainerService: jest.fn(() => ({ activeBattle: activeBattleMock })),
}));

describe('GET /api/trainer/battle/active', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates to the active battle service', async () => {
    activeBattleMock.mockResolvedValueOnce({ id: 'battle-1', status: 'ACTIVE' });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ id: 'battle-1', status: 'ACTIVE' });
  });

  it('returns 401 when not authenticated', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false, token: 'token' });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns 401 when token is missing', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true, token: null });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns 500 with error message when activeBattle throws Error', async () => {
    activeBattleMock.mockRejectedValueOnce(new Error('Battle not found'));

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Battle not found' });
  });

  it('returns 500 with fallback message when activeBattle throws non-Error', async () => {
    activeBattleMock.mockRejectedValueOnce('unexpected error');

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not load active battle.' });
  });
});
