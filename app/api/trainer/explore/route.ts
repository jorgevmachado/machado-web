import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { trainerService } from '@/app/ui';

export async function POST(): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await trainerService(session.token).explore();
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not explore pokemon word.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
