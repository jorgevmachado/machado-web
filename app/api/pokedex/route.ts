import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { pokedexService } from '@/app/ui/features/pokedex';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const response = await pokedexService(session.token).list(params);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load Pokedex.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
