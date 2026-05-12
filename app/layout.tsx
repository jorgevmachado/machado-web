import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getServerSession } from '@/app/shared/lib/auth/server';
import {
  getAuthenticatedUserBootstrap
} from '@/app/ui/features/auth/user/server';
import { AlertProvider ,BreadcrumbProvider ,LoadingProvider } from '@/app/ds';
import { I18nProvider } from '@/app/i18n';
import { UserProvider } from '@/app/ui/features/auth';
import { NavigationFrame } from '@/app/ui';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Machado',
  description: '%s | Machado',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const { initialUser, tokenExpiresAt } = await getAuthenticatedUserBootstrap(
    session.isAuthenticated,
    session.token,
  );
  const isAuthenticated = session.isAuthenticated && Boolean(initialUser);
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className='antialiased'>
        <I18nProvider>
          <AlertProvider>
            <UserProvider
              key={session.token || 'guest-session'}
              initialUser={initialUser}
              isAuthenticated={isAuthenticated}
              tokenExpiresAt={isAuthenticated ? tokenExpiresAt : undefined}
            >
              <LoadingProvider>
                <BreadcrumbProvider>
                  <NavigationFrame isAuthenticated={isAuthenticated}>{children}</NavigationFrame>
                </BreadcrumbProvider>
              </LoadingProvider>
            </UserProvider>
          </AlertProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
