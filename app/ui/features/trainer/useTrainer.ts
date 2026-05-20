import { useAlert, useLoading } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { useCallback } from 'react';
import { trainerBffService } from '@/app/ui/features/trainer/services';
import {TTrainer, TTrainerEncounter, TTrainerHome} from '@/app/ui/features/trainer/types';
import { OnboardingTrainerBffParams } from '@/app/ui/features/trainer/services/bff-service/types';

type UseTrainerResult = {
  home: () => Promise<TTrainerHome | undefined>;
  encounters: () => Promise<TTrainerEncounter | undefined>;
  onboarding: (params: Omit<OnboardingTrainerBffParams, 'fetchErrorMessage'>, fetchErrorMessage?: string) => Promise<TTrainer | undefined>;
};

const useTrainer = (): UseTrainerResult => {
  const { startContentLoading, stopContentLoading } = useLoading();
  const { showAlert } = useAlert();
  const { t } = useAppTranslation();

  const onboarding = useCallback(async (params: Omit<OnboardingTrainerBffParams, 'fetchErrorMessage'>, fetchErrorMessage: string = 'myPokemon.onboarding.submitError'): Promise<TTrainer | undefined> => {
    startContentLoading();
    const errorMessage = t(fetchErrorMessage);
    try {
      const response = await trainerBffService.onboarding({ ...params, fetchErrorMessage });
      if (response.error && !response?.data) {
        const message = t(response.i18nMessage);
        showAlert({ type: 'error', message });
        return;
      }
      showAlert({ type: 'success', message: t('myPokemon.onboarding.success') });
      return response.data;
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : errorMessage;
      showAlert({ type: 'error', message });
    } finally {
      stopContentLoading();
    }
  }, [showAlert, startContentLoading, stopContentLoading, t]);

  const home = useCallback(async (): Promise<TTrainerHome | undefined> => {
    startContentLoading();
    try {
      const response = await trainerBffService.home();
      if (response.error && !response?.data) {
        const message = t(response.i18nMessage);
        showAlert({ type: 'error', message });
        return;
      }
      showAlert({ type: 'success', message: t('trainer.home.success') });
      return response.data;
    } catch (error) {
      showAlert({ type: 'error', message: error?.message ?? '' });
    } finally {
      stopContentLoading();
    }
  }, [showAlert, startContentLoading, stopContentLoading, t]);

  const encounters = useCallback(async (): Promise<TTrainerEncounter | undefined> => {
    startContentLoading();
    try {
      const response = await trainerBffService.encounters();
      if (response.error && !response?.data) {
        const message = t(response.i18nMessage);
        showAlert({ type: 'error', message });
        return;
      }
      showAlert({ type: 'success', message: t('trainer.encounters.success') });
      return response.data;
    } catch (error) {
      showAlert({ type: 'error', message: error?.message ?? '' });
    } finally {
      stopContentLoading();
    }
  }, [showAlert, startContentLoading, stopContentLoading, t]);

  return {
    home,
    encounters,
    onboarding
  };
};

export default useTrainer;
