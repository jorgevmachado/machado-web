import { PUT } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const updatePartyMock = jest.fn();
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
  trainerService: jest.fn(() => ({ updateParty: updatePartyMock })),
}));

describe('PUT /api/trainer/party', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates the party payload to the service', async () => {
    updatePartyMock.mockResolvedValueOnce([{ id: 'party-1' }]);
    const request = {
      json: jest.fn(async () => ({ my_pokemon_ids: ['pokemon-1'] })),
    } as unknown as Request;

    const response = await PUT(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([{ id: 'party-1' }]);
    expect(updatePartyMock).toHaveBeenCalledWith({ my_pokemon_ids: ['pokemon-1'] });
  });

  it('returns the service error message when available', async () => {
    updatePartyMock.mockRejectedValueOnce(new Error('Party failed'));
    const request = {
      json: jest.fn(async () => ({ my_pokemon_ids: ['pokemon-1'] })),
    } as unknown as Request;

    const response = await PUT(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Party failed' });
  });

  it('returns the fallback error message for non-Error failures', async () => {
    updatePartyMock.mockRejectedValueOnce(undefined);
    const request = {
      json: jest.fn(async () => ({ my_pokemon_ids: ['pokemon-1'] })),
    } as unknown as Request;

    const response = await PUT(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not update trainer party.' });
  });

  it('returns unauthorized without a token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true, token: undefined });
    const request = {
      json: jest.fn(async () => ({ my_pokemon_ids: ['pokemon-1'] })),
    } as unknown as Request;

    const response = await PUT(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });
});
