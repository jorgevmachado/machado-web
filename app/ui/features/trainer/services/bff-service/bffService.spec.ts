import { TrainerBffService } from './bffService';

describe('TrainerBffService', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('builds the onboarding payload and returns success responses', async () => {
    const service = new TrainerBffService('https://api.example.com');
    const postSpy = jest.spyOn(service, 'post').mockResolvedValueOnce({ id: 'trainer-1' } as never);

    await expect(service.onboarding({
      is_admin: true,
      nickname: 'Leaf',
      pokeballs: 3,
      capture_rate: 75,
      pokemon_name: 'bulbasaur',
      fetchErrorMessage: 'trainer.error',
    })).resolves.toEqual({
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'trainer.error',
      data: { id: 'trainer-1' },
    });

    expect(postSpy).toHaveBeenCalledWith('https://api.example.com/onboarding', {
      body: {
        nickname: 'Leaf',
        pokemon_name: 'bulbasaur',
        pokeballs: 3,
        capture_rate: 75,
      },
    });
  });

  it('omits admin-only fields when needed and maps service errors', async () => {
    const service = new TrainerBffService('https://api.example.com');
    const postSpy = jest.spyOn(service, 'post').mockResolvedValueOnce({
      statusCode: 422,
      message: 'Validation failed',
    } as never);

    await expect(service.onboarding({
      is_admin: false,
      nickname: 'Leaf',
      pokeballs: 3,
      capture_rate: 75,
      pokemon_name: 'bulbasaur',
      fetchErrorMessage: 'trainer.error',
    })).resolves.toEqual({
      error: true,
      status: 422,
      message: 'Validation failed',
      i18nMessage: 'trainer.error',
    });

    expect(postSpy).toHaveBeenCalledWith('https://api.example.com/onboarding', {
      body: {
        nickname: 'Leaf',
        pokemon_name: 'bulbasaur',
      },
    });
  });

  it('returns home data on successful responses', async () => {
    const service = new TrainerBffService('https://api.example.com');
    const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce({
      trainer: {
        id: 'trainer-1',
      },
    } as never);

    await expect(service.home()).resolves.toEqual({
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'trainer.home.loadError',
      data: {
        trainer: {
          id: 'trainer-1',
        },
      },
    });

    expect(getSpy).toHaveBeenCalledWith('https://api.example.com/home');
  });

  it('maps home errors from the BFF response shape', async () => {
    const service = new TrainerBffService('https://api.example.com');
    const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce({
      statusCode: 503,
      message: 'Service unavailable',
    } as never);

    await expect(service.home()).resolves.toEqual({
      error: true,
      status: 503,
      message: 'Service unavailable',
      i18nMessage: 'trainer.home.loadError',
    });

    expect(getSpy).toHaveBeenCalledWith('https://api.example.com/home');
  });

  it('returns encounters data on successful responses', async () => {
    const service = new TrainerBffService('https://api.example.com');
    const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce({
      encounter_count: 5,
    } as never);

    await expect(service.encounters()).resolves.toEqual({
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'trainer.encounter.loadError',
      data: {
        encounter_count: 5,
      },
    });

    expect(getSpy).toHaveBeenCalledWith('https://api.example.com/encounters');
  });

  it('maps encounters errors from the BFF response shape', async () => {
    const service = new TrainerBffService('https://api.example.com');
    const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce({
      statusCode: 401,
      message: 'Unauthorized',
    } as never);

    await expect(service.encounters()).resolves.toEqual({
      error: true,
      status: 401,
      message: 'Unauthorized',
      i18nMessage: 'trainer.encounter.loadError',
    });

    expect(getSpy).toHaveBeenCalledWith('https://api.example.com/encounters');
  });
});
