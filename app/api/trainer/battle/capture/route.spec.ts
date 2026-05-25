import { POST } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const captureBattlePokemonMock = jest.fn();
const getServerSessionMock = getServerSession as jest.Mock;
const resolveTrainerBattleRouteErrorMock = jest.fn();

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
  trainerService: jest.fn(() => ({ captureBattlePokemon: captureBattlePokemonMock })),
}));

jest.mock('../route-error', () => ({
  resolveTrainerBattleRouteError: (...args: unknown[]) => resolveTrainerBattleRouteErrorMock(...args),
}));

describe('POST /api/trainer/battle/capture', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
    resolveTrainerBattleRouteErrorMock.mockReturnValue({
      status: 503,
      message: 'Could not capture battle pokemon.',
    });
  });

  it('delegates capture to the trainer battle service', async () => {
    captureBattlePokemonMock.mockResolvedValueOnce({ success: true, outcome: 'CAPTURED' });

    const response = await POST(
      {
        json: async () => ({ nickname: 'Sparky' }),
      } as Request,
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true, outcome: 'CAPTURED' });
  });

  it('returns 401 when not authenticated', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false, token: 'token' });

    const response = await POST({ json: async () => ({}) } as Request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('maps service errors through the route error resolver', async () => {
    const error = new Error('service down');
    captureBattlePokemonMock.mockRejectedValueOnce(error);

    const response = await POST({ json: async () => ({ nickname: 'Sparky' }) } as Request);
    const json = await response.json();

    expect(resolveTrainerBattleRouteErrorMock).toHaveBeenCalledWith(
      error,
      'Could not capture battle pokemon.',
    );
    expect(response.status).toBe(503);
    expect(json).toEqual({ message: 'Could not capture battle pokemon.' });
  });

  it('falls back to an empty payload when request json parsing fails', async () => {
    captureBattlePokemonMock.mockResolvedValueOnce({ success: true, outcome: 'FAILED_CHANCE' });

    const response = await POST({
      json: async () => {
        throw new Error('invalid json');
      },
    } as Request);
    const json = await response.json();

    expect(captureBattlePokemonMock).toHaveBeenCalledWith({});
    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true, outcome: 'FAILED_CHANCE' });
  });
});
