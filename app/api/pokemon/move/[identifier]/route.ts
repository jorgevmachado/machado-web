import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { pokemonMoveService } from '@/app/ui/features/pokemon/move';

type PokemonMoveDetailRouteContext = {
  params: Promise<{
    identifier: string;
  }>;
};

export async function GET(
  _request: Request,
  context: PokemonMoveDetailRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await pokemonMoveService(session.token).detail(identifier);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load Pokemon move detail.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
