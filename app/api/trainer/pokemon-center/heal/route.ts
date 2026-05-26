import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { trainerService } from '@/app/ui/features/trainer';
import { resolveTrainerPokemonCenterRouteError } from '../route-error';

export async function POST(): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await trainerService(session.token).healPokemonCenter();
    return NextResponse.json(response);
  } catch (error) {
    const { status, message } = resolveTrainerPokemonCenterRouteError(
      error,
      'Could not heal trainer party.',
    );
    return NextResponse.json({ message }, { status });
  }
}
