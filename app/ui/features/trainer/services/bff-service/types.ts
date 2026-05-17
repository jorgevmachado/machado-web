import { OnboardingTrainerParams } from '@/app/ui/features/trainer/types';

export type OnboardingTrainerBffParams = OnboardingTrainerParams & {
  is_admin: boolean;
  fetchErrorMessage: string;
};
