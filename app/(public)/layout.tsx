import { redirect } from 'next/navigation';
import React from 'react';

import { getServerSession } from '@/app/shared/lib/auth/server';

type PublicLayoutProps = {
  children: React.ReactNode;
};

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const session = await getServerSession();

  if (session.isAuthenticated) {
    redirect('/home');
  }

  return children;
}
