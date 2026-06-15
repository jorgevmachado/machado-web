import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { trainerService } from '@/app/ui';

type PokemonDetailRouteContext = {
  params: Promise<{
    identifier: string;
  }>;
};

export async function GET(
  _request: Request,
  context: PokemonDetailRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await trainerService(session.token).battle.detail(identifier);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load Battle detail.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
