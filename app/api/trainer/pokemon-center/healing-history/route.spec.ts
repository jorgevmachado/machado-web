import { GET } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const healingHistoryMock = jest.fn();
const getServerSessionMock = getServerSession as jest.Mock;
const resolveTrainerPokemonCenterRouteErrorMock = jest.fn();

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
  trainerService: jest.fn(() => ({ healingHistory: healingHistoryMock })),
}));

jest.mock('../route-error', () => ({
  resolveTrainerPokemonCenterRouteError: (...args: unknown[]) => resolveTrainerPokemonCenterRouteErrorMock(...args),
}));

describe('GET /api/trainer/pokemon-center/healing-history', () => {
  const buildRequest = (url: string) => ({ url }) as Request;

  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
    resolveTrainerPokemonCenterRouteErrorMock.mockReturnValue({
      status: 503,
      message: 'Could not load pokemon center healing history.',
    });
  });

  it('delegates history loading to the trainer service', async () => {
    healingHistoryMock.mockResolvedValueOnce({ items: [], meta: { total: 0 } });

    const response = await GET(buildRequest('http://localhost/api/trainer/pokemon-center/healing-history?limit=20'));
    const json = await response.json();

    expect(healingHistoryMock).toHaveBeenCalledWith(20);
    expect(response.status).toBe(200);
    expect(json).toEqual({ items: [], meta: { total: 0 } });
  });

  it('falls back to default limit when query limit is not finite', async () => {
    healingHistoryMock.mockResolvedValueOnce({ items: [], meta: { total: 0 } });

    const response = await GET(buildRequest('http://localhost/api/trainer/pokemon-center/healing-history?limit=invalid'));
    const json = await response.json();

    expect(healingHistoryMock).toHaveBeenCalledWith(12);
    expect(response.status).toBe(200);
    expect(json).toEqual({ items: [], meta: { total: 0 } });
  });

  it('returns unauthorized without a token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false, token: undefined });

    const response = await GET(buildRequest('http://localhost/api/trainer/pokemon-center/healing-history'));
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('maps service errors through the route error resolver', async () => {
    const error = new Error('service down');
    healingHistoryMock.mockRejectedValueOnce(error);

    const response = await GET(buildRequest('http://localhost/api/trainer/pokemon-center/healing-history'));
    const json = await response.json();

    expect(resolveTrainerPokemonCenterRouteErrorMock).toHaveBeenCalledWith(
      error,
      'Could not load pokemon center healing history.',
    );
    expect(response.status).toBe(503);
    expect(json).toEqual({ message: 'Could not load pokemon center healing history.' });
  });
});
