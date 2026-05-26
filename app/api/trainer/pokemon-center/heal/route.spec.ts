import { POST } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const healPokemonCenterMock = jest.fn();
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
  trainerService: jest.fn(() => ({ healPokemonCenter: healPokemonCenterMock })),
}));

jest.mock('../route-error', () => ({
  resolveTrainerPokemonCenterRouteError: (...args: unknown[]) => resolveTrainerPokemonCenterRouteErrorMock(...args),
}));

describe('POST /api/trainer/pokemon-center/heal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
    resolveTrainerPokemonCenterRouteErrorMock.mockReturnValue({
      status: 503,
      message: 'Could not heal trainer party.',
    });
  });

  it('delegates healing to the trainer service', async () => {
    healPokemonCenterMock.mockResolvedValueOnce({ success: true, restored_pokemon: [] });

    const response = await POST();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true, restored_pokemon: [] });
  });

  it('returns unauthorized without a token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true, token: undefined });

    const response = await POST();
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('maps service errors through the route error resolver', async () => {
    const error = new Error('service down');
    healPokemonCenterMock.mockRejectedValueOnce(error);

    const response = await POST();
    const json = await response.json();

    expect(resolveTrainerPokemonCenterRouteErrorMock).toHaveBeenCalledWith(
      error,
      'Could not heal trainer party.',
    );
    expect(response.status).toBe(503);
    expect(json).toEqual({ message: 'Could not heal trainer party.' });
  });
});
