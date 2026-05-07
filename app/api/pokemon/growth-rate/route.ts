import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { pokemonGrowthRateService } from '@/app/ui/features/pokemon/growth_rate';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const response = await pokemonGrowthRateService(session.token).list(params);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load Pokemon Growth Rate.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
