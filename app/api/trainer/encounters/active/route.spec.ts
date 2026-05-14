import { PUT } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const selectActiveEncounterMock = jest.fn();
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
  trainerService: jest.fn(() => ({ selectActiveEncounter: selectActiveEncounterMock })),
}));

describe('PUT /api/trainer/encounters/active', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('passes the request payload to the service', async () => {
    selectActiveEncounterMock.mockResolvedValueOnce({ id: 'encounter-2', is_active: true });
    const request = {
      json: jest.fn(async () => ({ encounter_id: 'encounter-2' })),
    } as unknown as Request;

    const response = await PUT(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ id: 'encounter-2', is_active: true });
    expect(selectActiveEncounterMock).toHaveBeenCalledWith({ encounter_id: 'encounter-2' });
  });

  it('returns the fallback error message for non-Error failures', async () => {
    selectActiveEncounterMock.mockRejectedValueOnce(undefined);
    const request = {
      json: jest.fn(async () => ({ encounter_id: 'encounter-2' })),
    } as unknown as Request;

    const response = await PUT(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not select trainer encounter.' });
  });

  it('returns the service error message when available', async () => {
    selectActiveEncounterMock.mockRejectedValueOnce(new Error('Select failed'));
    const request = {
      json: jest.fn(async () => ({ encounter_id: 'encounter-2' })),
    } as unknown as Request;

    const response = await PUT(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Select failed' });
  });

  it('returns unauthorized without a token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false, token: undefined });
    const request = {
      json: jest.fn(async () => ({ encounter_id: 'encounter-2' })),
    } as unknown as Request;

    const response = await PUT(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });
});
