'use client';

import { useActionState } from 'react';
import Link from 'next/link';

import { INITIAL_AUTH_ACTION_STATE } from '@/app/shared/lib/auth';
import { loginAction } from '@/app/actions/auth';
import { Text, Button } from '@/app/ds';
import { translateI18nMessage, useAppTranslation } from '@/app/i18n';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_AUTH_ACTION_STATE);
  const { t } = useAppTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <Text weight="bold" size="2xl" color="text-gray-900" className="mb-2">{t('auth.login.title')}</Text>
        <Text size="sm" color="text-gray-500" className="mb-6">{t('auth.login.subtitle')}</Text>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="credential" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.login.credentialLabel')}
            </label>
            <input
              id="credential"
              name="credential"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.login.credentialPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.login.passwordLabel')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.login.passwordPlaceholder')}
            />
          </div>

          {state.status === 'error' && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {translateI18nMessage(t, state.message)}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4"
          >
            {isPending ? t('auth.login.submitting') : t('auth.login.submit')}
          </Button>
        </form>

        <Text size="sm" color="text-gray-500" className="text-center">
          {t('auth.login.noAccount')}{' '}
          <Link href="/register" className="text-indigo-600 hover:underline font-medium">
            {t('auth.login.signUp')}
          </Link>
        </Text>
      </div>
    </div>
  );
}
