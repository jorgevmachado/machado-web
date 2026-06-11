'use client';
import { useUser } from '@/app/ui/features/auth';
import { Text, useAlert } from '@/app/ds';
import { TrainerDashboard } from '@/app/ui/features/trainer';
import { useAppTranslation } from '@/app/i18n';
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Home() {
  const { user } = useUser();
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHandledAccessDenied = useRef(false);

  useEffect(() => {
    const reason = searchParams.get('reason');

    if (reason !== 'forbidden' || hasHandledAccessDenied.current) {
      return;
    }

    hasHandledAccessDenied.current = true;

    showAlert({
      type: 'error',
      message: t('auth.errors.accessDenied'),
    });

    router.replace('/home');
  }, [router, searchParams, showAlert, t]);

  if (user && !user.trainer) {
    return (
      <div>
        No Trainer
      </div>
    );
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
        { user?.trainer && (
          <TrainerDashboard trainer={user?.trainer}/>
        )}
      </div>
    </main>
  );
}