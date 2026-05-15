import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { pokedexService } from '@/app/ui';

type Params = Promise<{ name: string }>;

export async function POST(_request: Request, { params }: { params: Params }): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await params;
    const response = await pokedexService(session.token).discover(name);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not discover Pokedex entry.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
