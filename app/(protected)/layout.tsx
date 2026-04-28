import { redirect } from 'next/navigation';
import React from 'react';

import { getServerSession } from '@/app/shared/lib/auth/server';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await getServerSession();

  if (!session.isAuthenticated) {
    redirect('/login');
  }

  return children;
}

