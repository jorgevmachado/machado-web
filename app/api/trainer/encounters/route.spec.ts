import { GET } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const encountersMock = jest.fn();
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
  trainerService: jest.fn(() => ({ encounters: encountersMock })),
}));

describe('GET /api/trainer/encounters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates to the trainer encounters service', async () => {
    encountersMock.mockResolvedValueOnce([{ id: 'encounter-1' }]);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([{ id: 'encounter-1' }]);
    expect(encountersMock).toHaveBeenCalledWith();
  });

  it('returns the service error message when available', async () => {
    encountersMock.mockRejectedValueOnce(new Error('Boom'));

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Boom' });
  });

  it('returns the fallback error message for non-Error failures', async () => {
    encountersMock.mockRejectedValueOnce(undefined);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not load trainer encounters.' });
  });

  it('returns unauthorized without a token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true, token: undefined });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });
});
