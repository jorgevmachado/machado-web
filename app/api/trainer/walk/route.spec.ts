import { POST } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const walkMock = jest.fn();
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
  trainerService: jest.fn(() => ({ walk: walkMock })),
}));

describe('POST /api/trainer/walk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates to the walk service', async () => {
    walkMock.mockResolvedValueOnce({ id: 'event-1', event_type: 'POKEBALLS' });

    const response = await POST();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ id: 'event-1', event_type: 'POKEBALLS' });
    expect(walkMock).toHaveBeenCalledWith();
  });

  it('returns unauthorized without a valid session token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false, token: undefined });

    const response = await POST();
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns the fallback error message for non-Error failures', async () => {
    walkMock.mockRejectedValueOnce(undefined);

    const response = await POST();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not walk in the active encounter.' });
  });

  it('returns the service error message when available', async () => {
    walkMock.mockRejectedValueOnce(new Error('Walk failed'));

    const response = await POST();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Walk failed' });
  });
});
