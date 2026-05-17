'use client';

import { Text } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { useUser } from '@/app/ui/features/auth';
import TrainerDashboard from './components/dashboard';
import HomeOnboarding from './components/onboarding';

export default function Home() {
  const { t } = useAppTranslation();
  const { user } = useUser();

  if (user && !user.trainer) {
    return <HomeOnboarding />;
  }

  return (
    <main className='min-h-screen rounded-3xl bg-white/90 px-6 py-10 shadow-sm'>
      <div className='mx-auto flex max-w-7xl flex-col gap-6'>
        <div className='flex flex-col gap-3'>
          <Text as='h1' className='text-3xl font-bold text-slate-950 sm:text-4xl'>
            {t('home.title')}
          </Text>
          <Text className='max-w-2xl text-slate-600'>
            {t('home.welcome')}
          </Text>
        </div>
        <TrainerDashboard />
      </div>
    </main>
  );
}
