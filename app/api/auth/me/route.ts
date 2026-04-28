import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { authService } from '@/app/ui/features/auth';

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await authService(session.token).me();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
