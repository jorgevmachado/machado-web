import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { trainerService } from '@/app/ui/features/trainer';
import { resolveTrainerPokemonCenterRouteError } from '../route-error';

export async function GET(request: Request): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit') ?? '12');
    const response = await trainerService(session.token).healingHistory(Number.isFinite(limit) ? limit : 12);
    return NextResponse.json(response);
  } catch (error) {
    const { status, message } = resolveTrainerPokemonCenterRouteError(
      error,
      'Could not load pokemon center healing history.',
    );
    return NextResponse.json({ message }, { status });
  }
}
