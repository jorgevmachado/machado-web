import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { pokemonGrowthRateService } from '@/app/ui/features/pokemon/growth_rate';

type PokemonGrowthRateDetailRouteContext = {
  params: Promise<{
    identifier: string;
  }>;
};

export async function GET(
  _request: Request,
  context: PokemonGrowthRateDetailRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await pokemonGrowthRateService(session.token).detail(identifier);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load Pokemon Growth Rate detail.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
