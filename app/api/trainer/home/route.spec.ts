import { GET } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const homeMock = jest.fn();
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
  trainerService: jest.fn(() => ({ home: homeMock })),
}));

describe('GET /api/trainer/home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates to the trainer home service', async () => {
    homeMock.mockResolvedValueOnce({ trainer: { id: 'trainer-1' } });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ trainer: { id: 'trainer-1' } });
    expect(homeMock).toHaveBeenCalledWith();
  });

  it('returns unauthorized without a token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true, token: undefined });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns the fallback error message for non-Error failures', async () => {
    homeMock.mockRejectedValueOnce(undefined);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not load trainer home.' });
  });

  it('returns the service error message when available', async () => {
    homeMock.mockRejectedValueOnce(new Error('Home failed'));

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Home failed' });
  });
});
