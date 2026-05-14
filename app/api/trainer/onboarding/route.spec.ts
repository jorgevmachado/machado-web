import { POST } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const onboardMock = jest.fn();
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
  trainerService: jest.fn(() => ({ onboard: onboardMock })),
}));

describe('POST /api/trainer/onboarding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates body to the onboarding service', async () => {
    onboardMock.mockResolvedValueOnce({ id: '1', name: 'bulbasaur' });

    const response = await POST({
      json: async () => ({ pokemon_name: 'bulbasaur', nickname: 'Leaf' }),
    } as Request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toEqual({ id: '1', name: 'bulbasaur' });
    expect(onboardMock).toHaveBeenCalledWith({ pokemon_name: 'bulbasaur', nickname: 'Leaf' });
  });

  it('returns unauthorized when there is no valid token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true, token: undefined });

    const response = await POST({
      json: async () => ({ pokemon_name: 'bulbasaur' }),
    } as Request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns the service error message when onboarding fails', async () => {
    onboardMock.mockRejectedValueOnce(new Error('Onboarding failed'));

    const response = await POST({
      json: async () => ({ pokemon_name: 'bulbasaur' }),
    } as Request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Onboarding failed' });
  });

  it('returns the fallback message when onboarding fails without an Error instance', async () => {
    onboardMock.mockRejectedValueOnce(undefined);

    const response = await POST({
      json: async () => ({ pokemon_name: 'bulbasaur' }),
    } as Request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not initialize trainer.' });
  });
});
