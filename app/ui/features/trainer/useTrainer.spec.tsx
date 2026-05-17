import { act, renderHook } from '@testing-library/react';

import useTrainer from './useTrainer';

const startContentLoadingMock = jest.fn();
const stopContentLoadingMock = jest.fn();
const showAlertMock = jest.fn();
const onboardingMock = jest.fn();

jest.mock('@/app/ds', () => ({
  useLoading: () => ({
    startContentLoading: startContentLoadingMock,
    stopContentLoading: stopContentLoadingMock,
  }),
  useAlert: () => ({
    showAlert: showAlertMock,
  }),
}));

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string) => `translated:${key}`,
  }),
}));

jest.mock('@/app/ui/features/trainer/services', () => ({
  trainerBffService: {
    onboarding: (...args: unknown[]) => onboardingMock(...args),
  },
}));

describe('useTrainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns trainer data and shows success alert', async () => {
    onboardingMock.mockResolvedValueOnce({
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'myPokemon.onboarding.submitError',
      data: { id: 'trainer-1' },
    });

    const { result } = renderHook(() => useTrainer());

    await act(async () => {
      await expect(result.current.onboarding({ nickname: 'Leaf', pokemon_name: 'bulbasaur' })).resolves.toEqual({ id: 'trainer-1' });
    });

    expect(onboardingMock).toHaveBeenCalledWith({
      nickname: 'Leaf',
      pokemon_name: 'bulbasaur',
      fetchErrorMessage: 'myPokemon.onboarding.submitError',
    });
    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'success',
      message: 'translated:myPokemon.onboarding.success',
    });
    expect(startContentLoadingMock).toHaveBeenCalledTimes(1);
    expect(stopContentLoadingMock).toHaveBeenCalledTimes(1);
  });

  it('shows translated response errors and caught fallbacks', async () => {
    onboardingMock
      .mockResolvedValueOnce({
        error: true,
        status: 500,
        message: 'Internal Error',
        i18nMessage: 'myPokemon.onboarding.submitError',
      })
      .mockRejectedValueOnce(null)
      .mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useTrainer());

    await act(async () => {
      await expect(result.current.onboarding({ nickname: 'Leaf', pokemon_name: 'bulbasaur' })).resolves.toBeUndefined();
      await expect(result.current.onboarding({ nickname: 'Leaf', pokemon_name: 'bulbasaur' }, 'trainer.customError')).resolves.toBeUndefined();
      await expect(result.current.onboarding({ nickname: 'Leaf', pokemon_name: 'bulbasaur' }, 'trainer.customError')).resolves.toBeUndefined();
    });

    expect(showAlertMock).toHaveBeenNthCalledWith(1, {
      type: 'error',
      message: 'translated:myPokemon.onboarding.submitError',
    });
    expect(showAlertMock).toHaveBeenNthCalledWith(2, {
      type: 'error',
      message: 'translated:trainer.customError',
    });
    expect(showAlertMock).toHaveBeenNthCalledWith(3, {
      type: 'error',
      message: 'boom',
    });
  });
});
