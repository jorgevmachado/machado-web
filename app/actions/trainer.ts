'use server';

import type { AuthActionState } from '@/app/shared/lib/auth/action-state';
import { getServerSession } from '@/app/shared/lib/auth/server';
import type { ResponseError } from '@/app/shared/services/http';
import { trainerService } from '@/app/ui/features/trainer/service';

const toErrorState = (message: string): AuthActionState => ({ status: 'error', message });

export async function initializeTrainerAction(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const pokeballs = parseInt(formData.get('pokeballs') as string, 10);
  const capture_rate = parseInt(formData.get('capture_rate') as string, 10);

  if (!Number.isInteger(pokeballs) || pokeballs <= 0) {
    return toErrorState('Pokeballs must be a positive number.');
  }

  if (!Number.isInteger(capture_rate) || capture_rate <= 0) {
    return toErrorState('Capture rate must be a positive number.');
  }

  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return toErrorState('You must be logged in to initialize your trainer.');
  }

  try {
    await trainerService(session.token).initialize({ pokeballs, capture_rate });

    return { status: 'success', message: 'Trainer initialized successfully!' };
  } catch (error) {
    const responseError = error as ResponseError | undefined;
    const message = responseError?.message ?? 'Failed to initialize trainer. Please try again.';

    return toErrorState(message);
  }
}
