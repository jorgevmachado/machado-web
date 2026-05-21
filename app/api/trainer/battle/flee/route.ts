import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { trainerService } from '@/app/ui/features/trainer';
import { resolveTrainerBattleRouteError } from '../route-error';

export async function POST(): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await trainerService(session.token).fleeBattle();
    return NextResponse.json(response);
  } catch (error) {
    const { status, message } = resolveTrainerBattleRouteError(error, 'Could not flee from battle.');
    return NextResponse.json({ message }, { status });
  }
}
