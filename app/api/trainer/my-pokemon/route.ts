import { NextRequest, NextResponse } from 'next/server';

import { myPokemonService } from '@/app/ui';
import { getServerSession } from '@/app/shared/lib/auth/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const response = await myPokemonService(session.token).list(params);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load My Pokemon.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const response = await myPokemonService(session.token).create(payload);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not create My Pokemon.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
