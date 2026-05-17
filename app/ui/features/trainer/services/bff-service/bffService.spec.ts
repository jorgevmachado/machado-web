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
});
