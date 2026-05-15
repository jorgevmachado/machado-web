import { GET, POST } from './route';
import { getServerSession } from '@/app/shared/lib/auth/server';

const listMock = jest.fn();
const createMock = jest.fn();
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

jest.mock('@/app/ui', () => ({
  myPokemonService: jest.fn(() => ({ list: listMock, create: createMock })),
}));

describe('GET /api/my-pokemon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates query params to the my-pokemon service', async () => {
    listMock.mockResolvedValueOnce({ items: [], meta: { total: 0 } });

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams('page=2&name=char') },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ items: [], meta: { total: 0 } });
    expect(listMock).toHaveBeenCalledWith({ page: '2', name: 'char' });
  });

  it('returns unauthorized when there is no valid session', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: false });

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams() },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns unauthorized when the session has no token', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true, token: undefined });

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams() },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns the service error message when list fails', async () => {
    listMock.mockRejectedValueOnce(new Error('Could not fetch roster'));

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams() },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not fetch roster' });
  });

  it('returns the fallback message when list fails without an Error instance', async () => {
    listMock.mockRejectedValueOnce('');

    const response = await GET({
      nextUrl: { searchParams: new URLSearchParams() },
    } as never);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not load My Pokemon.' });
  });
});

describe('POST /api/my-pokemon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ isAuthenticated: true, token: 'token' });
  });

  it('delegates body to the create service', async () => {
    createMock.mockResolvedValueOnce({ id: '1', name: 'bulbasaur' });

    const response = await POST({
      json: async () => ({ pokemon_name: 'bulbasaur', nickname: 'Leaf' }),
    } as Request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toEqual({ id: '1', name: 'bulbasaur' });
    expect(createMock).toHaveBeenCalledWith({ pokemon_name: 'bulbasaur', nickname: 'Leaf' });
  });

  it('returns unauthorized when there is no token for create', async () => {
    getServerSessionMock.mockResolvedValueOnce({ isAuthenticated: true, token: undefined });

    const response = await POST({
      json: async () => ({ pokemon_name: 'bulbasaur' }),
    } as Request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: 'Unauthorized' });
  });

  it('returns the service error message when create fails', async () => {
    createMock.mockRejectedValueOnce(new Error('Create failed'));

    const response = await POST({
      json: async () => ({ pokemon_name: 'bulbasaur' }),
    } as Request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Create failed' });
  });

  it('returns the fallback message when create fails without an Error instance', async () => {
    createMock.mockRejectedValueOnce(null);

    const response = await POST({
      json: async () => ({ pokemon_name: 'bulbasaur' }),
    } as Request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ message: 'Could not create My Pokemon.' });
  });
});
